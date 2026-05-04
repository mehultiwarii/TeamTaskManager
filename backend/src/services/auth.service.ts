import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const signup = async (data: any) => {
    const { name, email, password, role } = data;
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || 'Member' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET!);
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

export const login = async (data: any) => {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid');

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET!);
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};
