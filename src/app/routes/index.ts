import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BikeRoutes } from '../modules/bike/bike.route';
import { CouponRoutes } from '../modules/coupon/coupon.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { RentalRoutes } from '../modules/rental/rental.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/bikes', route: BikeRoutes },
    { path: '/rentals', route: RentalRoutes },
    { path: '/payment', route: PaymentRoutes },
    { path: '/coupons', route: CouponRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
