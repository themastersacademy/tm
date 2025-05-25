import { dynamoDB, s3 } from "@/src/utils/awsAgent";
import {
  ScanCommand,
  BatchGetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { startExam } from "./examController";

const CONTENT_TABLE = `${process.env.AWS_DB_NAME}content`;
const CONTENT_INDEX_NAME = "contentTableIndex";
const MASTER_TABLE = `${process.env.AWS_DB_NAME}master`;
const bucket = process.env.AWS_BUCKET_NAME;

/**
 * Fetches `count` random questions for a given subject and difficulty.
 * Uses a full scan of keys + in‑memory shuffle + BatchGet.
 */
export async function getQuestions({ subjectID, difficultyLevel, count = 10 }) {
  if (!subjectID) {
    throw new Error("subjectID is required");
  }

  // 1) Scan only keys (pKey, sKey) for this subject (+ optional difficulty filter)
  const prefix = `QUESTIONS@${subjectID}`;
  const filterExprs = ["begins_with(sKey, :prefix)"];
  const exprValues = { ":prefix": prefix };

  if (difficultyLevel) {
    filterExprs.push("difficultyLevel = :dl");
    exprValues[":dl"] = difficultyLevel;
  }

  let allKeys = [];
  let ExclusiveStartKey = undefined;

  do {
    const { Items, LastEvaluatedKey } = await dynamoDB.send(
      new ScanCommand({
        TableName: CONTENT_TABLE,
        ProjectionExpression: "pKey, sKey",
        FilterExpression: filterExprs.join(" AND "),
        ExpressionAttributeValues: exprValues,
        ExclusiveStartKey,
      })
    );

    if (Items) {
      allKeys.push(...Items.map(({ pKey, sKey }) => ({ pKey, sKey })));
    }
    ExclusiveStartKey = LastEvaluatedKey;
  } while (ExclusiveStartKey);

  // 2) Randomly pick `count` keys (Fisher–Yates shuffle)
  for (let i = allKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allKeys[i], allKeys[j]] = [allKeys[j], allKeys[i]];
  }
  const selected = allKeys.slice(0, Math.min(count, allKeys.length));

  if (!selected.length) {
    return [];
  }

  // 3) Batch‑get full question details
  const chunks = [];
  for (let i = 0; i < selected.length; i += 100) {
    chunks.push(selected.slice(i, i + 100));
  }

  const detailed = [];
  for (const chunk of chunks) {
    const { Responses } = await dynamoDB.send(
      new BatchGetCommand({
        RequestItems: {
          [CONTENT_TABLE]: {
            Keys: chunk,
            ProjectionExpression:
              "pKey, sKey, title, options, #ty, answerKey, blanks, solution, difficultyLevel",
            ExpressionAttributeNames: {
              "#ty": "type",
            },
          },
        },
      })
    );
    detailed.push(...(Responses?.[CONTENT_TABLE] || []));
  }

  // 4) Map to client shape
  return detailed.map((it) => ({
    id: it.pKey.split("#", 2)[1],
    subjectID: it.sKey.split("@", 2)[1],
    title: it.title,
    type: it.type,
    difficultyLevel: it.difficultyLevel,
    options: it.options,
    answerKey: it.answerKey,
    blanks: it.blanks,
    solution: it.solution,
  }));
}

export async function getPracticeQuestions({ subjectID, difficultyLevel }) {
  if (!subjectID) {
    throw new Error("subjectID is required");
  }

  const questions = await getQuestions({
    subjectID,
    difficultyLevel, // pass through if provided
  });
  if (questions.length < 10) {
    throw new Error("Not enough questions available for practice");
  }

  return questions;
}

/**
 * Creates a new “practice” exam record for the given user,
 * embedding 10 random questions and fixing duration to 20 minutes.
 */
export async function createPracticeExam({
  userID,
  subjectID,
  difficultyLevel,
  goalID,
}) {
  if (!userID) {
    throw new Error("userID is required");
  }
  if (!subjectID) {
    throw new Error("subjectID is required");
  }

  // 1) Pull 10 random practice questions
  const questions = await getPracticeQuestions({
    subjectID,
    difficultyLevel,
  });

  // 2) Build exam metadata
  const examID = randomUUID();
  const now = Date.now();
  const duration = 20;
  const startTime = now;
  const endTime = now + duration;
  const prefix = process.env.AWS_EXAM_PATH || "";

  const questionSection = [
    {
      title: "Questions",
      pMark: 1,
      nMark: 0.25,
      questions: questions.map((question) => ({
        questionID: question.id,
        subjectID: question.subjectID,
      })),
    },
  ];

  const examItem = {
    pKey: `EXAM#${examID}`,
    sKey: "EXAMS@practice",
    type: "practice",
    "GSI1-pKey": "EXAMS",
    "GSI1-sKey": "EXAMS",
    title: "Practice Exam",
    goalID,
    userID,
    subjectID,
    isLive: true,
    isLifeTime: true,
    difficultyLevel: difficultyLevel || null,
    questionSection,
    duration,
    startTimeStamp: startTime,
    endTimeStamp: endTime,
    totalQuestions: 10,
    totalSections: 1,
    totalMarks: 10,
    isLive: true,
    blobVersion: 1,
    settings: {
      isAntiCheat: false,
      isFullScreenMode: false,
      isProTest: false,
      isShowResult: true,
      isRandomQuestion: false,
      mCoinReward: {
        isEnabled: false,
        conditionPercent: 0,
        rewardCoin: 0,
      },
    },
    createdAt: now,
    updatedAt: now,
  };

  const byId = Object.fromEntries(questions.map((qi) => [qi.id, qi]));
  const sections = examItem.questionSection.map((sec) => {
    return {
      title: sec.title,
      pMark: Number(sec.pMark),
      nMark: Number(sec.nMark),
      questions: sec.questions.map(({ questionID, subjectID }) => {
        const src = byId[questionID];
        return {
          questionID,
          subjectID,
          title: src.title,
          type: src.type,
          noOfBlanks: src.type === "FIB" ? src.blanks.length : undefined,
          options:
            src.type === "FIB"
              ? undefined
              : src.options.map(({ id, text }) => ({ id, text })),
        };
      }),
    };
  });

  const answerList = sections.flatMap((sec) =>
    sec.questions.map((q) => {
      const src = byId[q.questionID];
      return {
        questionID: q.questionID,
        type: src.type,
        // MCQ/MSQ correct answers by index
        correct:
          src.type === "FIB"
            ? []
            : src.answerKey.map((k) => {
                const opt = src.options.find((o) => o.id === k);
                return opt
                  ? { id: opt.id, text: opt.text, weight: opt.weight }
                  : null;
              }),
        // FIB blanks array
        blanks: src.type === "FIB" ? src.blanks : [],
        pMark: sec.pMark,
        nMark: sec.nMark,
        solution: src.solution,
      };
    })
  );

  const blob = {
    examID,
    title: examItem.title,
    version: 1,
    settings: examItem.settings,
    duration: examItem.duration,
    startTimeStamp: examItem.startTimeStamp,
    totalSections: examItem.totalSections,
    totalQuestions: examItem.totalQuestions,
    totalMarks: examItem.totalMarks,
    sections,
    // answerList,
  };

  const blobKey = `${prefix}${examID}-v1.json`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: blobKey,
        Body: JSON.stringify(blob),
        ContentType: "application/json",
      })
    );
  } catch (err) {
    console.error("🔴 S3 upload failed:", err);
    throw new Error("Failed to upload exam blob");
  }

  examItem.blobBucketKey = blobKey;
  examItem.answerList = answerList;

  // 3) Persist the practice‐exam record
  await dynamoDB.send(
    new PutCommand({
      TableName: MASTER_TABLE,
      Item: examItem,
      ConditionExpression: "attribute_not_exists(pKey)",
    })
  );

  const attempt = await startExam({ examID, userID });
  if (!attempt.success) {
    throw new Error("Failed to start exam");
  }

  const attemptID = attempt.data.attemptID;

  // 4) Return exam launch data
  return {
    success: true,
    data: {
      examID,
      attemptID,
    },
  };
}
