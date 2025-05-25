import { s3 } from "@/src/utils/awsAgent";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Generates a pre-signed URL for retrieving a file from S3 (AWS SDK v3).
 *
 * @param {Object} params
 * @param {string} params.path   - The S3 key (file path).
 * @param {number} [params.expiry=3600] - URL expiry in seconds (default 1 hour).
 * @returns {Promise<Object>} { success, url?, message, error? }
 */
export default async function getFileURL({ path, expiry = 3600 }) {
  if (!path) {
    return { success: false, message: "Missing S3 key (path)" };
  }

  const bucket = process.env.AWS_BUCKET_NAME;
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: expiry });
    return url;
  } catch (error) {
    console.error("Error generating GET signed URL:", error);
    return {
      success: false,
      message: "Failed to generate pre-signed URL",
      error: error.message,
    };
  }
}
