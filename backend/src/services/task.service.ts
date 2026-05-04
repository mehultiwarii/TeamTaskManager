import Task, { ITask } from '../models/Task';
import Project from '../models/Project';

export const createTask = async (data: any): Promise<ITask> => {
    const project = await Project.findById(data.projectId);
    if (!project) throw new Error('Project not found');

    const task = await Task.create({
        ...data,
        history: [{ status: 'Todo', description: 'Task created and linked to project', timestamp: new Date() }]
    });
    return task as ITask;
};

export const getTasksByProject = async (projectId: string) => {
    const tasks = await Task.find({ projectId }).populate('assignedTo', 'name');
    const now = new Date();
    return tasks.map(task => {
        const t: any = task.toObject();
        if (t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now) {
            t.status = 'Overdue';
        }
        return t;
    });
};

export const getUserTasks = async (userId: string) => {
    const tasks = await Task.find({ assignedTo: userId }).populate('projectId', 'name').sort({ updatedAt: -1 });
    const now = new Date();
    return tasks.map(task => {
        const t: any = task.toObject();
        if (t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now) {
            t.status = 'Overdue';
        }
        return t;
    });
};

export const updateTaskStatus = async (userId: string, taskId: string, status: string) => {
    const historyEntry = {
        status,
        timestamp: new Date(),
        description: `Status updated to ${status}`
    };
    return await Task.findByIdAndUpdate(
        taskId,
        { $set: { status, assignedTo: userId }, $push: { history: historyEntry } },
        { new: true }
    ).populate('projectId assignedTo');
};

export const getAllTasks = async () => {
    const tasks = await Task.find().populate('projectId assignedTo');
    const now = new Date();
    return tasks.map(task => {
        const t: any = task.toObject();
        if (t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now) {
            t.status = 'Overdue';
        }
        return t;
    });
};

export const deleteTask = async (taskId: string) => {
    return await Task.findByIdAndDelete(taskId);
};

export const getMemberStatusTasks = async (userId: string, filter: string) => {
    const query: any = { assignedTo: userId };
    const now = new Date();

    if (filter === 'Ongoing') {
        query.status = { $ne: 'Completed' };
        query.$or = [
            { dueDate: { $gt: now } },
            { dueDate: { $exists: false } }
        ];
    } else if (filter === 'Completed') {
        query.status = 'Completed';
    } else if (filter === 'Overdue') {
        query.status = { $ne: 'Completed' };
        query.dueDate = { $lt: now };
    }

    const tasks = await Task.find(query).populate('projectId', 'name').sort({ updatedAt: -1 });
    return tasks.map(task => {
        const t: any = task.toObject();
        if (t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now) {
            t.status = 'Overdue';
        }
        return t;
    });
};
