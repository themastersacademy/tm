import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

export async function getGoalList() {
  const params = {
    TableName: `${process.env.AWS_DB_NAME}master`,
    FilterExpression: "sKey = :sKey",
    ExpressionAttributeValues: {
      ":sKey": "GOALS",
    },
  };
  const command = new ScanCommand(params);
  try {
    const result = await dynamoDB.send(command);
    console.log(result.Items[0].subjectList);
    return {
      success: true,
      message: "Goal list fetched successfully",
      data: result.Items.map((item) => ({
        id: item.pKey.split("#")[1],
        title: item.title,
        icon: item.icon,
      })),
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getGoalSubjectList(goalID) {
  const params = {
    TableName: `${process.env.AWS_DB_NAME}master`,
    Key: {
      sKey: "GOALS",
      pKey: `GOAL#${goalID}`,
    },
  };
  const command = new GetCommand(params);
  try {
    const result = await dynamoDB.send(command);
    if (!result.Item) {
      return {
        success: false,
        message: "Goal not found",
      };
    }
    if (result.Item.subjectList.length === 0) {
      return {
        success: false,
        message: "No subjects found",
      };
    }
    const subjectList = result.Item.subjectList;
    return {
      success: true,
      message: "Goal subject list fetched successfully",
      data: subjectList,
    };
  } catch (error) {
    throw new Error(error);
  }
}
