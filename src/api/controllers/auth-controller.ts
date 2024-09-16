import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';
import { Request, Response } from 'express';

import { config } from '@/config';
import { Otp, User } from '@/models';
import { sendErrorResponse, sendSuccessResponse, sendCodeToEmail, ApiError } from '@/utils';

const genRandomOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

export async function getOtp(req: Request, res: Response) {
    try {
        const email = req.body.email;
        if (await User.findOne({ email })) {
            throw new ApiError(400, 'User already exists');
        }

        if (await Otp.findOne({ email, type: 'register' })) {
            await Otp.deleteOne({ email, type: 'register' });
        }

        const otp = genRandomOtp();

        await sendCodeToEmail(email, otp, 'register', req, res);
        await Otp.create({ type: 'register', email, otp });

        sendSuccessResponse(res, 200, 'OTP sent successfully');
    } catch (error) {
        if (error instanceof ApiError) {
            sendErrorResponse(res, error.statusCode, error.message, error);
            return;
        }

        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        sendErrorResponse(res, 400, message);
    }
}

export async function register(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        if (await Otp.findOne({ email, otp, type: 'register' })) {
            await Otp.deleteOne({ email, otp, type: 'register' });
        } else {
            throw new ApiError(400, 'Invalid OTP or OTP expired');
        }

        const userData = { ...req.body };
        delete userData.otp;

        const user = new User(userData);
        await user.save();

        sendSuccessResponse(res, 201, 'User registered successfully!');
    } catch (err) {
        if (err instanceof MongoServerError) {
            if (err.code === 11000 && err.keyPattern.username) {
                sendErrorResponse(res, 400, 'Username already taken.');
            } else if (err.code === 11000 && err.keyPattern.email) {
                sendErrorResponse(res, 400, 'User already exists. Please try logging in');
            } else {
                sendErrorResponse(res, 400, err.message);
            }
        } else if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, 'User not found.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(400, 'Incorrect password.');
        }

        const token = jwt.sign({ sub: user._id }, config.env.JWT_SECRET, { expiresIn: '24h' });
        sendSuccessResponse(res, 200, 'Login successful.', { token });
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
            return;
        }

        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        sendErrorResponse(res, 400, message);
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, 'User not found.');
        }

        const otp = genRandomOtp();

        await sendCodeToEmail(email, otp, 'forgot_password', req, res, user.first_name);
        await Otp.create({ type: 'forgot_password', email, otp });

        sendSuccessResponse(res, 200, 'OTP sent successfully');
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
            return;
        }

        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        sendErrorResponse(res, 400, message);
    }
}

export async function verifyOtp(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        if (await Otp.findOne({ email, otp, type: 'forgot_password' })) {
            await Otp.deleteOne({ email, otp, type: 'forgot_password' });
        } else {
            throw new ApiError(400, 'Invalid OTP or OTP expired');
        }

        sendSuccessResponse(res, 200, 'OTP verified successfully');
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
            return;
        }

        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        sendErrorResponse(res, 400, message);
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            throw new ApiError(400, 'Passwords do not match');
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, 'User not found.');
        }

        if (await bcrypt.compare(password, user.password)) {
            throw new ApiError(400, 'New password cannot be the same as the old password');
        }

        user.password = password;
        await user.save();
        sendSuccessResponse(res, 200, 'Password changed successfully');
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
            return;
        }

        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        sendErrorResponse(res, 400, message);
    }
}
