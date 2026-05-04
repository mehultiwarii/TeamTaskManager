import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const signup = async (userData: Partial<IUser>) => {
    const { email, password, name } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password!, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return { user: { id: user._id, name: user.name, email: user.email }, token };
};

export const login = async (credentials: any) => {
    const { email, password } = credentials;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return { user: { id: user._id, name: user.name, email: user.email }, token };
};
