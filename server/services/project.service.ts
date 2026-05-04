import Project from '../models/Project';
import ProjectMember from '../models/ProjectMember';
import mongoose from 'mongoose';

export const createProject = async (userId: string, projectData: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const project = await Project.create([{ ...projectData, createdBy: userId }], { session });
        await ProjectMember.create([{ userId, projectId: project[0]._id, role: 'Admin' }], { session });
        await session.commitTransaction();
        return project[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getUserProjects = async (userId: string) => {
    const memberships = await ProjectMember.find({ userId }).populate('projectId');
    return memberships.map(m => m.projectId);
};

export const updateProject = async (projectId: string, updateData: any) => {
    return await Project.findByIdAndUpdate(projectId, updateData, { new: true });
};

export const deleteProject = async (projectId: string) => {
    await Project.findByIdAndDelete(projectId);
    await ProjectMember.deleteMany({ projectId });
};

export const addMember = async (projectId: string, memberData: any) => {
    const { userId, role } = memberData;
    return await ProjectMember.create({ userId, projectId, role });
};

export const removeMember = async (projectId: string, userId: string) => {
    return await ProjectMember.findOneAndDelete({ projectId, userId });
};
