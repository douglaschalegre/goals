import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  // Clean filename: remove special characters and replace spaces with hyphens
  const cleanFilename = filename
    .replace(/[^\w.-]/g, "-")  // Replace special chars with hyphens
    .replace(/\s+/g, "-")       // Replace spaces with hyphens
    .replace(/-+/g, "-")        // Replace multiple hyphens with single hyphen
    .toLowerCase();

  const key = `goals/${uuidv4()}-${cleanFilename}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  // Return the public URL with properly encoded key
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
  return publicUrl;
}

export { R2 };
