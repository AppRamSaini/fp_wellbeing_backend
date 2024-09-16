import { MongoServerError } from 'mongodb';
import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse, ApiError } from '@/utils';
import { User } from '@/models';

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await User.find({}).select('-password');

        sendSuccessResponse(res, 200, 'Users found', users);
    } catch (error) {
        console.error('Error fetching users:', error);

        if (error instanceof ApiError) {
            sendErrorResponse(res, error.statusCode, error.message, error);
            return;
        }

        sendErrorResponse(res, 500, 'An unknown error occurred.');
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        if (!userId) {
            throw new ApiError(400, 'User ID is required');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        sendSuccessResponse(res, 200, 'User found', user);
    } catch (error) {
        console.error('Error fetching user:', error);

        if (error instanceof ApiError) {
            sendErrorResponse(res, error.statusCode, error.message, error);
            return;
        }

        sendErrorResponse(res, 500, 'An unknown error occurred.');
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        if (!userId) {
            throw new ApiError(400, 'User ID is required');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        req.body.password = user.password;
        user.set(req.body);

        await user.save();
        sendSuccessResponse(res, 200, 'User updated', user);
    } catch (error) {
        console.log('error', error);
        if (error instanceof MongoServerError) {
            if (error.code === 11000 && error.keyPattern.username) {
                sendErrorResponse(res, 400, 'Username already taken');
            } else if (error.code === 11000 && error.keyPattern.email) {
                sendErrorResponse(res, 400, 'Email already exists');
            } else {
                sendErrorResponse(res, 400, error.message);
            }
        } else if (error instanceof ApiError) {
            sendErrorResponse(res, error.statusCode, error.message, error);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        console.log('userId', userId);

        if (!userId) {
            throw new ApiError(400, 'User ID is required');
        }

        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            throw new ApiError(404, 'User not found');
        }

        sendSuccessResponse(res, 200, 'User deleted');
    } catch (error) {
        console.error('Error deleting user:', error);

        if (error instanceof ApiError) {
            sendErrorResponse(res, error.statusCode, error.message, error);
            return;
        }

        sendErrorResponse(res, 500, 'An unknown error occurred.');
    }
}
