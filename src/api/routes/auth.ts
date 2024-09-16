import express from 'express';

import { authValidators } from '@/api/middleware/validators';
import { authController } from '@/api/controllers';

const router = express.Router();

router.post('/get-register-otp', authValidators.validateGetRegisterOtp, authController.getOtp);
router.post('/register', authValidators.validateRegister, authController.register);
router.post('/login', authValidators.validateLogin, authController.login);
router.post('/forgot-password', authValidators.validateGetRegisterOtp, authController.forgotPassword);
router.post('/verify-otp', authValidators.validateVerifyOtp, authController.verifyOtp);
router.post('/change-password', authValidators.validateChangePass, authController.changePassword);

export default router;
