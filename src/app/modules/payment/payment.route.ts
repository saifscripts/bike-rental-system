import express from 'express';
import { PaymentControllers } from './payment.controller';

const router = express.Router();

router.route('/rental/success').post(PaymentControllers.confirmRental);
router.route('/rental/fail').post(PaymentControllers.confirmRental);

export const PaymentRoutes = router;
