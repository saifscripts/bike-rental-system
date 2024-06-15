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
exports.BikeServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bike_model_1 = require("./bike.model");
const createBikeIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newBike = yield bike_model_1.Bike.create(payload);
    return newBike;
});
const getBikesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const bikes = yield bike_model_1.Bike.find();
    if (!bikes.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No Data Found');
    }
    return bikes;
});
const updateBikeIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBikeExists = yield bike_model_1.Bike.findById(id);
    if (!isBikeExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Bike not found!');
    }
    const updatedBike = yield bike_model_1.Bike.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return updatedBike;
});
exports.BikeServices = {
    createBikeIntoDB,
    getBikesFromDB,
    updateBikeIntoDB,
};
