export const PAYMENT_STATUS = {
    PAID: 'PAID',
    UNPAID: 'UNPAID',
} as const;

export const PaymentStatus = ['PAID', 'UNPAID'] as const;

export const RENTAL_STATUS = {
    PENDING: 'PENDING',
    ONGOING: 'ONGOING',
    RETURNED: 'RETURNED',
} as const;

export const RentalStatus = ['PENDING', 'ONGOING', 'RETURNED'] as const;
