import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    date_of_birth: string;
    password: string;
}

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true,
    },
    first_name: {
        required: true,
        type: String,
    },
    last_name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    address: {
        required: true,
        type: String,
    },
    date_of_birth: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const User = mongoose.model<IUser>('User', UserSchema, 'users');
