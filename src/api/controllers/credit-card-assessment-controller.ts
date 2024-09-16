import { Request, Response } from 'express';

import { CreditCardAssessment } from '@/models';
import { sendSuccessResponse, sendErrorResponse, ApiError } from '@/utils';
import { deleteFile } from '@/api/services/s3.service';

const bucketFolder = '/mortgage-assessment';

// Create a new Credit Card Assessment
export const createCreditCardAssessment = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.MulterS3.File[];

        const uploadedDocuments = files.map(file => ({
            key: file.key,
            name: file.originalname,
            url: file.location,
            type: file.mimetype,
        }));

        const creditCardAssessment = new CreditCardAssessment({
            ...req.body,
            documents: uploadedDocuments,
        });

        const savedAssessment = await creditCardAssessment.save();

        sendSuccessResponse(res, 201, 'Credit Card Assessment created', savedAssessment);
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Get all Credit Card Assessments
export const getAllCreditCardAssessments = async (req: Request, res: Response) => {
    try {
        const assessments = await CreditCardAssessment.find();

        if (assessments.length === 0) {
            throw new ApiError(404, 'No Credit Card Assessments found');
        }

        sendSuccessResponse(res, 200, 'Credit Card Assessments retrieved', assessments);
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Get a single Credit Card Assessment by ID
export const getCreditCardAssessmentById = async (req: Request, res: Response) => {
    try {
        const assessment = await CreditCardAssessment.findById(req.params.id);
        if (assessment == null) {
            throw new ApiError(404, 'Credit Card Assessment not found');
        }

        sendSuccessResponse(res, 200, 'Credit Card Assessment retrieved', assessment);
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Update a Credit Card Assessment by ID
export const updateCreditCardAssessment = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.MulterS3.File[];

        const existingAssessment = await CreditCardAssessment.findById(req.params.id);
        if (!existingAssessment) {
            throw new ApiError(404, 'Credit Card Assessment not found');
        }

        if (files?.length) {
            if (existingAssessment.documents?.length) {
                existingAssessment.documents.forEach(file => {
                    deleteFile(file.key);
                });
            }

            req.body.documents = files.map(file => ({
                key: file.key,
                name: file.originalname,
                url: file.location,
                type: file.mimetype,
            }));
        }

        existingAssessment.set(req.body);
        const updatedAssessment = await existingAssessment.save();

        sendSuccessResponse(res, 200, 'Credit Card Assessment updated', updatedAssessment);
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Delete a Credit Card Assessment by ID
export const deleteCreditCardAssessment = async (req: Request, res: Response) => {
    try {
        const deletedAssessment = await CreditCardAssessment.findByIdAndDelete(req.params.id);

        if (deletedAssessment == null) {
            throw new ApiError(404, 'Credit Card Assessment not found');
        }

        sendSuccessResponse(res, 200, 'Credit Card Assessment deleted');
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};
