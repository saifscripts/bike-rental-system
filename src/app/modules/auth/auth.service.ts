import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { ILoginCredentials, IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { createToken } from './auth.util';

const signup = async (payload: IUser) => {
    const result = await User.create(payload);
    return result;
};

const login = async (payload: ILoginCredentials) => {
    const user = await User.findOne({ email: payload?.email }).select(
        '+password -createdAt -updatedAt -__v',
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isPasswordMatched = await User.comparePassword(
        payload?.password,
        user?.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong user id or password');
    }

    const jwtPayload = {
        id: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_exp_in as string,
    );

    user.password = undefined; // remove password field

    return {
        accessToken,
        user,
    };
};

export const AuthServices = {
    signup,
    login,
};
