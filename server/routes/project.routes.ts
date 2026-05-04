import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', projectController.getProjects);
router.post('/', authorize(['Admin']), projectController.createProject);
router.delete('/:id', authorize(['Admin']), projectController.deleteProject);

router.post('/:id/members', authorize(['Admin']), projectController.addMember);
router.delete('/:id/members/:userId', authorize(['Admin']), projectController.removeMember);

export default router;
