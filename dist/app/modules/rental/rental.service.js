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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bike_model_1 = require("../bike/bike.model");
const rental_model_1 = require("./rental.model");
const rental_util_1 = require("./rental.util");
const createRentalIntoDB = (decodedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBikeExists = yield bike_model_1.Bike.findById(payload.bikeId);
    if (!isBikeExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bike not found!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newRental = yield rental_model_1.Rental.create(Object.assign(Object.assign({}, payload), { userId: decodedUser.id }));
        yield bike_model_1.Bike.findByIdAndUpdate(payload.bikeId, {
            isAvailable: false,
        });
        yield session.commitTransaction();
        yield session.endSession();
        return newRental;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const returnBikeIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const rental = yield rental_model_1.Rental.findById(id);
    if (!rental) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Rental not found!');
    }
    if (rental.isReturned) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bike is already returned!');
    }
    const bike = yield bike_model_1.Bike.findById(rental.bikeId);
    if (!bike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Failed to retrieve the bike!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const currentTime = new Date();
        const updatedRental = yield rental_model_1.Rental.findByIdAndUpdate(id, {
            returnTime: currentTime,
            totalCost: (0, rental_util_1.calculateTotalCost)(rental.startTime, currentTime, bike.pricePerHour),
            isReturned: true,
        }, {
            new: true,
        });
        yield bike_model_1.Bike.findByIdAndUpdate(rental.bikeId, {
            isAvailable: true,
        });
        yield session.commitTransaction();
        yield session.endSession();
        return updatedRental;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
exports.RentalServices = {
    createRentalIntoDB,
    returnBikeIntoDB,
};
