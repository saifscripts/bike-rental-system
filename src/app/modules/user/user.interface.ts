import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type IUserRole = keyof typeof USER_ROLE;

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
    role: IUserRole;
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
