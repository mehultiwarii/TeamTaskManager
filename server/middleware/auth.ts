import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string; role: string };
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.userRole !== 'admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
}
