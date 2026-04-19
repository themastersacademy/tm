import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

export async function userProfileSetup({ userID, name, phoneNumber, gender }) {
  if (!userID) {
    throw new Error("User ID is required");
  }
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
    console.error("userProfileSetup error:", error);
    throw error;
  }
}

export async function getFullUserByID(userID) {
  if (!userID) return null;
  const TableName = `${process.env.AWS_DB_NAME}users`;
  const Key = {
    pKey: `USER#${userID}`,
    sKey: `USER#${userID}`,
  };
  const { Item: user } = await dynamoDB.send(
    new GetCommand({ TableName, Key })
  );
  return user || null;
}

export async function updateUserProfile(userID, data) {
  if (!userID) throw new Error("User ID is required");
  if (!data || typeof data !== "object") {
    throw new Error("Invalid profile data");
  }

  const TableName = `${process.env.AWS_DB_NAME}users`;
  const Key = {
    pKey: `USER#${userID}`,
    sKey: `USER#${userID}`,
  };

  // Filter out undefined/null values — DynamoDB rejects undefined and
  // treats null differently than "field not set"
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const fields = Object.keys(cleanData);
  if (fields.length === 0) {
    return { success: true, message: "No changes to update" };
  }

  // Build update expression dynamically
  const setParts = fields.map((field) => `#${field} = :${field}`);
  const UpdateExpression = `set ${setParts.join(", ")}`;
  const ExpressionAttributeNames = Object.fromEntries(
    fields.map((f) => [`#${f}`, f])
  );
  const ExpressionAttributeValues = Object.fromEntries(
    fields.map((f) => [`:${f}`, cleanData[f]])
  );

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
