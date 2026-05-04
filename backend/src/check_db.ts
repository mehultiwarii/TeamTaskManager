import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project';
import Task from './models/Task';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        const pCount = await Project.countDocuments();
        const tCount = await Task.countDocuments();
        console.log(`Projects: ${pCount}`);
        const projects = await Project.find();
        console.log(JSON.stringify(projects, null, 2));
        console.log(`Tasks: ${tCount}`);
        const tasks = await Task.find();
        console.log(JSON.stringify(tasks, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
