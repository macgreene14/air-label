import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3"; // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// connect to s3 instance
export function connectS3Client(accessKeyId, secretAccessKey, region) {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    region: region,
  });
  return s3Client;
}

// Put an object into an Amazon S3 bucket.
export function putS3(s3Client, bucketName, key, pdfBuffer) {
  const response = s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    })
  );
  return response;
}

export async function uploadPDF2S3Signed(
  accessKeyId,
  secretAccessKey,
  region,
  bucketName,
  pdfKey,
  pdfBuffer
) {
  // create new client instance
  const s3Client = connectS3Client(accessKeyId, secretAccessKey, region);

  // upload pdf to s3
  await putS3(s3Client, bucketName, pdfKey, pdfBuffer);

  // generate presigned url for downloading object
  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: pdfKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return url;
}
