import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import ProjectMember from '../models/ProjectMember';

export const authorizeProject = (roles: ('Admin' | 'Member')[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const projectId = req.params.id || req.body.projectId;

        if (!userId || !projectId) {
            return res.status(400).json({ message: 'User or Project identification missing' });
        }

        try {
            const membership = await ProjectMember.findOne({ userId, projectId });

            if (!membership || !roles.includes(membership.role)) {
                return res.status(403).json({ message: 'Access denied. Sufficient privileges required.' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Authorization error' });
        }
    };
};
