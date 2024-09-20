import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { IUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...authorizedRoles: IUserRole[]): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const authHeader = req.headers.authorization;

        // check if auth header is sent
        if (!authHeader) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        const token = authHeader.split(' ')[1]; // split and retrieve token

        // check if token is present
        if (!token) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        // decode the token
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;

        const { id } = decoded;

        // check if user exists from the decoded user id
        const user = await User.findById(id);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        if (user.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        // check if the decoded user is authorized
        if (authorizedRoles && !authorizedRoles.includes(user.role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        req.user = decoded;
        next();
    });
};

export default auth;
