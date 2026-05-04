import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Project from './models/Project';
import ProjectMember from './models/ProjectMember';
import Task from './models/Task';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/promanage');
        
        await User.deleteMany({});
        await Project.deleteMany({});
        await ProjectMember.deleteMany({});
        await Task.deleteMany({});

        const hashedPassword = await bcrypt.hash('adminpassword123', 10);
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@promanage.com',
            password: hashedPassword
        });

        const project = await Project.create({
            name: 'Initial Workspace Architecture',
            description: 'The foundation project for setting up ProManage systems and security protocols.',
            createdBy: admin._id
        });

        await ProjectMember.create({
            userId: admin._id,
            projectId: project._id,
            role: 'Admin'
        });

        await Task.create({
            title: 'Audit Data Isolation Logic',
            description: 'Verify that the new service-level filtering is correctly isolating user data.',
            projectId: project._id,
            assignedTo: admin._id,
            status: 'todo',
            dueDate: new Date()
        });

        console.log('Database seeded successfully');
        console.log('Admin Email: admin@promanage.com');
        console.log('Admin Password: adminpassword123');
        
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
