import express from 'express';

import { creditAssessmentController } from '@/api/controllers';
import { creditAssessmentValidators } from '@/api/middleware/validators';
import multer from '@/api/middleware/multer';

const folderName = 'credit-card-assessment';

const router = express.Router();
const upload = multer(folderName);

const {
    createCreditCardAssessment,
    getAllCreditCardAssessments,
    getCreditCardAssessmentById,
    updateCreditCardAssessment,
    deleteCreditCardAssessment,
} = creditAssessmentController;
const {
    validateCreateCreditAssessment,
    validateReadCreditAssessment,
    validateUpdateCreditAssessment,
    validateDeleteCreditAssessment,
} = creditAssessmentValidators;

// Create a new Credit Card Assessment
router.post('/', upload.any(), validateCreateCreditAssessment, createCreditCardAssessment);

// Update a Credit Card Assessment by ID
router.put('/:id', upload.any(), validateUpdateCreditAssessment, updateCreditCardAssessment);

// Get all Credit Card Assessments
router.get('/', getAllCreditCardAssessments);

// Get a single Credit Card Assessment by ID
router.get('/:id', validateReadCreditAssessment, getCreditCardAssessmentById);

// Delete a Credit Card Assessment by ID
router.delete('/:id', validateDeleteCreditAssessment, deleteCreditCardAssessment);

export default router;
