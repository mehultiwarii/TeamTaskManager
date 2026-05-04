import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', taskController.getTasks);
router.get('/status', taskController.getMemberStatus);
router.get('/user/:userId', authorize(['Admin']), taskController.getUserTasks);
router.get('/project/:id', taskController.getProjectTasks);
router.post('/', authorize(['Admin']), taskController.createTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', authorize(['Admin']), taskController.deleteTask);

export default router;
