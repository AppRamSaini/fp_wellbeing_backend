import Joi from 'joi';
import { sendErrorResponse } from '@/utils';
import { NextFunction, Request, Response } from 'express';

export function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30),
        first_name: Joi.string().min(3),
        last_name: Joi.string().min(3),
        email: Joi.string().email().min(3),
        address: Joi.string(),
        date_of_birth: Joi.date(),
    })
        .not('password')
        .or('username', 'first_name', 'last_name', 'email', 'address', 'date_of_birth');

    const { error } = schema.validate(req.body);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next();
}
