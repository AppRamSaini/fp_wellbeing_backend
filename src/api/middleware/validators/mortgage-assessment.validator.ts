import Joi from 'joi';
import { sendErrorResponse } from '@/utils';
import { Request, Response, NextFunction } from 'express';
import { MortgageAssessmentJoiSchema } from '@/models';

// Validator for creating a new mortgage assessment
export function validateCreateMortgageAssessment(req: Request, res: Response, next: NextFunction) {
    const { error } = MortgageAssessmentJoiSchema.validate({ ...req.body, documents: req.files });
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}

// Validator for reading a mortgage assessment by ID
export function validateReadMortgageAssessment(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}

// Validator for updating an existing mortgage assessment
export function validateUpdateMortgageAssessment(req: Request, res: Response, next: NextFunction) {
    const requestData = { ...req.body, documents: req.files };
    const { error } = MortgageAssessmentJoiSchema.validate(requestData, { presence: 'optional' });
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}

// Validator for deleting a mortgage assessment by ID
export function validateDeleteMortgageAssessment(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return sendErrorResponse(res, 400, error.details[0].message);
    }
    next();
}
