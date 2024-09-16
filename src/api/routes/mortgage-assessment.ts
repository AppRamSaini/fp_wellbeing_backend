import express from 'express';

import { mortgageAssessmentController } from '@/api/controllers';
import { mortgageAssessmentValidators } from '@/api/middleware/validators';
import multer from '@/api/middleware/multer';

const folderName = 'mortgage-assessment';

const router = express.Router();
const upload = multer(folderName);

const {
    validateCreateMortgageAssessment,
    validateReadMortgageAssessment,
    validateUpdateMortgageAssessment,
    validateDeleteMortgageAssessment,
} = mortgageAssessmentValidators;
const {
    createMortgageAssessment,
    getAllMortgageAssessments,
    getMortgageAssessmentById,
    updateMortgageAssessment,
    deleteMortgageAssessment,
} = mortgageAssessmentController;

// Create a new Mortgage Assessment
router.post('/', upload.any(), validateCreateMortgageAssessment, createMortgageAssessment);

// Update a Mortgage Assessment by ID
router.put('/:id', upload.any(), validateUpdateMortgageAssessment, updateMortgageAssessment);

// Get all Mortgage Assessments
router.get('/', getAllMortgageAssessments);

// Get a single Mortgage Assessment by ID
router.get('/:id', validateReadMortgageAssessment, getMortgageAssessmentById);

// Delete a Mortgage Assessment by ID
router.delete('/:id', validateDeleteMortgageAssessment, deleteMortgageAssessment);

export default router;
