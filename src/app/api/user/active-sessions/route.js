import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { withAuth } from "@/src/utils/sessionHandler";
import { UAParser } from "ua-parser-js";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const { deviceId } = await req.json();
      if (!deviceId) {
        return Response.json(
          { success: false, message: "Device ID is required" },
          { status: 400 }
        );
      }

      // Check if session exists and is revoked
      const getParams = {
        TableName: USER_TABLE,
        Key: {
          pKey: `SESSION#${deviceId}`,
          sKey: `USER#${session.id}`,
        },
      };
      const existingSession = await dynamoDB.send(new GetCommand(getParams));

      if (existingSession.Item && existingSession.Item.status === "revoked") {
        return Response.json(
          { success: false, message: "Session revoked", action: "logout" },
          { status: 403 }
        );
      }

      const userAgentString = req.headers.get("user-agent") || "";
      let device = "Desktop";
      let browser = "Unknown Browser";
      let os = "Unknown OS";

      try {
        const parser = new UAParser(userAgentString);
        const result = parser.getResult();
        device = result.device.model || "Desktop";
        browser = `${result.browser.name || "Unknown"} ${
          result.browser.version || ""
        }`;
        os = `${result.os.name || "Unknown"} ${result.os.version || ""}`;
      } catch (e) {
        console.warn("Failed to parse user agent:", e);
      }

      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "Unknown IP";

      // Simple location mock
      const location = "Unknown Location";

      const now = Date.now();
      const sessionData = {
        pKey: `SESSION#${deviceId}`,
        sKey: `USER#${session.id}`,
        "GSI1-pKey": `USER#${session.id}`,
        "GSI1-sKey": `SESSION#${deviceId}`,
        device,
        browser,
        os,
        ip,
        location,
        lastActive: now,
        userAgent: userAgentString,
        status: "active", // Explicitly set status
        createdAt: existingSession.Item ? existingSession.Item.createdAt : now,
      };

      // We use PutCommand which acts as an upsert
      await dynamoDB.send(
        new PutCommand({
          TableName: USER_TABLE,
          Item: sessionData,
        })
      );

      return Response.json({ success: true, message: "Session registered" });
    } catch (error) {
      console.error("Error registering session:", error);
      return Response.json(
        { success: false, message: "Failed to register session" },
        { status: 500 }
      );
    }
  });
}

export async function GET(req) {
  return withAuth(async (session) => {
    try {
      const params = {
        TableName: USER_TABLE,
        IndexName: "GSI1-index",
        KeyConditionExpression:
          "#gsi1pKey = :userId AND begins_with(#gsi1sKey, :sessionPrefix)",
        ExpressionAttributeNames: {
          "#gsi1pKey": "GSI1-pKey",
          "#gsi1sKey": "GSI1-sKey",
        },
        ExpressionAttributeValues: {
          ":userId": `USER#${session.id}`,
          ":sessionPrefix": "SESSION#",
        },
      };

      const result = await dynamoDB.send(new QueryCommand(params));

      // Filter out revoked sessions
      const activeSessions = (result.Items || []).filter(
        (item) => item.status !== "revoked"
      );

      return Response.json({ success: true, data: activeSessions });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return Response.json(
        { success: false, message: "Failed to fetch sessions" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(req) {
  return withAuth(async (session) => {
    try {
      const { deviceId } = await req.json();
      if (!deviceId) {
        return Response.json(
          { success: false, message: "Device ID is required" },
          { status: 400 }
        );
      }

      // Instead of deleting, we update status to 'revoked'
      const updateParams = {
        TableName: USER_TABLE,
        Key: {
          pKey: `SESSION#${deviceId}`,
          sKey: `USER#${session.id}`,
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": "revoked",
        },
      };

      await dynamoDB.send(new UpdateCommand(updateParams));

      return Response.json({ success: true, message: "Session revoked" });
    } catch (error) {
      console.error("Error revoking session:", error);
      return Response.json(
        { success: false, message: "Failed to revoke session" },
        { status: 500 }
      );
    }
  });
}
