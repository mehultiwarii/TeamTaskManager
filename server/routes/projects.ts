import { Router, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.userId }, { members: req.userId }]
        }).populate('owner', 'name email').populate('members', 'name email');
        res.json(projects);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, status, icon, dueDate } = req.body;
        const project = new Project({
            name,
            description,
            status: status || 'active',
            icon: icon || 'analytics',
            dueDate,
            owner: req.userId,
            members: [req.userId]
        });
        await project.save();
        await project.populate('owner', 'name email');
        res.status(201).json(project);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { members: req.userId }]
        }).populate('owner', 'name email').populate('members', 'name email');
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.json(project);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
        if (!project) {
            res.status(404).json({ message: 'Project not found or not authorized' });
            return;
        }
        const { name, description, status, icon, dueDate, progress } = req.body;
        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (status !== undefined) project.status = status;
        if (icon !== undefined) project.icon = icon;
        if (dueDate !== undefined) project.dueDate = dueDate;
        if (progress !== undefined) project.progress = progress;
        await project.save();
        res.json(project);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId });
        if (!project) {
            res.status(404).json({ message: 'Project not found or not authorized' });
            return;
        }
        await Task.deleteMany({ project: req.params.id });
        res.json({ message: 'Project deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:id/members', async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
        if (!project) {
            res.status(404).json({ message: 'Project not found or not authorized' });
            return;
        }
        const { userId } = req.body;
        if (!project.members.includes(userId)) {
            project.members.push(userId);
            await project.save();
        }
        await project.populate('members', 'name email');
        res.json(project);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
