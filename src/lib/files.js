import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3Client = new S3Client({
  // region: "auto",
  // //   endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  // endpoint: "http://localhost:9000",
  // credentials: {
  //   //accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
  //   accessKeyId: "S3RVER",
  //   secretAccessKey: "S3RVER",
  //   //secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  // },

  region: "us-east-1",
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
  },
});

export async function uploadFileToBucket(file, filename) {
  const Key = filename;
  const Bucket = "my-bucket";

  let res;

  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file.stream(),
        ACL: "public-read",
        ContentType: file.type,
      },
      queueSize: 4,
      leavePartsOnError: false,
    });

    res = await parallelUploads.done();
  } catch (e) {
    throw e;
  }

  return res;
}

export async function getPresignedPostUrl(objectName, contentType) {
  return await createPresignedPost(s3Client, {
    //Bucket: env.CLOUDFLARE_BUCKET_NAME,
    Bucket: "my-bucket",

    Key: objectName,
    // Conditions: [
    //   ["content-length-range", 0, 1024 * 1024 * 2],
    //   ["starts-with", "$Content-Type", contentType],
    // ],
    // Fields: {
    //   // acl: "public-read",
    //   "Content-Type": contentType,
    // },
  });
}
