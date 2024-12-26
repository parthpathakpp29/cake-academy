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

// Optimized folder structure constants
const S3_FOLDERS = {
  THUMBNAILS: 'thumbnails',
  LECTURES: 'lectures'
};

export const uploadFile = async (file, { courseId, fileType }) => {
  console.log('Starting S3 upload for file:', file.originalname);
  const fileStream = fs.createReadStream(file.path);
  
  // Determine the appropriate folder based on file type
  let key;
  if (fileType === 'thumbnail') {
    key = `${S3_FOLDERS.THUMBNAILS}/${courseId}/${Date.now()}-${file.originalname}`;
  } else if (fileType === 'lecture') {
    key = `${S3_FOLDERS.LECTURES}/${courseId}/${Date.now()}-${file.originalname}`;
  } else {
    throw new Error('Invalid file type specified');
  }

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  try {
    console.log('Uploading to S3 with params:', {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      ContentType: uploadParams.ContentType
    });
    
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    console.log('Successfully uploaded to S3');
    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key: key
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
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