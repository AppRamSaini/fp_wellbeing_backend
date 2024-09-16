import mongoose, { Document } from 'mongoose';

export interface IOtp extends Document {
    user_id?: number;
    otp: number;
    email: string;
    type: 'register' | 'forgot_password';
    timestamp: Date;
}

const OtpSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        default: null,
    },
    otp: {
        required: true,
        type: Number,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    type: {
        required: true,
        type: String,
        enum: ['register', 'forgot_password'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24,
    },
    create_at: {
        type: Date,
        default: Date.now,
    },
});

export const Otp = mongoose.model<IOtp>('Otp', OtpSchema, 'otp');
