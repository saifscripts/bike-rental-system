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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendMail_1 = require("../../utils/sendMail");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const getUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const users = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    // check if retrieved data is empty
    if (!users.length) {
        return {
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'No Data Found',
            data: [],
        };
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Users retrieved successfully',
        data: users,
        meta,
    };
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const result = yield user_model_1.User.deleteOne({ _id: id });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User deleted successfully',
        data: result,
    };
});
const makeAdminIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: user_constant_1.USER_ROLE.ADMIN });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User role updated successfully!',
        data: result,
    };
});
const removeAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: user_constant_1.USER_ROLE.USER });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User role updated successfully!',
        data: result,
    };
});
const getProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    return {
        statusCode: http_status_1.default.OK,
        message: 'User profile retrieved successfully',
        data: user,
    };
});
const updateProfileIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
});
const contactUsViaMail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const emailBody = user_constant_1.CONTACT_FORM_MESSAGE.replace('{{name}}', payload.name)
        .replace('{{email}}', payload.email)
        .replace('{{phone}}', payload.phone)
        .replace('{{message}}', payload.message);
    const result = yield (0, sendMail_1.sendMail)({
        from: payload.email,
        to: config_1.default.mail_auth_user,
        subject: payload.name,
        html: emailBody,
    });
    if (!result.messageId) {
        throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Fail to send email!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Email sent successfully',
        data: null,
    };
});
const updateAvatar = (id, image) => __awaiter(void 0, void 0, void 0, function* () {
    if (!image) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Avatar is required');
    }
    const avatarURL = yield (0, uploadImage_1.default)(image.buffer, id, 'avatar');
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, { avatarURL }, {
        new: true,
    });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
});
exports.UserServices = {
    getUsersFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    getProfileFromDB,
    updateProfileIntoDB,
    contactUsViaMail,
    updateAvatar,
};
