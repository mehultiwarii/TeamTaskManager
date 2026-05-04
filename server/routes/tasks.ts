import { Router, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/project/:projectId', async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findOne({
            _id: req.params.projectId,
            $or: [{ owner: req.userId }, { members: req.userId }]
        });
        if (!project) {
            res.status(404).json({ message: 'Project not found or access denied' });
            return;
        }
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignees', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/my', async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await Task.find({ assignees: req.userId })
            .populate('project', 'name')
            .populate('assignees', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status, priority, tag, dueDate, projectId, assignees } = req.body;
        const project = await Project.findOne({
            _id: projectId,
            $or: [{ owner: req.userId }, { members: req.userId }]
        });
        if (!project) {
            res.status(404).json({ message: 'Project not found or access denied' });
            return;
        }
        const task = new Task({
            title,
            description,
            status: status || 'todo',
            priority: priority || 'medium',
            tag: tag || 'General',
            dueDate,
            project: projectId,
            assignees: assignees || [],
            createdBy: req.userId
        });
        await task.save();
        await task.populate('assignees', 'name email');
        await task.populate('createdBy', 'name email');

        const total = await Task.countDocuments({ project: projectId });
        const done = await Task.countDocuments({ project: projectId, status: 'done' });
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        await Project.findByIdAndUpdate(projectId, { progress });

        res.status(201).json(task);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        const project = await Project.findOne({
            _id: task.project,
            $or: [{ owner: req.userId }, { members: req.userId }]
        });
        if (!project) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        const { title, description, status, priority, tag, dueDate, assignees } = req.body;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (tag !== undefined) task.tag = tag;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (assignees !== undefined) task.assignees = assignees;
        await task.save();

        const total = await Task.countDocuments({ project: task.project });
        const done = await Task.countDocuments({ project: task.project, status: 'done' });
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        await Project.findByIdAndUpdate(task.project, { progress });

        await task.populate('assignees', 'name email');
        res.json(task);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        const project = await Project.findOne({
            _id: task.project,
            $or: [{ owner: req.userId }, { members: req.userId }]
        });
        if (!project) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        const projectId = task.project;
        await task.deleteOne();

        const total = await Task.countDocuments({ project: projectId });
        const done = await Task.countDocuments({ project: projectId, status: 'done' });
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        await Project.findByIdAndUpdate(projectId, { progress });

        res.json({ message: 'Task deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
