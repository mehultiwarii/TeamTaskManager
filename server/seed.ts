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

        const hashedPW = await bcrypt.hash('admin123', 10);
        const memberPW = await bcrypt.hash('member123', 10);

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@promanage.com',
            password: hashedPW,
            role: 'Admin'
        });

        const member = await User.create({
            name: 'John Member',
            email: 'member@promanage.com',
            password: memberPW,
            role: 'Member'
        });

        const p1 = await Project.create({
            name: 'NextGen AI Platform',
            description: 'Building the future of agentic AI coding assistants with deep integration.',
            createdBy: admin._id
        });

        const p2 = await Project.create({
            name: 'Cloud Infrastructure 2.0',
            description: 'Scaling our global cluster to handle 100M+ requests per second.',
            createdBy: admin._id
        });

        await Task.create([
            {
                title: 'Design Neural Engine',
                description: 'Draft the initial architecture for the LLM processing pipeline.',
                projectId: p1._id,
                status: 'Todo',
                history: [{ status: 'Todo', description: 'Task initialized', timestamp: new Date() }]
            },
            {
                title: 'API Gateway Security',
                description: 'Implement OAuth2 and rate limiting for the edge endpoints.',
                projectId: p2._id,
                status: 'In Progress',
                assignedTo: member._id,
                history: [{ status: 'In Progress', description: 'Task started by member', timestamp: new Date() }]
            },
            {
                title: 'Kubernetes Cluster Setup',
                description: 'Deploy the production-ready K8s cluster across 3 regions.',
                projectId: p2._id,
                status: 'Todo',
                history: [{ status: 'Todo', description: 'Task created', timestamp: new Date() }]
            }
        ]);

        console.log('Database seeded successfully.');
        console.log('Admin: admin@promanage.com / admin123');
        console.log('Member: member@promanage.com / member123');
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
