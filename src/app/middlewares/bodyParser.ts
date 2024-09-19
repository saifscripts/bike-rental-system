import { RequestHandler } from 'express';

export const bodyParser: RequestHandler = (req, _res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
};
