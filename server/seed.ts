import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Project from './models/Project';
import Task from './models/Task';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        
        await User.deleteMany({});
        await Project.deleteMany({});
        await Task.deleteMany({});

        const adminPassword = await bcrypt.hash('admin123', 10);
        const memberPassword = await bcrypt.hash('member123', 10);

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@promanage.com',
            password: adminPassword,
            role: 'Admin'
        });

        const member = await User.create({
            name: 'John Member',
            email: 'member@promanage.com',
            password: memberPassword,
            role: 'Member'
        });

        const project = await Project.create({
            name: 'Global Infrastructure Revamp',
            description: 'Major overhaul of the existing system architecture to support cloud scaling.',
            createdBy: admin._id
        });

        await Task.create({
            title: 'Audit Database Schema',
            description: 'Perform a full audit of all Mongoose models and indexes.',
            projectId: project._id,
            status: 'Todo',
            history: [{ status: 'Todo', description: 'Task created by admin', timestamp: new Date() }]
        });

        console.log('Database seeded with Admin and Member accounts.');
        console.log('Admin: admin@promanage.com / admin123');
        console.log('Member: member@promanage.com / member123');
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
