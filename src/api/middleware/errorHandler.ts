import { Request, Response } from 'express';

// Custom Error Class
class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error Handling Middleware
export default function errorHandler(err: AppError, req: Request, res: Response) {
    // Log the error details (for internal server errors)
    if (err.isOperational) {
        // Operational error: send a safe error message to the client
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    } else {
        // Programming or unknown error: log the error and send a generic message
        console.error('Unexpected error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.',
        });
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, 400);
    }
}
