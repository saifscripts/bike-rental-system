import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import { join } from 'path';
import config from '../../config';
import { Bike } from '../bike/bike.model';
import { Rental } from '../rental/rental.model';
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
                    isConfirmed: true,
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

            const filePath = join(__dirname + '/success.html');
            const successTemplate = readFileSync(filePath, 'utf-8').replace(
                '{{dashboard-link}}',
                `${config.client_base_url}/dashboard/bookings`,
            );
            return successTemplate;
        } catch {
            await session.abortTransaction();
            await session.endSession();
            return 'Something went wrong!';
        }
    }

    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        const rental = await Rental.findOne({ txnId });

        const filePath = join(__dirname + '/fail.html');
        const failTemplate = readFileSync(filePath, 'utf-8')
            .replace(
                '{{retry-link}}',
                `${config.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            )
            .replace(
                '{{back-link}}',
                `${config.client_base_url}/bike/${rental?.bikeId}`,
            );
        return failTemplate;
    }

    return 'Something went wrong!';
};

export const PaymentServices = {
    confirmRental,
};
