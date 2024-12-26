import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs';
import s3Client from '../config/s3Config.js';

const S3_FOLDERS = {
  THUMBNAILS: 'thumbnails',
  LECTURES: 'lectures'
};

class S3Service {
  async uploadFile(file, { courseId, fileType }) {
    const fileStream = fs.createReadStream(file.path);
    
    const key = fileType === 'thumbnail' 
      ? `${S3_FOLDERS.THUMBNAILS}/${courseId}/${Date.now()}-${file.originalname}`
      : `${S3_FOLDERS.LECTURES}/${courseId}/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      return {
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key: key
      };
    } catch (error) {
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteFile(key) {
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
      throw new Error('Failed to delete file from S3');
    }
  }

  async getSignedUrl(key) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    try {
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      throw new Error('Failed to generate signed URL');
    }
  }
}

export default new S3Service(); 