import { dynamoDB, s3 } from "@/src/utils/awsAgent";
import { GetCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;
const USER_GSI_INDEX = "GSI1-index";

// shared shape normalizer
function shapeAnswers(userAnswers = []) {
  return userAnswers.map((a) => ({
    questionID: a.questionID || "",
    selectedOptions: a.selectedOptions || [],
    blankAnswers: a.blankAnswers || [],
    markedForReview: a.markedForReview || false,
    timeSpentMs: a.timeSpentMs || 0,
    viewedAt: a.viewedAt || null,
    answeredAt: a.answeredAt || null,
  }));
}

/**
 * Compute scoring for a single question, with no partial credit for MSQ/FIB:
 * - MCQ: full pMark if correct choice, else nMark
 * - MSQ: full pMark only if exact match, else nMark
 * - FIB: full pMark only if all blanks correct, else nMark
 */
function scoreAnswer(meta, selectedOptions = [], blankAnswers = []) {
  let isCorrect = false;
  let pMark = 0;
  let nMark = 0;

  switch (meta.type) {
    case "MCQ": {
      const sel = selectedOptions[0];
      if (sel != null && meta.correct[0]?.id === sel) {
        isCorrect = true;
        pMark = meta.pMark;
      } else {
        nMark = meta.nMark;
      }
      break;
    }
    case "MSQ": {
      const correctIds = new Set(meta.correct.map((c) => c.id));
      const pickedIds = new Set(selectedOptions);
      const exactMatch =
        pickedIds.size === correctIds.size &&
        [...pickedIds].every((id) => correctIds.has(id));

      if (exactMatch) {
        isCorrect = true;
        pMark = meta.pMark;
      } else {
        nMark = meta.nMark;
      }
      break;
    }
    case "FIB": {
      // Ignore all‑blank submissions
      if (blankAnswers.length === 0 || blankAnswers.every((b) => !b.trim())) {
        break;
      }
      const allCorrect = meta.blanks.every((blankMeta, idx) => {
        const ans = (blankAnswers[idx] || "").trim().toLowerCase();
        return blankMeta.correctAnswers
          .map((s) => s.trim().toLowerCase())
          .includes(ans);
      });
      if (allCorrect && blankAnswers.length === meta.blanks.length) {
        isCorrect = true;
        pMark = meta.pMark;
      } else {
        nMark = meta.nMark;
      }
      break;
    }
    default:
      throw new Error(`Unsupported question type: ${meta.type}`);
  }

  return { isCorrect, pMark, nMark };
}

// helper to fetch the attempt item
async function fetchAttempt(attemptID) {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: USER_TABLE,
      Key: { pKey: `EXAM_ATTEMPT#${attemptID}`, sKey: "EXAM_ATTEMPTS" },
    })
  );
  if (!result.Item) throw new Error("Attempt not found");
  return result.Item;
}

// helper to write back a full updated userAnswers array
async function writeAnswers(attemptID, userAnswers) {
  await dynamoDB.send(
    new UpdateCommand({
      TableName: USER_TABLE,
      Key: { pKey: `EXAM_ATTEMPT#${attemptID}`, sKey: "EXAM_ATTEMPTS" },
      UpdateExpression: "SET userAnswers = :ua, updatedAt = :now",
      ExpressionAttributeValues: {
        ":ua": userAnswers,
        ":now": Date.now(),
      },
    })
  );
}

async function checkExamAttempt(attempt) {
  const { startTimeStamp, duration, status } = attempt;
  const now = Date.now();
  const timeLimit = startTimeStamp + duration * 1000 * 60;
  if (now > timeLimit && status === "IN_PROGRESS") {
    await submitExam(attempt.id, "AUTO");
    throw new Error("Exam attempt expired");
  }
  if (status === "COMPLETED") {
    throw new Error("Exam attempt already completed");
  }
}
// ——————————————————————————————————————————
// 1) Mark‐Viewed (fire‐and‐forget)
// ——————————————————————————————————————————
export async function viewQuestion(attemptID, questionID) {
  // 1) Fetch the *current* attempt
  const attempt = await fetchAttempt(attemptID);
  const { userAnswers: originalAnswers } = attempt;

  // Check if the exam attempt is expired
  await checkExamAttempt(attempt);

  // 2) If it’s already there, just return it
  if (originalAnswers.some((a) => a.questionID === questionID)) {
    return {
      success: true,
      data: shapeAnswers(originalAnswers),
      serverTimestamp: Date.now(),
    };
  }

  // 3) Otherwise append via a conditional update
  try {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: USER_TABLE,
        Key: { pKey: `EXAM_ATTEMPT#${attemptID}`, sKey: "EXAM_ATTEMPTS" },
        // only append if not already present *in storage*
        ConditionExpression: "NOT contains(userAnswers, :qID)",
        UpdateExpression: `
          SET userAnswers = list_append(
            if_not_exists(userAnswers, :emptyList),
            :newItem
          ),
          updatedAt = :now
        `,
        ExpressionAttributeValues: {
          ":qID": questionID,
          ":emptyList": [],
          ":newItem": [
            {
              questionID,
              selectedOptions: [],
              blankAnswers: [],
              markedForReview: false,
              timeSpentMs: 0,
              viewedAt: Date.now(),
              isCorrect: false,
              pMarkObtained: 0,
              nMarkObtained: 0,
              answeredAt: null,
            },
          ],
          ":now": Date.now(),
        },
      })
    );
  } catch (err) {
    // ignore if someone else already wrote it
    if (err.name !== "ConditionalCheckFailedException") throw err;
  }

  // 4) Re-fetch the updated list from storage
  const { userAnswers: updatedAnswers } = await fetchAttempt(attemptID);

  // 5) Optional: dedupe in case of a race
  const unique = Array.from(
    new Map(updatedAnswers.map((u) => [u.questionID, u])).values()
  );

  return {
    success: true,
    data: shapeAnswers(unique),
    serverTimestamp: Date.now(),
  };
}

// ——————————————————————————————————————————
// 2) Submit‐Answer
// ——————————————————————————————————————————
/**
 * Records the student’s response to one question, applying “all‑or‑nothing”
 * scoring for MSQ and FIB (no partial credit).
 */
export async function questionResponse(
  attemptID,
  questionID,
  selectedOptions = [],
  blankAnswers = [],
  timeSpentMs = 0
) {
  // 1) Load attempt data
  const attempt = await fetchAttempt(attemptID);
  const { userAnswers, answerList } = attempt;

  // Check if the exam attempt is expired
  await checkExamAttempt(attempt);

  // 2) Map metadata by questionID for O(1) lookup
  const metaById = Object.fromEntries(answerList.map((q) => [q.questionID, q]));

  // 3) Locate user answer slot
  const uaIdx = userAnswers.findIndex((a) => a.questionID === questionID);
  if (uaIdx < 0) throw new Error("Question not viewed yet");

  // 4) Fetch metadata
  const meta = metaById[questionID];
  if (!meta) throw new Error("Question metadata missing");

  // 5) Compute score
  const { isCorrect, pMark, nMark } = scoreAnswer(
    meta,
    selectedOptions,
    blankAnswers
  );

  // 6) Build updated answer
  const updated = {
    ...userAnswers[uaIdx],
    selectedOptions,
    blankAnswers,
    timeSpentMs,
    answeredAt: Date.now(),
    isCorrect,
    pMarkObtained: pMark,
    nMarkObtained: nMark,
  };

  // 7) Persist in‑place and write back
  userAnswers[uaIdx] = updated;
  await writeAnswers(attemptID, userAnswers);

  // 8) Return normalized state
  return {
    success: true,
    data: shapeAnswers(userAnswers),
    serverTimestamp: Date.now(),
  };
}

// ——————————————————————————————————————————
// 3) Toggle‐Bookmark (example of a small flag update)
// ——————————————————————————————————————————
export async function toggleBookmark(attemptID, questionID, bookmarked) {
  // similar pattern: fetch, find, update, write
  const attempt = await fetchAttempt(attemptID);
  const { userAnswers } = attempt;

  // Check if the exam attempt is expired
  await checkExamAttempt(attempt);

  const idx = userAnswers.findIndex((a) => a.questionID === questionID);
  if (idx === -1) {
    throw new Error("Question not viewed yet");
  }
  userAnswers[idx].markedForReview = bookmarked;
  await writeAnswers(attemptID, userAnswers);
  return {
    success: true,
    data: shapeAnswers(userAnswers),
    serverTimestamp: Date.now(),
  };
}

// ——————————————————————————————————————————
// 4) Submit Exam
// ——————————————————————————————————————————
export async function submitExam(attemptID, endedBy = "USER") {
  // 1) Load the full attempt
  const attempt = await fetchAttempt(attemptID);
  const { userAnswers = [], answerList = [], settings = {} } = attempt;

  //From userAnswers need to filter the duplicates
  const uniqueUserAnswers = userAnswers.filter(
    (ua, index, self) =>
      index === self.findIndex((t) => t.questionID === ua.questionID)
  );

  // 2) Compute aggregates in two passes
  // possibleMarks = sum of pMark
  const possibleMarks = answerList.reduce((sum, q) => sum + q.pMark, 0);

  // From userAnswers, tally attempted/correct/wrong/skipped and obtainedMarks
  const {
    totalAttemptedAnswers,
    totalCorrectAnswers,
    totalWrongAnswers,
    totalSkippedAnswers,
    obtainedMarks,
  } = uniqueUserAnswers.reduce(
    (acc, ua) => {
      if (ua.answeredAt != null) {
        acc.totalAttemptedAnswers++;
        if (ua.isCorrect) {
          acc.totalCorrectAnswers++;
        } else {
          acc.totalWrongAnswers++;
        }
        // subtract negative marks too
        acc.obtainedMarks += (ua.pMarkObtained || 0) - (ua.nMarkObtained || 0);
      } else if (ua.viewedAt != null) {
        acc.totalSkippedAnswers++;
      }
      return acc;
    },
    {
      totalAttemptedAnswers: 0,
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalSkippedAnswers: 0,
      obtainedMarks: 0,
    }
  );

  // 3) Compute final % score and reward
  const scorePercent = possibleMarks
    ? (obtainedMarks / possibleMarks) * 100
    : 0;

  const { mCoinReward = {} } = settings;
  const mCoinRewardEarned =
    mCoinReward.isEnabled && scorePercent >= (mCoinReward.conditionPercent || 0)
      ? mCoinReward.rewardCoin || 0
      : 0;

  // 4) Single UpdateCommand with ALL_NEW
  const now = Date.now();
  const { Attributes: updated } = await dynamoDB.send(
    new UpdateCommand({
      TableName: USER_TABLE,
      Key: {
        pKey: `EXAM_ATTEMPT#${attemptID}`,
        sKey: "EXAM_ATTEMPTS",
      },
      UpdateExpression: `
        SET #st      = :status,
            endedAt  = :now,
            totalQuestions        = :totalQuestions,
            endedBy               = :endedBy,
            totalAttemptedAnswers = :totalAttemptedAnswers,
            totalCorrectAnswers   = :totalCorrectAnswers,
            totalWrongAnswers     = :totalWrongAnswers,
            totalSkippedAnswers   = :totalSkippedAnswers,
            obtainedMarks         = :obtainedMarks,
            totalMarks            = :possibleMarks,
            mCoinRewardEarned     = :mCoinRewardEarned,
            updatedAt             = :now,
            userAnswers           = :userAnswers
      `,
      ExpressionAttributeNames: {
        "#st": "status",
      },
      ExpressionAttributeValues: {
        ":status": "COMPLETED",
        ":now": now,
        ":totalQuestions": answerList.length,
        ":endedBy": endedBy,
        ":totalAttemptedAnswers": totalAttemptedAnswers,
        ":totalCorrectAnswers": totalCorrectAnswers,
        ":totalWrongAnswers": totalWrongAnswers,
        ":totalSkippedAnswers": totalSkippedAnswers,
        ":obtainedMarks": obtainedMarks,
        ":possibleMarks": possibleMarks,
        ":mCoinRewardEarned": mCoinRewardEarned,
        ":userAnswers": uniqueUserAnswers,
      },
      ReturnValues: "ALL_NEW",
    })
  );

  if (!updated) {
    throw new Error("Failed to complete the exam");
  }

  // 5) Return the newly updated item directly
  return {
    success: true,
    data: updated,
  };
}

// ——————————————————————————————————————————
// 5) Get Exam Attempts Result
// ——————————————————————————————————————————
async function streamToString(stream) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}
export async function getExamAttemptsResult(attemptID) {
  // 1) Fetch the exam attempt record
  const { Item } = await dynamoDB.send(
    new GetCommand({
      TableName: USER_TABLE,
      Key: {
        pKey: `EXAM_ATTEMPT#${attemptID}`,
        sKey: "EXAM_ATTEMPTS",
      },
    })
  );

  if (!Item) {
    throw new Error("Attempt not found");
  }

  // 2) Load the S3 blob
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Item.blobBucketKey,
  };
  const object = await s3.send(new GetObjectCommand(getObjectParams));

  // 3) Convert the body stream to a string
  const jsonString = await streamToString(object.Body);

  const json = JSON.parse(jsonString);

  // 4) Parse and return
  return {
    success: true,
    data: {
      ...Item,
      questions: json.sections,
    },
  };
}

export async function getExamAttemptsByUserID(userID, goalID) {
  const { Items } = await dynamoDB.send(
    new QueryCommand({
      TableName: USER_TABLE,
      IndexName: "GSI1-index",
      KeyConditionExpression: "#gsi1pKey = :pKey AND #gsi1sKey = :sKey",
      ExpressionAttributeNames: {
        "#gsi1pKey": "GSI1-pKey",
        "#gsi1sKey": "GSI1-sKey",
      },
      ExpressionAttributeValues: {
        ":pKey": "EXAM_ATTEMPTS",
        ":sKey": `EXAM_ATTEMPT@${userID}`,
        ":goalID": goalID,
      },
      FilterExpression: "goalID = :goalID",
    })
  );

  return {
    success: true,
    data: Items,
  };
}

export async function getScheduledExamAttemptsByUserID(userID, batchID) {
  if (!userID) {
    throw new Error("userID is required");
  }

  // 1) Query the GSI for this user’s exam attempts
  const { Items = [] } = await dynamoDB.send(
    new QueryCommand({
      TableName: USER_TABLE,
      IndexName: USER_GSI_INDEX,
      KeyConditionExpression: "#gpk = :pKey AND #gsk = :sKey",
      FilterExpression: "#type = :type AND #batchID = :batchID",
      ExpressionAttributeNames: {
        "#gpk": "GSI1-pKey",
        "#gsk": "GSI1-sKey",
        "#type": "type",
        "#status": "status",
        "#duration": "duration",
        "#batchID": "batchID",
      },
      ExpressionAttributeValues: {
        ":pKey": `EXAM_ATTEMPTS`,
        ":sKey": `EXAM_ATTEMPT@${userID}`,
        ":type": "scheduled",
        ":batchID": batchID,
      },
      ProjectionExpression: [
        "pKey",
        "sKey",
        "examID",
        "startTimeStamp",
        "#duration",
        "#status",
        "attemptNumber",
        "obtainedMarks",
        "totalQuestions",
        "title",
        "totalMarks",
      ].join(", "),
    })
  );

  // 2) Map into a clean client payload
  const data = Items.map((item) => ({
    id: item.pKey.split("#", 2)[1],
    examID: item.examID,
    startTimeStamp: item.startTimeStamp,
    duration: item.duration,
    status: item.status,
    attemptNumber: item.attemptNumber,
    obtainedMarks: item.obtainedMarks,
    totalQuestions: item.totalQuestions,
    title: item.title,
    totalMarks: item.totalMarks,
  }));

  return { success: true, data };
}
