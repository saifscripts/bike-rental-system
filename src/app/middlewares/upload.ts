import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import multer from 'multer';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

export const uploadSingle = (fieldName: string): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });
        upload.single(fieldName);
        const file = req.file;
        if (!file) {
            throw new AppError(httpStatus.BAD_REQUEST, 'No file uploaded');
        }
        next();
    });
};
