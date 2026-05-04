import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeProject } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizeProject(['Admin', 'Member']), taskController.createTask);
router.get('/project/:id', authorizeProject(['Admin', 'Member']), taskController.getProjectTasks);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
