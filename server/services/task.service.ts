import Task from '../models/Task';
import ProjectMember from '../models/ProjectMember';

export const createTask = async (data: any) => {
    const task = await Task.create({
        ...data,
        history: [{ status: 'Todo', description: 'Task created by admin', timestamp: new Date() }]
    });
    return task;
};

export const updateTaskStatus = async (userId: string, taskId: string, status: string) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    const update: any = { status };
    const historyEntry = {
        status,
        timestamp: new Date(),
        description: `Task status updated to ${status} by user`
    };

    if (status === 'In Progress' && task.status === 'Todo') {
        historyEntry.description = 'Task started';
        update.assignedTo = userId;
    }

    return await Task.findByIdAndUpdate(
        taskId,
        { $set: update, $push: { history: historyEntry } },
        { new: true }
    ).populate('projectId assignedTo');
};

export const getMemberStatus = async (userId: string, filter?: string) => {
    const query: any = { assignedTo: userId };
    
    if (filter === 'Completed') query.status = 'Completed';
    if (filter === 'Ongoing') query.status = 'In Progress';
    if (filter === 'Overdue') {
        query.status = { $ne: 'Completed' };
        query.dueDate = { $lt: new Date() };
    }

    return await Task.find(query).populate('projectId').sort({ updatedAt: -1 });
};

export const getAllTasks = async () => {
    return await Task.find().populate('projectId assignedTo');
};

export const deleteTask = async (taskId: string) => {
    return await Task.findByIdAndDelete(taskId);
};
