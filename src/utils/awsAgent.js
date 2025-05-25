"server only";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_IAM_SECRET_KEY ||
  !process.env.AWS_REGION
) {
  throw new Error(
    "Cannot read env variable AWS_ACCESS_KEY_ID or AWS_SECRET_KEY or REGION"
  );
}

const dynamoDBClient = new DynamoDB({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_IAM_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

const dynamoDB = DynamoDBDocument.from(dynamoDBClient);

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_IAM_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

export { dynamoDB, s3 };
