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
exports.RentalControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const rental_service_1 = require("./rental.service");
// Route: /api/rentals (POST)
const createRental = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rental_service_1.RentalServices.createRentalIntoDB(req.user, req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/rentals/:id/return (PUT)
const returnBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield rental_service_1.RentalServices.returnBikeIntoDB(id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/rentals (GET)
const getRentals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield rental_service_1.RentalServices.getRentalsFromDB(id);
    (0, sendResponse_1.default)(res, result);
}));
exports.RentalControllers = {
    createRental,
    returnBike,
    getRentals,
};
