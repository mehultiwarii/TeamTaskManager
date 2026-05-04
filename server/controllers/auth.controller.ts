import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const signup = async (req: Request, res: Response) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
