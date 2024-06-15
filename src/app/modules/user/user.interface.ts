import { Model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
    role: 'admin' | 'user';
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface UserModel extends Model<IUser> {
    comparePassword(plain: string, hashed: string): Promise<boolean>;
}
