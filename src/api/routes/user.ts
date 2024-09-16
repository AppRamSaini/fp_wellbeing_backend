import express from 'express';
import authenticateToken from '@/api/middleware/auth';
import { userController } from '@/api/controllers';
import { userValidators } from '@/api/middleware/validators';

const router = express.Router();

router.use(authenticateToken);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userValidators.validateUpdateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
