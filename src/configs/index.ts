require("dotenv").config(); // start environment
import aws from "aws-sdk";

export const mongodb_client = process.env.MONGODB_CONNECT_CLIENT;
export const port = process.env.APP_PORT;
export const secret_key = process.env.SECRET_KEY || "";
export const s3_secret_key = process.env.S3_SECRET_KEY;
export const s3_access_key = process.env.S3_ACCESSS_KEY;
export const s3_bucket_name = process.env.S3_BUCKET_NAME;
export const s3_domain_name = process.env.S3_DOMAIN_NAME;

// config amazon key
export const s3 = new aws.S3({
  accessKeyId: s3_access_key,
  secretAccessKey: s3_secret_key,
});
