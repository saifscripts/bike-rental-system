import catchAsync from '../../utils/catchAsync';
import { PaymentServices } from './payment.service';

// Route: /api/v1/payment/confirm-rental (POST)
const confirmRental = catchAsync(async (req, res) => {
    const result = await PaymentServices.confirmRental(
        req.query.TXNID as string,
    );
    res.send(result);
});

// Route: /api/v1/payment/complete-rental (POST)
const completeRental = catchAsync(async (req, res) => {
    const result = await PaymentServices.completeRental(
        req.query.TXNID as string,
    );

    res.send(result);
});

export const PaymentControllers = {
    confirmRental,
    completeRental,
};
