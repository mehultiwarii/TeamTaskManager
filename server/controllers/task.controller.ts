import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as taskService from '../services/task.service';

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getProjectTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const tasks = await taskService.getProjectTasks(userId, req.params.id);
        res.json(tasks);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const task = await taskService.updateTask(userId, req.params.id, req.body);
        res.json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const tasks = await taskService.getUserTasks(userId);
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
