import catchAsync from '../../utils/catchAsync';
import { PaymentServices } from './payment.service';

const confirmRental = catchAsync(async (req, res) => {
    const result = await PaymentServices.confirmRental(
        req.query.TXNID as string,
    );

    res.send(result);
});

export const PaymentControllers = {
    confirmRental,
};
