import { createTransport } from 'nodemailer';
import { Request, Response } from 'express';
import { config } from '@/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporterConfig: SMTPTransport.Options = {
    service: 'gmail',
    auth: {
        user: config.env.EMAIL_USER,
        pass: config.env.EMAIL_PASS,
    },
};

export default async (
    email: string,
    confirmCode: number,
    type: string,
    req: Request,
    res: Response,
    firstName?: string,
) => {
    return new Promise((resolve, reject) => {
        console.log('email', email);
        console.log('confirmCode', confirmCode);

        if (!email || !confirmCode) {
            return res
                .status(500)
                .send({ error: { message: 'Internal Server Error' } })
                .end();
        }

        const emailTransfer = createTransport(transporterConfig);

        let body = '';
        let subject = '';

        if (type == 'register') {
            subject = 'Verify Your Registration - WellBeing';
            body = `\nThank you for registering with WellBeing! \n\nTo complete your registration, please verify your email address by entering the following verification code in the registration form: \n\nVerification Code: ${confirmCode} \n\nIf you did not register with us or if you have any questions, please disregard this email or contact our support team at ${config.env.EMAIL_USER}. \n\nThank you for choosing WellBeing! \n\n\nBest regards,\nThe WellBeing Team`;
        } else {
            subject = 'Reset Your Password - WellBeing';
            body = `Hi ${firstName}, \n\nWe received a request to reset the password for your WellBeing account. \n\nTo proceed with resetting your password, please enter the following verification code: \n\nVerification Code: ${confirmCode}  \n\nIf you did not request a password reset or if you believe this was a mistake, please ignore this email or contact our support team at ${config.env.EMAIL_USER}. \n\nFor additional assistance, don't hesitate to reach out. \n\n\nBest regards,\nThe WellBeing Team`;
        }

        const emailInfo = {
            from: `WellBeing Support <${config.env.EMAIL_USER}>`,
            to: email,
            subject,
            text: body,
        };

        emailTransfer.sendMail(emailInfo, (err, info) => {
            if (err) {
                console.log(`Error: ${err}`);
                reject(err);
            } else {
                console.log(`Response: ${JSON.stringify(info)}`);
                resolve('Success');
            }
        });
    });
};
