import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { UserRoles } from './user.constant';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, UserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        role: { type: String, required: true, enum: UserRoles },
    },
    {
        timestamps: true,
    },
);

UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password as string,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

UserSchema.post('save', function (doc, next) {
    doc.password = undefined;
    next();
});

UserSchema.statics.comparePassword = async function (
    plain: string,
    hashed: string,
) {
    return await bcrypt.compare(plain, hashed);
};

export const User = model<IUser, UserModel>('User', UserSchema);
