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
        const tasks = await taskService.getTasksByProject(req.params.id);
        res.json(tasks);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const task = await taskService.updateTaskStatus(userId, req.params.id, req.body.status);
        res.json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.json(tasks);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getMemberStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const filter = req.query.filter as string;
        const tasks = await taskService.getMemberStatusTasks(userId, filter);
        res.json(tasks);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await taskService.getUserTasks(req.params.userId);
        res.json(tasks);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
