import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { UserRoles } from './user.constant';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
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

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password as string,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

userSchema.post('save', function (doc, next) {
    doc.password = undefined;
    next();
});

export const User = model<IUser>('User', userSchema);
