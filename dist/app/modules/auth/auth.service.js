"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await User.findOne({ id: payload?.id }).select('+password');
    // if (!user) {
    //     throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    // }
    // const isDeleted = user?.isDeleted;
    // if (isDeleted) {
    //     throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    // }
    // const userStatus = user?.status;
    // if (userStatus === 'block') {
    //     throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    // }
    // const isPasswordMatched = await User.comparePassword(
    //     payload?.password,
    //     user?.password,
    // );
    // if (!isPasswordMatched) {
    //     throw new AppError(httpStatus.BAD_REQUEST, 'Wrong user id or password');
    // }
    // const jwtPayload = {
    //     id: user.id,
    //     role: user.role,
    // };
    // const accessToken = createToken(
    //     jwtPayload,
    //     config.jwt_access_secret as string,
    //     config.jwt_access_exp_in as string,
    // );
    // const refreshToken = createToken(
    //     jwtPayload,
    //     config.jwt_refresh_secret as string,
    //     config.jwt_refresh_exp_in as string,
    // );
    // return {
    //     accessToken,
    //     refreshToken,
    //     needsPasswordChange: user.needsPasswordChange,
    // };
});
exports.AuthServices = {
    signup,
};
