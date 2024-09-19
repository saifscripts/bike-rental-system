import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import multer from 'multer';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

export const uploadSingle = (fieldName: string): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });

        const uploadMiddleware = upload.single(fieldName);

        uploadMiddleware(req, _res, (err) => {
            if (err) {
                return next(
                    new AppError(httpStatus.BAD_REQUEST, 'File upload failed'),
                );
            }

            if (!req.file) {
                return next(
                    new AppError(httpStatus.BAD_REQUEST, 'No file uploaded'),
                );
            }

            next();
        });
    });
};

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
