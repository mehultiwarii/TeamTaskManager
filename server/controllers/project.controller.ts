import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as projectService from '../services/project.service';

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const project = await projectService.createProject(userId, req.body);
        res.status(201).json(project);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const projects = await projectService.getUserProjects(userId);
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.json(project);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        await projectService.deleteProject(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const addMember = async (req: AuthRequest, res: Response) => {
    try {
        const member = await projectService.addMember(req.params.id, req.body);
        res.status(201).json(member);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
    try {
        await projectService.removeMember(req.params.id, req.params.userId);
        res.json({ message: 'Member removed successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
