import { RequestHandler } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const parsed = await schema.parseAsync({
            body: req.body,
        });

        req.body = parsed.body; // set request body from the parsed data
        next();
    });
};

export default validateRequest;
