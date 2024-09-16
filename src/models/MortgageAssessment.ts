import Joi from 'joi';
import mongoose, { Document } from 'mongoose';

export interface IFile extends Document {
    name: string;
    key: string;
    url: string;
    type: string;
}

export interface IMortgageAssessment extends Document {
    mortgage_institution: string;
    remaining_mortgage_balance: number;
    open_or_closed: string;
    remaining_mortgage_term: number;
    fixed_or_variable: string;
    current_interest_rate: number;
    remaining_amortization_period: number;
    approximate_fees_to_break_mortgage: number;
    credit_score: number;
    currently_employed: boolean;
    reported_annual_household_income: number;
    approximate_value_of_home: number;
    consent_to_estimate_value: boolean;
    documents: IFile[];
    created_at: Date;
}

export const MortgageAssessmentJoiSchema = Joi.object({
    mortgage_institution: Joi.string().min(1).required(),
    remaining_mortgage_balance: Joi.number().min(0).required(),
    open_or_closed: Joi.string().valid('open', 'closed').required(),
    remaining_mortgage_term: Joi.number().min(0).required(),
    fixed_or_variable: Joi.string().valid('fixed', 'variable').required(),
    current_interest_rate: Joi.number().min(0).required(),
    remaining_amortization_period: Joi.number().min(0).required(),
    approximate_fees_to_break_mortgage: Joi.number().min(0).required(),
    credit_score: Joi.number().min(0).max(850).required(),
    currently_employed: Joi.boolean().required(),
    reported_annual_household_income: Joi.number().min(0).required(),
    approximate_value_of_home: Joi.number().min(0).required(),
    consent_to_estimate_value: Joi.boolean().required(),
    documents: Joi.array()
        .items(
            Joi.alternatives().try(
                Joi.object<IFile>(),
                Joi.object({
                    buffer: Joi.binary().required(),
                    type: Joi.string().required(),
                    originalname: Joi.string().required(),
                    size: Joi.number().required(),
                }),
            ),
        )
        .max(10)
        .required(),
    created_at: Joi.date().optional(),
});

const FileSchema = new mongoose.Schema({
    key: String,
    name: String,
    file_name: String,
    url: String,
    type: String,
});

const MortgageAssessmentSchema = new mongoose.Schema({
    documents: [FileSchema],
    mortgage_institution: {
        type: String,
        required: true,
    },
    remaining_mortgage_balance: {
        type: Number,
        required: true,
    },
    open_or_closed: {
        type: String,
        enum: ['open', 'closed'],
        required: true,
    },
    remaining_mortgage_term: {
        type: Number,
        required: true,
    },
    fixed_or_variable: {
        type: String,
        enum: ['fixed', 'variable'],
        required: true,
    },
    current_interest_rate: {
        type: Number,
        required: true,
    },
    remaining_amortization_period: {
        type: Number,
        required: true,
    },
    approximate_fees_to_break_mortgage: {
        type: Number,
        required: true,
    },
    credit_score: {
        type: Number,
        required: true,
        min: 0,
        max: 850,
    },
    currently_employed: {
        type: Boolean,
        required: true,
    },
    reported_annual_household_income: {
        type: Number,
        required: true,
    },
    approximate_value_of_home: {
        type: Number,
        required: true,
    },
    consent_to_estimate_value: {
        type: Boolean,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export const MortgageAssessment = mongoose.model<IMortgageAssessment>(
    'MortgageAssessment',
    MortgageAssessmentSchema,
    'mortgage_assessments',
);
