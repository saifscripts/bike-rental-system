"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const coupon_controller_1 = require("./coupon.controller");
const coupon_validation_1 = require("./coupon.validation");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(coupon_validation_1.CouponValidations.createCouponValidationSchema), coupon_controller_1.CouponControllers.createCoupon)
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponControllers.getCoupons);
router
    .route('/:id')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponControllers.getSingleCoupon)
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(coupon_validation_1.CouponValidations.updateCouponValidationSchema), coupon_controller_1.CouponControllers.updateCoupon)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponControllers.deleteCoupon);
exports.CouponRoutes = router;
