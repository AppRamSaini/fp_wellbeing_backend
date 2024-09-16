import Joi from 'joi';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './.env.local' });

if (!fs.existsSync('./.env.local')) {
    console.warn('.env.local file not found. Falling back to default environment variables.');
}

const schema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(1).required(),
    EMAIL_USER: Joi.string().required(),
    EMAIL_PASS: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_BUCKET_NAME: Joi.string().required(),
});

const { error, value: envVars } = schema.validate(process.env, { allowUnknown: true, abortEarly: false });

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = { env: envVars };
