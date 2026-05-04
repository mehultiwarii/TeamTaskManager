import Task from '../models/Task';
import Project from '../models/Project';

export const createTask = async (data: any) => {
    const project = await Project.findById(data.projectId);
    if (!project) throw new Error('Project not found');

    const task = await Task.create({
        ...data,
        history: [{ status: 'Todo', description: 'Task created and linked to project', timestamp: new Date() }]
    });
    return task;
};

export const getTasksByProject = async (projectId: string) => {
    return await Task.find({ projectId }).populate('assignedTo', 'name');
};

export const getUserTasks = async (userId: string) => {
    return await Task.find({ assignedTo: userId }).populate('projectId', 'name').sort({ updatedAt: -1 });
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
    return await Task.find().populate('projectId assignedTo');
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

    return await Task.find(query).populate('projectId', 'name').sort({ updatedAt: -1 });
};
