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
exports.RentalServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bike_model_1 = require("../bike/bike.model");
const coupon_model_1 = require("../coupon/coupon.model");
const payment_utils_1 = require("../payment/payment.utils");
const user_model_1 = require("../user/user.model");
const rental_constant_1 = require("./rental.constant");
const rental_model_1 = require("./rental.model");
const rental_util_1 = require("./rental.util");
const createRentalIntoDB = (decodedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedUser.id;
    const user = yield user_model_1.User.findById(userId);
    // check if the user exists
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const bike = yield bike_model_1.Bike.findById(payload.bikeId);
    // check if the bike exists
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bike not found!');
    }
    // check if the bike is available right now
    if (!bike.isAvailable) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bike is not available right now!');
    }
    const txnId = (0, payment_utils_1.generateTransactionId)();
    const paymentResponse = yield (0, payment_utils_1.initiatePayment)({
        txnId,
        amount: 100,
        successURL: `${config_1.default.base_url}/api/v1/payment/confirm-rental?TXNID=${txnId}`,
        failURL: `${config_1.default.base_url}/api/v1/payment/confirm-rental?TXNID=${txnId}`,
        cancelURL: `${config_1.default.client_base_url}/bike/${payload.bikeId}`,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    });
    if (!(paymentResponse === null || paymentResponse === void 0 ? void 0 : paymentResponse.result)) {
        throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Failed to initiate payment!');
    }
    yield rental_model_1.Rental.create(Object.assign(Object.assign({}, payload), { userId,
        txnId }));
    return {
        statusCode: http_status_1.default.CREATED,
        message: 'Rental initiated successfully',
        data: paymentResponse,
    };
});
const initiateRemainingPayment = (rentalId, couponCode) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const rental = yield rental_model_1.Rental.findById(rentalId).populate('userId');
    // check if the rental exists
    if (!rental) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Rental not found!');
    }
    // check if the bike is returned
    if (rental.rentalStatus !== rental_constant_1.RENTAL_STATUS.RETURNED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Bike is not returned yet!');
    }
    const user = yield user_model_1.User.findById(rental.userId).populate('wonCoupon');
    // check if the rental exists
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // Validate coupon
    if (couponCode && ((_a = user.wonCoupon) === null || _a === void 0 ? void 0 : _a.code) !== couponCode) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid coupon code.');
    }
    // Apply discount if coupon is valid
    let discount = 0;
    if (couponCode) {
        const coupon = yield coupon_model_1.Coupon.findOne({ code: couponCode });
        if (!coupon) {
            // remove the coupon from the user
            yield user_model_1.User.findByIdAndUpdate(user._id, {
                wonCoupon: null,
            });
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid coupon code. Coupon may be expired.');
        }
        discount = rental.totalCost * (coupon.discountPercentage / 100);
    }
    // Calculate final amount after applying the discount
    const finalAmount = rental.totalCost - discount;
    const remainingAmount = finalAmount - rental.paidAmount;
    // check if the payment is already done
    if (remainingAmount <= 0) {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // update relevant rental data
            const updatedRental = yield rental_model_1.Rental.findByIdAndUpdate(rentalId, {
                paidAmount: rental.totalCost,
                paymentStatus: rental_constant_1.PAYMENT_STATUS.PAID,
                discount,
            }, {
                new: true,
                session,
            });
            if (!updatedRental) {
                throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update rental data!');
            }
            if (discount > 0) {
                // remove the coupon from the user
                const updatedUser = yield user_model_1.User.findByIdAndUpdate(user._id, {
                    wonCoupon: null,
                }, { session });
                if (!updatedUser) {
                    throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update user data!');
                }
            }
            // commit transaction and end session
            yield session.commitTransaction();
            yield session.endSession();
            return {
                statusCode: http_status_1.default.OK,
                message: `Payment already done. You will get a refund of ${(-remainingAmount).toFixed(2)} taka`,
                data: updatedRental,
            };
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw error;
        }
    }
    const txnId = (0, payment_utils_1.generateTransactionId)();
    const paymentResponse = yield (0, payment_utils_1.initiatePayment)({
        txnId,
        amount: remainingAmount,
        successURL: `${config_1.default.base_url}/api/v1/payment/complete-rental?TXNID=${txnId}`,
        failURL: `${config_1.default.base_url}/api/v1/payment/complete-rental?TXNID=${txnId}`,
        cancelURL: `${config_1.default.client_base_url}/dashboard/my-rentals`,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    });
    if (!(paymentResponse === null || paymentResponse === void 0 ? void 0 : paymentResponse.result)) {
        throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Failed to initiate payment!');
    }
    yield rental_model_1.Rental.findByIdAndUpdate(rentalId, {
        finalTxnId: txnId,
        discount,
    });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Payment initiated successfully',
        data: paymentResponse,
    };
});
const returnBikeIntoDB = (rentalId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const rental = yield rental_model_1.Rental.findById(rentalId);
    // check if the rental exists
    if (!rental) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Rental not found!');
    }
    // check if the bike is already returned
    if (rental.rentalStatus === rental_constant_1.RENTAL_STATUS.PENDING) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User didn't confirm this rental!");
    }
    // check if the bike is already returned
    if (rental.rentalStatus === rental_constant_1.RENTAL_STATUS.RETURNED) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bike is already returned!');
    }
    // retrieve the bike data for updating rental data
    const bike = yield bike_model_1.Bike.findById(rental.bikeId);
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Failed to retrieve the bike!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const totalCost = (0, rental_util_1.calculateTotalCost)(rental.startTime, payload.returnTime, Number(bike.pricePerHour));
        // update relevant rental data
        const updatedRental = yield rental_model_1.Rental.findByIdAndUpdate(rentalId, {
            returnTime: payload.returnTime,
            rentalStatus: rental_constant_1.RENTAL_STATUS.RETURNED,
            totalCost,
        }, {
            new: true,
            session,
        });
        // update bike availability status to true
        yield bike_model_1.Bike.findByIdAndUpdate(rental.bikeId, {
            isAvailable: true,
        }, { session });
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        // return response
        return {
            statusCode: http_status_1.default.OK,
            message: 'Bike returned successfully',
            data: updatedRental,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getMyRentalsFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalQuery = new QueryBuilder_1.default(rental_model_1.Rental.find({ userId }).populate('bikeId'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const rentals = yield rentalQuery.modelQuery;
    const meta = yield rentalQuery.countTotal();
    // check if retrieved data is empty
    if (!rentals.length) {
        return {
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'No Data Found',
            data: [],
        };
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Rentals retrieved successfully',
        data: rentals,
        meta,
    };
});
const getAllRentalsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalQuery = new QueryBuilder_1.default(rental_model_1.Rental.find().populate('bikeId userId'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const rentals = yield rentalQuery.modelQuery;
    const meta = yield rentalQuery.countTotal();
    // check if retrieved data is empty
    if (!rentals.length) {
        return {
            statusCode: http_status_1.default.NOT_FOUND,
            message: 'No Data Found',
            data: [],
        };
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Rentals retrieved successfully',
        data: rentals,
        meta,
    };
});
exports.RentalServices = {
    createRentalIntoDB,
    initiateRemainingPayment,
    returnBikeIntoDB,
    getMyRentalsFromDB,
    getAllRentalsFromDB,
};
