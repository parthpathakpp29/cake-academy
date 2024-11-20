import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFile = async (file, folder) => {
  const fileStream = fs.createReadStream(file.path);
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileStream,
    ContentType: file.mimetype
    // Removed ACL: 'public-read'
  };

  try {
    const result = await s3Client.send(new PutObjectCommand(uploadParams));
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
    if (result.$metadata.httpStatusCode === 200) {
      return {
        url,
        key: fileName,
      };
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (key) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    const result = await s3Client.send(new DeleteObjectCommand(deleteParams));
    if (result.$metadata.httpStatusCode !== 204) {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getSignedUrlForVideo = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};