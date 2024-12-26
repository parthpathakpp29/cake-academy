import { errorResponse } from '../utils/responseHandler.js';
import { AppError } from '../utils/error.js';
import fs from 'fs';

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Clean up uploaded files if they exist
    if (req.files) {
        Object.values(req.files).flat().forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (unlinkError) {
                console.error('Error cleaning up file:', unlinkError);
            }
        });
    }

    // Handle custom AppError
    if (err instanceof AppError) {
        return errorResponse(res, {
            statusCode: err.statusCode,
            message: err.message
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return errorResponse(res, {
            statusCode: 400,
            message: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    // Handle other errors
    errorResponse(res, {
        statusCode: err.statusCode || 500,
        message: err.message || 'Something went wrong'
    });
}; 