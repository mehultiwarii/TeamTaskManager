import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeProject } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.patch('/:id', authorizeProject(['Admin']), projectController.updateProject);
router.delete('/:id', authorizeProject(['Admin']), projectController.deleteProject);

router.post('/:id/members', authorizeProject(['Admin']), projectController.addMember);
router.delete('/:id/members/:userId', authorizeProject(['Admin']), projectController.removeMember);

export default router;
