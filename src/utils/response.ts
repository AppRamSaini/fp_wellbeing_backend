import { Response } from 'express';

export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const sendSuccessResponse = (res: Response, statusCode: number, message: string, data?: unknown) => {
    return res.status(statusCode).json({
        success: {
            status: statusCode,
            message,
            data,
        },
    });
};

export const sendErrorResponse = (res: Response, statusCode: number, message: string, error?: ApiError | Error) => {
    console.error('Error:', error?.message || message);

    return res.status(statusCode).json({
        error: {
            status: statusCode,
            message,
        },
    });
};
