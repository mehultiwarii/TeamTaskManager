import Task from '../models/Task';
import ProjectMember from '../models/ProjectMember';

export const createTask = async (taskData: any) => {
    return await Task.create(taskData);
};

export const getProjectTasks = async (userId: string, projectId: string) => {
    const membership = await ProjectMember.findOne({ userId, projectId });
    if (!membership) throw new Error('Forbidden: Not a project member');

    return await Task.find({ projectId }).populate('assignedTo', 'name email');
};

export const updateTask = async (userId: string, taskId: string, updateData: any) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    const membership = await ProjectMember.findOne({ userId, projectId: task.projectId });
    if (!membership) throw new Error('Forbidden: Not a project member');

    if (membership.role === 'Member' && task.assignedTo.toString() !== userId) {
        throw new Error('Members can only update their own tasks');
    }

    return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
};

export const deleteTask = async (taskId: string) => {
    return await Task.findByIdAndDelete(taskId);
};

export const getUserTasks = async (userId: string) => {
    const memberships = await ProjectMember.find({ userId });
    const projectIds = memberships.map(m => m.projectId);
    return await Task.find({ projectId: { $in: projectIds } }).populate('projectId', 'name').populate('assignedTo', 'name');
};
