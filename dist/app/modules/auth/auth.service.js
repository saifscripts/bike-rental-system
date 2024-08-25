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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const auth_util_1 = require("./auth.util");
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_model_1.User.create(payload);
    return {
        statusCode: http_status_1.default.CREATED,
        message: 'User registered successfully',
        data: newUser,
    };
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select('+password');
    // check if user exists
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the password matched
    const isPasswordMatched = yield user_model_1.User.comparePassword(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong user id or password');
    }
    const jwtPayload = {
        id: user._id,
        role: user.role,
    };
    // create access token
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    // create refresh token
    const refreshToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_exp_in);
    user.password = undefined; // remove password field
    return {
        statusCode: http_status_1.default.OK,
        message: 'User logged in successfully',
        token: accessToken,
        refreshToken,
        data: user,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const user = yield user_model_1.User.findById(decoded.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const jwtPayload = {
        id: user._id,
        role: user.role,
    };
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    return {
        statusCode: http_status_1.default.OK,
        message: 'Successfully retrieved refresh token!',
        token: accessToken,
        data: null,
    };
});
exports.AuthServices = {
    signup,
    login,
    refreshToken,
};
