import mongoose, { Model } from 'mongoose';
import { ICoupon } from '../coupon/coupon.interface';
import { USER_ROLE } from './user.constant';

export type IUserRole = keyof typeof USER_ROLE;

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
    avatarURL?: string;
    wonCoupon: mongoose.Types.ObjectId | ICoupon | null;
    role: IUserRole;
    isDeleted: boolean;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IContactUsOptions {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface UserModel extends Model<IUser> {
    comparePassword(plain: string, hashed: string): Promise<boolean>;
}
