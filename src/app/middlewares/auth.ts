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

        if (!authHeader) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;

        const { id, role } = decoded;

        const user = await User.findById(id);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        if (authorizedRoles && !authorizedRoles.includes(role)) {
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
