import { dynamoDB } from "@/src/utils/awsAgent";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function getAllBanners() {
  const TABLE_NAME = `${process.env.AWS_DB_NAME}master`;

  try {
    // Query via GSI — banners have GSI1-pKey = "BANNERS"
    const items = [];
    let lastKey;
    do {
      const response = await dynamoDB.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "masterTableIndex",
          KeyConditionExpression: "#gsi1pk = :gsi1pk",
          ExpressionAttributeNames: {
            "#gsi1pk": "GSI1-pKey",
          },
          ExpressionAttributeValues: {
            ":gsi1pk": "BANNERS",
          },
          ProjectionExpression: "bannerID, title, bannerURL, isUploaded",
          ...(lastKey && { ExclusiveStartKey: lastKey }),
        })
      );
      items.push(...(response.Items || []));
      lastKey = response.LastEvaluatedKey;
    } while (lastKey);

    // Filter uploaded banners in-memory
    const uploadedBanners = items.filter((item) => item.isUploaded === true);

    const data = uploadedBanners.map((item) => ({
      id: item.bannerID,
      title: item.title,
      image: item.bannerURL,
    }));

    return {
      success: true,
      message: "Banners fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error in getAllBanners:", error);
    throw new Error("Internal server error");
  }
}
