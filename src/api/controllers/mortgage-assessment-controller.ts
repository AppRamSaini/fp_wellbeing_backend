import { Request, Response } from 'express';

import { MortgageAssessment } from '@/models';
import { sendSuccessResponse, sendErrorResponse, ApiError } from '@/utils';
import { deleteFile } from '@/api/services/s3.service';

// Create a new Mortgage Assessment
export const createMortgageAssessment = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.MulterS3.File[];

        const uploadedDocuments = files.map(file => ({
            key: file.key,
            name: file.originalname,
            url: file.location,
            type: file.mimetype,
        }));

        const mortgageAssessment = new MortgageAssessment({
            ...req.body,
            documents: uploadedDocuments,
        });

        const savedAssessment = await mortgageAssessment.save();

        sendSuccessResponse(res, 201, 'Mortgage Assessment created', savedAssessment);
    } catch (err) {
        console.log('err', err);
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Get all Mortgage Assessments
export const getAllMortgageAssessments = async (req: Request, res: Response) => {
    try {
        const assessments = await MortgageAssessment.find();

        if (assessments.length === 0) {
            throw new ApiError(404, 'No Mortgage Assessments found');
        }

        sendSuccessResponse(res, 200, 'Mortgage Assessments retrieved', assessments);
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Get a single Mortgage Assessment by ID
export const getMortgageAssessmentById = async (req: Request, res: Response) => {
    try {
        const assessment = await MortgageAssessment.findById(req.params.id);
        if (assessment == null) {
            throw new ApiError(404, 'Mortgage Assessment not found');
        }

        sendSuccessResponse(res, 200, 'Mortgage Assessment retrieved', assessment);
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Update a Mortgage Assessment by ID
export const updateMortgageAssessment = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.MulterS3.File[];

        const existingAssessment = await MortgageAssessment.findById(req.params.id);
        if (!existingAssessment) {
            throw new ApiError(404, 'Mortgage Assessment not found');
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

        sendSuccessResponse(res, 200, 'Mortgage Assessment updated', updatedAssessment);
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};

// Delete a Mortgage Assessment by ID
export const deleteMortgageAssessment = async (req: Request, res: Response) => {
    try {
        const deletedAssessment = await MortgageAssessment.findByIdAndDelete(req.params.id);

        if (deletedAssessment == null) {
            throw new ApiError(404, 'Mortgage Assessment not found');
        }
        sendSuccessResponse(res, 200, 'Mortgage Assessment deleted');
    } catch (err) {
        if (err instanceof ApiError) {
            sendErrorResponse(res, err.statusCode, err.message, err);
        } else {
            sendErrorResponse(res, 500, 'An unknown error occurred.');
        }
    }
};
