import { Router, Response } from 'express';
import User from '../models/User';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/search', async (req: AuthRequest, res: Response) => {
    try {
        const { q } = req.query;
        const users = await User.find({
            $or: [
                { name: { $regex: q as string, $options: 'i' } },
                { email: { $regex: q as string, $options: 'i' } }
            ]
        }).select('-password').limit(10);
        res.json(users);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id/role', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { role } = req.body;
        if (!['admin', 'member'].includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/password', async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const valid = await user.comparePassword(currentPassword);
        if (!valid) {
            res.status(400).json({ message: 'Current password is incorrect' });
            return;
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
