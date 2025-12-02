import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

export async function userProfileSetup({ userID, name, phoneNumber, gender }) {
  const TableName = `${process.env.AWS_DB_NAME}users`;
  const Key = {
    pKey: `USER#${userID}`,
    sKey: `USER#${userID}`,
  };

  try {
    // Fetch the user using GetCommand instead of an update command
    const { Item: user } = await dynamoDB.send(
      new GetCommand({ TableName, Key })
    );
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const { provider, emailVerified } = user;

    // If the user is not using Google and email is not verified, return an error.
    if (!emailVerified && provider !== "google") {
      return {
        success: false,
        message: "User not found",
      };
    }

    // If the provider is Google and the email is not verified, update the user profile.
    if (provider === "google" && !emailVerified) {
      await dynamoDB.send(
        new UpdateCommand({
          TableName,
          Key,
          UpdateExpression:
            "set #name = :name, #phoneNumber = :phoneNumber, #gender = :gender, emailVerified = :verified",
          ExpressionAttributeNames: {
            "#name": "name",
            "#phoneNumber": "phoneNumber",
            "#gender": "gender",
          },
          ExpressionAttributeValues: {
            ":name": name,
            ":phoneNumber": phoneNumber,
            ":gender": gender,
            ":verified": true,
          },
        })
      );
    } else {
      await dynamoDB.send(
        new UpdateCommand({
          TableName,
          Key,
          UpdateExpression:
            "set #name = :name, #phoneNumber = :phoneNumber, #gender = :gender",
          ExpressionAttributeNames: {
            "#name": "name",
            "#phoneNumber": "phoneNumber",
            "#gender": "gender",
          },
          ExpressionAttributeValues: {
            ":name": name,
            ":phoneNumber": phoneNumber,
            ":gender": gender,
          },
        })
      );
    }
    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFullUserByID(userID) {
  const TableName = `${process.env.AWS_DB_NAME}users`;
  const Key = {
    pKey: `USER#${userID}`,
    sKey: `USER#${userID}`,
  };
  const { Item: user } = await dynamoDB.send(
    new GetCommand({ TableName, Key })
  );
  return user;
}

export async function updateUserProfile(userID, data) {
  const TableName = `${process.env.AWS_DB_NAME}users`;
  const Key = {
    pKey: `USER#${userID}`,
    sKey: `USER#${userID}`,
  };

  // Build update expression dynamically
  let UpdateExpression = "set";
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  const fields = Object.keys(data);
  fields.forEach((field, index) => {
    const attributeName = `#${field}`;
    const attributeValue = `:${field}`;

    UpdateExpression += ` ${attributeName} = ${attributeValue}`;
    if (index < fields.length - 1) UpdateExpression += ",";

    ExpressionAttributeNames[attributeName] = field;
    ExpressionAttributeValues[attributeValue] = data[field];
  });

  // If no fields to update, return success
  if (fields.length === 0) {
    return { success: true, message: "No changes to update" };
  }

  try {
    await dynamoDB.send(
      new UpdateCommand({
        TableName,
        Key,
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      })
    );
    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
