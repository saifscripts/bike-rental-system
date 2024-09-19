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
exports.BikeControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const bike_service_1 = require("./bike.service");
// Route: /api/bikes (POST)
const createBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.BikeServices.createBikeIntoDB(req.body, req.file);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/bikes (GET)
const getBikes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.BikeServices.getBikesFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/bikes/:id (GET)
const getSingleBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.BikeServices.getSingleBikeFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/bikes/:id (PUT)
const updateBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield bike_service_1.BikeServices.updateBikeIntoDB(id, req.body, req === null || req === void 0 ? void 0 : req.file);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/bikes/:id (DELETE)
const deleteBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield bike_service_1.BikeServices.deleteBikeFromDB(id);
    (0, sendResponse_1.default)(res, result);
}));
exports.BikeControllers = {
    createBike,
    getBikes,
    getSingleBike,
    updateBike,
    deleteBike,
};
