import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', authenticate, authorize(['Admin']), authController.getUsers);
router.delete('/users/:id', authenticate, authorize(['Admin']), authController.deleteUser);

export default router;
