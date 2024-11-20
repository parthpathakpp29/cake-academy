// utils/fileValidator.js
import { createError } from "./error.js";

export const validateFileType = (file) => {
  const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  const imageTypes = ['image/jpeg', 'image/png'];
  
  if (file.fieldname === 'thumbnail' && !imageTypes.includes(file.mimetype)) {
    throw createError(400, 'Invalid thumbnail file type');
  }
  
  if (file.fieldname === 'video' && !videoTypes.includes(file.mimetype)) {
    throw createError(400, 'Invalid video file type');
  }
  
  return true;
};
