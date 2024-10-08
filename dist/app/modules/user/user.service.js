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
const payment_utils_1 = require("../payment/payment.utils");
const rental_constant_1 = require("../rental/rental.constant");
const rental_model_1 = require("../rental/rental.model");
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
    // check if the user has an ongoing rental or unpaid rental
    // make sure this do not return any PENDING rentals
    const ongoingOrUnpaidRental = yield rental_model_1.Rental.findOne({
        userId: id,
        $or: [
            { rentalStatus: rental_constant_1.RENTAL_STATUS.ONGOING },
            {
                rentalStatus: rental_constant_1.RENTAL_STATUS.RETURNED,
                paymentStatus: rental_constant_1.PAYMENT_STATUS.UNPAID,
            },
        ],
    });
    if (ongoingOrUnpaidRental) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Can't delete user who has an ongoing rental or unpaid rental!");
    }
    const deletedUser = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedUser) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete user!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'User deleted successfully',
        data: deletedUser,
    };
});
const makeAdminIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.role === user_constant_1.USER_ROLE.ADMIN) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already an admin!');
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
    if (user.role !== user_constant_1.USER_ROLE.ADMIN) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is not an admin!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: user_constant_1.USER_ROLE.USER });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User role updated successfully!',
        data: result,
    };
});
const getProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).populate('wonCoupon');
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
    const emailBody = (0, payment_utils_1.replaceText)(user_constant_1.CONTACT_FORM_MESSAGE, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
    });
    const result = yield (0, sendMail_1.sendMail)({
        from: payload.email,
        to: config_1.default.mail_auth_user,
        subject: `Contact Us Form Submission from ${payload.name}`,
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
