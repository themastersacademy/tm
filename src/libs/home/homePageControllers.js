import { dynamoDB } from "@/src/utils/awsAgent";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function getAllBanners() {
  const TABLE_NAME = `${process.env.AWS_DB_NAME}master`;
  const params = {
    TableName: TABLE_NAME,
    // Only include items where sKey = "BANNERS" and isUploaded = true
    FilterExpression: "sKey = :sKey AND isUploaded = :isUploaded",
    ExpressionAttributeValues: {
      ":sKey": "BANNERS",
      ":isUploaded": true,
    },
    // Only fetch the attributes we actually need
    ProjectionExpression: "bannerID, title, bannerURL",
  };

  try {
    const { Items = [] } = await dynamoDB.send(new ScanCommand(params));

    // Map each item to the shape we want in the response
    const data = Items.map((item) => {
      return {
        id: item.bannerID,
        title: item.title,
        image: item.bannerURL,
      };
    });

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
