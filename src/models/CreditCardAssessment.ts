import Joi from 'joi';
import mongoose, { Document } from 'mongoose';

export interface IFile extends Document {
    key: string;
    name: string;
    url: string;
    type: string;
}

export interface ICreditCardAssessment extends Document {
    institution: string;
    program_name: string;
    card_limit: number;
    remaining_balance: number;
    remaining_term: number;
    annual_fee: number;
    interest_rate: number;
    points_earned_per_dollar_spent: number;
    preference_travel_points: string;
    preference_annual_fee: number;
    preference_prestige: number;
    preference_other_rewards?: string;
    preference_points_per_dollar_spent: number;
    documents: IFile[];
    created_at: Date;
}

export const CreditCardAssessmentJoiSchema = Joi.object({
    institution: Joi.string().min(1).required(),
    program_name: Joi.string().min(1).required(),
    card_limit: Joi.number().min(0).required(),
    remaining_balance: Joi.number().min(0).required(),
    remaining_term: Joi.number().min(0).required(),
    annual_fee: Joi.number().min(0).required(),
    interest_rate: Joi.number().min(0).required(),
    points_earned_per_dollar_spent: Joi.number().min(0).required(),
    preference_travel_points: Joi.string().min(1).required(),
    preference_annual_fee: Joi.number().min(0).required(),
    preference_prestige: Joi.number().min(0).required(),
    preference_other_rewards: Joi.string().allow(null, '').optional(),
    preference_points_per_dollar_spent: Joi.number().min(0).required(),
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
    url: String,
    type: String,
});

const CreditCardAssessmentSchema = new mongoose.Schema({
    documents: [FileSchema],
    institution: { type: String, required: true },
    program_name: { type: String, required: true },
    card_limit: { type: Number, required: true },
    remaining_balance: { type: Number, required: true },
    remaining_term: { type: Number, required: true },
    annual_fee: { type: Number, required: true },
    interest_rate: { type: Number, required: true },
    points_earned_per_dollar_spent: { type: Number, required: true },

    // Personal Preferences fields with "preference" prefix
    preference_travel_points: { type: String, required: true },
    preference_annual_fee: { type: Number, required: true },
    preference_prestige: { type: Number, required: true },
    preference_other_rewards: { type: String, required: false },
    preference_points_per_dollar_spent: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
});

export const CreditCardAssessment = mongoose.model<ICreditCardAssessment>(
    'CreditCardAssessment',
    CreditCardAssessmentSchema,
    'credit_card_assessments',
);
