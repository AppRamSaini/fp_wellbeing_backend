import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import { sendErrorResponse } from '@/utils';
import { CreditCardAssessmentJoiSchema } from '@/models';

// Validator for creating a new credit card assessment
export function validateCreateCreditAssessment(req: Request, res: Response, next: NextFunction) {
    const { error } = CreditCardAssessmentJoiSchema.validate({ ...req.body, documents: req.files });
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}

// Validator for reading a credit card assessment by ID
export function validateReadCreditAssessment(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}

// Validator for updating an existing credit card assessment
export function validateUpdateCreditAssessment(req: Request, res: Response, next: NextFunction) {
    const requestData = { ...req.body, documents: req.files };
    const { error } = CreditCardAssessmentJoiSchema.validate(requestData, { presence: 'optional' });
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}

// Validator for deleting a credit card assessment by ID
export function validateDeleteCreditAssessment(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}
