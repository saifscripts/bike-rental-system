import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { ILoginCredentials, IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { createToken } from './auth.util';

const signup = async (payload: IUser) => {
    const newUser = await User.create(payload);

    return {
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: newUser,
    };
};

const login = async (payload: ILoginCredentials) => {
    const user = await User.findOne({ email: payload?.email }).select(
        '+password',
    );

    // check if user exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the password matched
    const isPasswordMatched = await User.comparePassword(
        payload?.password,
        user?.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong user id or password');
    }

    const jwtPayload = {
        id: user._id,
        role: user.role,
    };

    // create access token
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_exp_in as string,
    );

    user.password = undefined; // remove password field

    return {
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        token: accessToken,
        data: user,
    };
};

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const jwtPayload = {
        id: user._id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_exp_in as string,
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Successfully retrieved refresh token!',
        token: accessToken,
        data: null,
    };
};

export const AuthServices = {
    signup,
    login,
    refreshToken,
};
