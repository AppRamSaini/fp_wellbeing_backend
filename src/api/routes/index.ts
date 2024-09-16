import express from 'express';
import auth from './auth';
import user from './user';
import mortgageAssessment from './mortgage-assessment';
import creditCardAssessment from './credit-card-assessment';

const router = express.Router();
router.use('/auth', auth);
router.use('/users', user);
router.use('/mortgage-assessment', mortgageAssessment);
router.use('/credit-card-assessment', creditCardAssessment);

export default router;
