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
exports.PaymentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bike_model_1 = require("../bike/bike.model");
const rental_constant_1 = require("../rental/rental.constant");
const rental_model_1 = require("../rental/rental.model");
const user_model_1 = require("../user/user.model");
const payment_constant_1 = require("./payment.constant");
const payment_utils_1 = require("./payment.utils");
const confirmRental = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(txnId);
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // confirm rental
            const rental = yield rental_model_1.Rental.findOneAndUpdate({ txnId }, {
                rentalStatus: rental_constant_1.RENTAL_STATUS.ONGOING,
                paidAmount: Number(verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.amount),
            }, { new: true, session });
            // update bike availability
            yield bike_model_1.Bike.findByIdAndUpdate(rental === null || rental === void 0 ? void 0 : rental.bikeId, { isAvailable: false }, { session });
            yield session.commitTransaction();
            yield session.endSession();
            return (0, payment_utils_1.replaceText)(payment_constant_1.successPage, {
                'primary-link': `${config_1.default.client_base_url}/dashboard/my-rentals`,
                'primary-text': 'Continue to Dashboard',
            });
        }
        catch (_a) {
            yield session.abortTransaction();
            yield session.endSession();
            return 'Something went wrong!';
        }
    }
    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        const rental = yield rental_model_1.Rental.findOne({ txnId });
        return (0, payment_utils_1.replaceText)(payment_constant_1.failPage, {
            'primary-link': `${config_1.default.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            'secondary-link': `${config_1.default.client_base_url}/bike/${rental === null || rental === void 0 ? void 0 : rental.bikeId}`,
            'primary-text': 'Retry Payment',
            'secondary-text': 'Go Back',
        });
    }
    return 'Something went wrong!';
});
const completeRental = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(txnId);
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // update payment status and increment paid amount
            const updatedRental = yield rental_model_1.Rental.findOneAndUpdate({ finalTxnId: txnId }, {
                $set: { paymentStatus: rental_constant_1.PAYMENT_STATUS.PAID },
                $inc: { paidAmount: Number(verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.amount) },
            }, { new: true });
            if (!updatedRental) {
                throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong!');
            }
            if (updatedRental.discount > 0) {
                // remove the coupon from the user
                const updatedUser = yield user_model_1.User.findByIdAndUpdate(updatedRental.userId, {
                    wonCoupon: null,
                }, { session });
                if (!updatedUser) {
                    throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update user data!');
                }
            }
            // commit transaction and end session
            yield session.commitTransaction();
            yield session.endSession();
            return (0, payment_utils_1.replaceText)(payment_constant_1.successPage, {
                'primary-link': `${config_1.default.client_base_url}/dashboard/my-rentals`,
                'primary-text': 'Continue to Dashboard',
            });
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw error;
        }
    }
    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        return (0, payment_utils_1.replaceText)(payment_constant_1.failPage, {
            'primary-link': `${config_1.default.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            'secondary-link': `${config_1.default.client_base_url}/dashboard/my-rentals`,
            'primary-text': 'Retry Payment',
            'secondary-text': 'Go Back',
        });
    }
    return 'Something went wrong!';
});
exports.PaymentServices = {
    confirmRental,
    completeRental,
};
