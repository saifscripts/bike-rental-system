"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const bike_route_1 = require("../modules/bike/bike.route");
const coupon_route_1 = require("../modules/coupon/coupon.route");
const payment_route_1 = require("../modules/payment/payment.route");
const rental_route_1 = require("../modules/rental/rental.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const routes = [
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/users', route: user_route_1.UserRoutes },
    { path: '/bikes', route: bike_route_1.BikeRoutes },
    { path: '/rentals', route: rental_route_1.RentalRoutes },
    { path: '/payment', route: payment_route_1.PaymentRoutes },
    { path: '/coupons', route: coupon_route_1.CouponRoutes },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
