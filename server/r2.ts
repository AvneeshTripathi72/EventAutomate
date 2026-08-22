import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomBytes } from "crypto";
import path from "path";

const isR2Configured = !!(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY && process.env.CLOUDFLARE_R2_ENDPOINT);

if (!isR2Configured) {
  console.warn("⚠️ Warning: Cloudflare R2 environment variables are missing. File uploads will fail.");
}

const s3Client = isR2Configured ? new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
}) : null;

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "tilcons";
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "");

/**
 * Generate a unique filename
 */
export function generateUniqueFilename(originalName: string, prefix = ""): string {
  const ext = path.extname(originalName);
  const hash = randomBytes(16).toString("hex");
  return `${prefix ? prefix + "/" : ""}${Date.now()}-${hash}${ext}`;
}

/**
 * Uploads a file (Buffer) to Cloudflare R2 and returns its public URL.
 */
export async function uploadFileToR2(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
  });

  if (!s3Client) throw new Error("Cloudflare R2 is not configured");
  await s3Client.send(command);

  if (PUBLIC_URL) {
    return `${PUBLIC_URL}/${filename}`;
  }
  
  // If no public URL is configured, we could generate a presigned URL or just return the bucket endpoint
  return `${process.env.CLOUDFLARE_R2_ENDPOINT}/${BUCKET_NAME}/${filename}`;
}

/**
 * Deletes a file from Cloudflare R2 given its URL or Key
 */
export async function deleteFileFromR2(urlOrKey: string): Promise<void> {
  if (!urlOrKey) return;
  
  let key = urlOrKey;
  if (urlOrKey.startsWith("http")) {
    // Extract key from URL
    try {
      const parsedUrl = new URL(urlOrKey);
      key = parsedUrl.pathname.substring(1); // Remove leading slash
    } catch (e) {
      console.error("Invalid URL passed to deleteFileFromR2:", urlOrKey);
      return;
    }
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    if (!s3Client) throw new Error("Cloudflare R2 is not configured");
  await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from R2:", error);
  }
}
