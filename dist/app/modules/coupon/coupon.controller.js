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
exports.CouponControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const coupon_service_1 = require("./coupon.service");
// Route: /api/v1/coupons (POST)
const createCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponServices.createCouponIntoDB(req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/coupons (GET)
const getCoupons = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponServices.getCouponsFromDB();
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/coupons/:id (GET)
const getSingleCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponServices.getSingleCouponFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/coupons/:id (PUT)
const updateCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponServices.updateCouponInDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/coupons/:id (DELETE)
const deleteCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponServices.deleteCouponFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/coupons/spin (POST)
const spinWheel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponServices.spinWheelAndAssignCouponToUser(req.user.id);
    (0, sendResponse_1.default)(res, result);
}));
exports.CouponControllers = {
    createCoupon,
    getCoupons,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon,
    spinWheel,
};
