import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

router.post('/register', async (req, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }
        const user = new User({ name, email, password, role: role || 'member' });
        await user.save();
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        res.status(201).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const valid = await user.comparePassword(password);
        if (!valid) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', async (req, res: Response) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;
