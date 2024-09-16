import Joi from 'joi';
import { sendErrorResponse } from '@/utils';
import { Request, Response, NextFunction } from 'express';

const passwordFormat = Joi.string()
    .min(8)
    .max(20)
    .required()
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}[\]:;"'<>,.?/~`\\-]{8,20}$/)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[^a-zA-Z0-9]/)
    .messages({
        'string.pattern.base':
            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be at most 20 characters long',
        'any.required': 'Password is required',
    });

export function validateGetRegisterOtp(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next();
}

export function validateVerifyOtp(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).required(),
        otp: Joi.string().min(6).max(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next();
}

export function validateChangePass(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).required(),
        password: passwordFormat,
        confirm_password: passwordFormat,
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next();
}

export function validateRegister(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        otp: Joi.string().min(6).max(6).required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        email: Joi.string().email().min(3).required(),
        address: Joi.string().required(),
        date_of_birth: Joi.date().required(),
        password: passwordFormat,
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next();
}
