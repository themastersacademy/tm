import { dynamoDB } from "@/src/utils/awsAgent";
import {
  QueryCommand,
  PutCommand,
  GetCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import getFileURL from "@/src/utils/getFileURL";
import { getFullUserByID } from "@/src/libs/user/userProfile";
import { randomUUID } from "crypto";
import { submitExam } from "./attemptController";
import { getUserBatches } from "@/src/libs/myClassroom/batchController";

const MASTER_TABLE = `${process.env.AWS_DB_NAME}master`;
const USER_TABLE = `${process.env.AWS_DB_NAME}users`;
const MASTER_INDEX_NAME = "masterTableIndex";
const USER_INDEX_NAME = "GSI1-index";

export async function getExamByID(id) {
  if (!id) {
    throw new Error("Exam id is required");
  }

  const params = {
    TableName: MASTER_TABLE,
    KeyConditionExpression: [
      "pKey = :pk",
      "AND begins_with(sKey, :skeyPrefix)",
    ].join(" "),
    FilterExpression: "isLive = :isLive",
    ExpressionAttributeNames: {
      "#type": "type", // alias reserved word
      "#duration": "duration",
    },
    ExpressionAttributeValues: {
      ":pk": `EXAM#${id}`,
      ":skeyPrefix": `EXAMS@`,
      ":isLive": true,
    },
    ProjectionExpression: [
      "pKey",
      "title",
      "#type", // use alias here
      "#duration", // use alias here
      "totalQuestions",
      "totalSections",
      "totalMarks",
      "settings",
      "startTimeStamp",
      "endTimeStamp",
      "isLifeTime",
      "isLive",
      "goalID",
    ].join(", "),
  };

  try {
    const { Items } = await dynamoDB.send(new QueryCommand(params));

    if (Items.length === 0) {
      return {
        success: false,
        message: "Mock exam not found",
      };
    }

    return {
      success: true,
      data: {
        id: Items[0].pKey.split("#")[1],
        ...Items[0],
        "GSI1-pKey": undefined,
        "GSI1-sKey": undefined,
        sKey: undefined,
        pKey: undefined,
        answerList: undefined,
        questionSection: undefined,
        serverTimestamp: Date.now(),
      },
    };
  } catch (err) {
    console.error("getMockExamByID error:", err);
    throw new Error("Failed to fetch mock exam");
  }
}

export async function getScheduledExamByBatch(userID, batchID) {
  if (!userID || !batchID) {
    throw new Error("userID and batchID are required");
  }

  // 1) Find all exam IDs linked to this batch
  const joinResp = await dynamoDB.send(
    new QueryCommand({
      TableName: MASTER_TABLE,
      KeyConditionExpression: "pKey = :pk",
      ExpressionAttributeValues: {
        ":pk": `BATCH_EXAM#${batchID}`,
      },
    })
  );
  const links = joinResp.Items || [];
  if (links.length === 0) {
    return { success: true, data: [] };
  }
  // 2) Batch‑get the real exam items (scheduled exams use sKey = EXAM@scheduled)
  const examKeys = links.map((link) => ({
    pKey: `EXAM#${link.examID}`, // sKey on join is "EXAM#<examID>"
    sKey: "EXAMS@scheduled", // main exam sort key for scheduled exams
  }));

  const batchGetResp = await dynamoDB.send(
    new BatchGetCommand({
      RequestItems: {
        [MASTER_TABLE]: {
          Keys: examKeys,
        },
      },
    })
  );

  const exams = batchGetResp.Responses?.[MASTER_TABLE] || [];

  // 3) Optionally filter only live exams
  const liveExams = exams.filter((ex) => ex.isLive);

  // 4) Map to client shape
  const result = liveExams.map((ex) => ({
    id: ex.pKey.split("#", 2)[1],
    title: ex.title,
    startTimeStamp: ex.startTimeStamp,
    duration: ex.duration,
    isLive: ex.isLive,
    settings: ex.settings,
    createdAt: ex.createdAt,
    updatedAt: ex.updatedAt,
  }));

  return {
    success: true,
    data: result,
  };
}

export async function startExam({ examID, userID }) {
  if (!examID || !userID) {
    throw new Error("Exam id and user id are required");
  }

  const now = Date.now();

  const user = await getFullUserByID(userID);
  const exam = await getFullExamByID(examID);

  if (!user || !exam) {
    throw new Error("Failed to fetch user or exam");
  }

  const previousAttempt = await getPreviousAttempt(userID, examID);

  if (previousAttempt) {
    throw new Error("You have already started this exam.");
  }

  if (exam.startTimeStamp > now) {
    throw new Error("Exam not started yet");
  }

  if (!exam.isLifeTime && exam.endTimeStamp < now) {
    throw new Error("Exam ended");
  }
  let batchID;
  if (exam.type === "scheduled") {
    const response = await getUserBatches(userID);
    if (!response.success || !response.data.length) {
      throw new Error("User is not enrolled in any batch");
    }
    // Check batchList in exam object
    const batch = response.data.find((b) => exam.batchList.includes(b.batchID));
    if (!batch) {
      throw new Error("User is not enrolled in the batch of this exam");
    }
    batchID = batch.batchID;
  }

  const examAttemptID = randomUUID();

  const seed = exam.settings.isRandomQuestion
    ? Math.floor(Math.random() * 2 ** 31) // 32-bit integer
    : undefined;

  const blobSignedUrl = await getFileURL({
    path: exam.blobBucketKey,
    expiry: 60 * (exam.duration + 1),
  });

  const examAttemptParams = {
    TableName: USER_TABLE,
    IndexName: USER_INDEX_NAME,
    Item: {
      pKey: `EXAM_ATTEMPT#${examAttemptID}`,
      sKey: `EXAM_ATTEMPTS`,
      "GSI1-pKey": `EXAM_ATTEMPTS`,
      "GSI1-sKey": `EXAM_ATTEMPT@${userID}`,
      id: examAttemptID,
      userID,
      examID,
      title: exam.title,
      seed,
      // TODO: Add goalID to the exam when the exam is mock, group exam and practice exam.
      goalID:
        exam.type === "mock" ||
        exam.type === "group" ||
        exam.type === "practice"
          ? exam.goalID
          : undefined,
      batchID: exam.type === "scheduled" ? batchID : undefined,
      type: exam.type,
      startTimeStamp: now,
      duration: exam.duration,
      status: "IN_PROGRESS",
      settings: exam.settings,
      blobBucketKey: exam.blobBucketKey,
      blobVersion: exam.blobVersion,
      blobSignedUrl,
      answerList: exam.answerList,
      totalQuestions: exam.totalQuestions,
      totalSections: exam.totalSections,
      totalMarks: exam.totalMarks,
      userAnswers: [],
      obtainedMarks: 0,
      attemptNumber: 1,
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalSkippedAnswers: 0,
      totalAttemptedAnswers: 0,
      createdAt: now,
      updatedAt: now,
    },
  };
  try {
    await dynamoDB.send(new PutCommand(examAttemptParams));
    return {
      success: true,
      data: {
        attemptID: examAttemptID,
      },
    };
  } catch (err) {
    console.error("startExam error:", err);
    throw new Error("Failed to start exam");
  }
}

export async function getExamAttemptByID(id) {
  if (!id) throw new Error("Exam attempt id is required");

  const serverTimestamp = Date.now();
  const params = {
    TableName: USER_TABLE,
    Key: { pKey: `EXAM_ATTEMPT#${id}`, sKey: "EXAM_ATTEMPTS" },
    ExpressionAttributeNames: { "#dur": "duration", "#st": "status" },
    ProjectionExpression: [
      "id",
      "title",
      "userID",
      "examID",
      "seed",
      "startTimeStamp",
      "#dur",
      "#st",
      "blobVersion",
      "blobSignedUrl",
      "userAnswers",
      "attemptNumber",
      "totalSkippedAnswers",
      "totalAttemptedAnswers",
    ].join(", "),
  };

  let Item;
  try {
    ({ Item } = await dynamoDB.send(new GetCommand(params)));
  } catch (err) {
    console.error("DynamoDB error:", err);
    throw new Error("Failed to fetch exam attempt");
  }

  if (!Item) {
    // no item → consistent error
    throw new Error("Exam attempt not found");
  }

  // Auto‑submit if expired
  const expiry = Item.startTimeStamp + (Item.duration || 0) * 60000;
  if (Item.status === "IN_PROGRESS" && serverTimestamp > expiry) {
    const res = await submitExam(id, "AUTO");
    if (res.success) {
      Item = res.data; // swap in the completed data
    } else {
      console.warn("Auto‑submit failed, returning in‑progress state");
    }
  }

  // Build the payload in one go
  const base = {
    id: Item.id,
    title: Item.title,
    userID: Item.userID,
    examID: Item.examID,
    seed: Item.seed,
    startTimeStamp: Item.startTimeStamp,
    duration: Item.duration,
    status: Item.status,
    serverTimestamp,
  };

  // If still in‑progress, add the extra fields
  if (Item.status === "IN_PROGRESS") {
    Object.assign(base, {
      userAnswers: Item.userAnswers || [],
      blobVersion: Item.blobVersion,
      blobSignedUrl: Item.blobSignedUrl,
      attemptNumber: Item.attemptNumber,
      totalSkippedAnswers: Item.totalSkippedAnswers,
      totalAttemptedAnswers: Item.totalAttemptedAnswers,
    });
  }

  return { success: true, data: base };
}

async function getFullExamByID(id) {
  const params = {
    TableName: MASTER_TABLE,
    KeyConditionExpression: [
      "pKey = :pk",
      "AND begins_with(sKey, :skeyPrefix)",
    ].join(" "),
    FilterExpression: "isLive = :isLive",
    ExpressionAttributeValues: {
      ":pk": `EXAM#${id}`,
      ":skeyPrefix": `EXAMS@`,
      ":isLive": true,
    },
  };

  try {
    const { Items } = await dynamoDB.send(new QueryCommand(params));

    if (Items.length === 0) {
      throw new Error("Exam not found");
    }

    return Items[0];
  } catch (err) {
    console.error("getFullExamByID error:", err);
    throw new Error("Exam is not available");
  }
}

async function getPreviousAttempt(userID, examID) {
  if (!userID || !examID) {
    throw new Error("Both userID and examID are required");
  }

  const params = {
    TableName: USER_TABLE,
    IndexName: USER_INDEX_NAME,
    KeyConditionExpression: "#gsiPK = :pk AND #gsiSK = :sk",
    FilterExpression: "examID = :examID",
    ExpressionAttributeNames: {
      "#gsiPK": "GSI1-pKey",
      "#gsiSK": "GSI1-sKey",
    },
    ExpressionAttributeValues: {
      ":pk": "EXAM_ATTEMPTS", // your GSI partition
      ":sk": `EXAM_ATTEMPT@${userID}`, // your GSI sort
      ":examID": examID, // filter on this field
    },
    // if you only want the single latest attempt:
    Limit: 1,
    ScanIndexForward: false, // false → newest items first if you sort by timestamp
  };

  try {
    const { Items } = await dynamoDB.send(new QueryCommand(params));
    return Items?.[0] ?? null;
  } catch (err) {
    console.error("getPreviousAttempt error:", err);
    throw new Error("Failed to fetch previous attempt");
  }
}
