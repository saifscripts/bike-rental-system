import mongoose from 'mongoose';
import config from '../../config';
import { Bike } from '../bike/bike.model';
import { PAYMENT_STATUS, RENTAL_STATUS } from '../rental/rental.constant';
import { Rental } from '../rental/rental.model';
import { failPage, successPage } from './payment.constant';
import { verifyPayment } from './payment.utils';

const confirmRental = async (txnId: string) => {
    const verifyResponse = await verifyPayment(txnId);

    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // confirm rental
            const rental = await Rental.findOneAndUpdate(
                { txnId },
                {
                    rentalStatus: RENTAL_STATUS.ONGOING,
                    paidAmount: Number(verifyResponse?.amount),
                },
                { new: true, session },
            );

            // update bike availability
            await Bike.findByIdAndUpdate(
                rental?.bikeId,
                { isAvailable: false },
                { session },
            );

            await session.commitTransaction();
            await session.endSession();

            return successPage.replace(
                '{{dashboard-link}}',
                `${config.client_base_url}/dashboard/bookings`,
            );
        } catch {
            await session.abortTransaction();
            await session.endSession();
            return 'Something went wrong!';
        }
    }

    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        const rental = await Rental.findOne({ txnId });

        return failPage
            .replace(
                '{{retry-link}}',
                `${config.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            )
            .replace(
                '{{back-link}}',
                `${config.client_base_url}/bike/${rental?.bikeId}`,
            );
    }

    return 'Something went wrong!';
};

const completeRental = async (txnId: string) => {
    const verifyResponse = await verifyPayment(txnId);

    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        // update payment status and paid amount
        await Rental.findOneAndUpdate(
            { finalTxnId: txnId },
            {
                $set: { paymentStatus: PAYMENT_STATUS.PAID },
                $inc: { paidAmount: Number(verifyResponse?.amount) },
            },
            { new: true },
        );

        return successPage.replace(
            '{{dashboard-link}}',
            `${config.client_base_url}/dashboard/bookings`,
        );
    }

    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        return failPage
            .replace(
                '{{retry-link}}',
                `${config.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            )
            .replace(
                '{{back-link}}',
                `${config.client_base_url}/dashboard/bookings`,
            );
    }

    return 'Something went wrong!';
};

export const PaymentServices = {
    confirmRental,
    completeRental,
};
