import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Bike } from '../bike/bike.model';
import { PAYMENT_STATUS, RENTAL_STATUS } from '../rental/rental.constant';
import { Rental } from '../rental/rental.model';
import { User } from '../user/user.model';
import { failPage, successPage } from './payment.constant';
import { replaceText, verifyPayment } from './payment.utils';

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

            return replaceText(successPage, {
                'primary-link': `${config.client_base_url}/dashboard/my-rentals`,
                'primary-text': 'Continue to Dashboard',
            });
        } catch {
            await session.abortTransaction();
            await session.endSession();
            return 'Something went wrong!';
        }
    }

    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        const rental = await Rental.findOne({ txnId });

        return replaceText(failPage, {
            'primary-link': `${config.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            'secondary-link': `${config.client_base_url}/bike/${rental?.bikeId}`,
            'primary-text': 'Retry Payment',
            'secondary-text': 'Go Back',
        });
    }

    return 'Something went wrong!';
};

const completeRental = async (txnId: string) => {
    const verifyResponse = await verifyPayment(txnId);

    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();
            // update payment status and increment paid amount
            const updatedRental = await Rental.findOneAndUpdate(
                { finalTxnId: txnId },
                {
                    $set: { paymentStatus: PAYMENT_STATUS.PAID },
                    $inc: { paidAmount: Number(verifyResponse?.amount) },
                },
                { new: true },
            );

            if (!updatedRental) {
                throw new AppError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    'Something went wrong!',
                );
            }

            if (updatedRental.discount > 0) {
                // remove the coupon from the user
                const updatedUser = await User.findByIdAndUpdate(
                    updatedRental.userId,
                    {
                        wonCoupon: null,
                    },
                    { session },
                );

                if (!updatedUser) {
                    throw new AppError(
                        httpStatus.INTERNAL_SERVER_ERROR,
                        'Failed to update user data!',
                    );
                }
            }

            // commit transaction and end session
            await session.commitTransaction();
            await session.endSession();

            return replaceText(successPage, {
                'primary-link': `${config.client_base_url}/dashboard/my-rentals`,
                'primary-text': 'Continue to Dashboard',
            });
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            throw error;
        }
    }

    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        return replaceText(failPage, {
            'primary-link': `${config.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            'secondary-link': `${config.client_base_url}/dashboard/my-rentals`,
            'primary-text': 'Retry Payment',
            'secondary-text': 'Go Back',
        });
    }

    return 'Something went wrong!';
};

export const PaymentServices = {
    confirmRental,
    completeRental,
};
