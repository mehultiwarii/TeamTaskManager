import Project from '../models/Project';
import ProjectMember from '../models/ProjectMember';
import mongoose from 'mongoose';

export const createProject = async (userId: string, data: any) => {
    return await Project.create({ ...data, createdBy: userId });
};

export const getProjects = async () => {
    return await Project.find().populate('createdBy', 'name');
};

export const deleteProject = async (id: string) => {
    await Project.findByIdAndDelete(id);
    await ProjectMember.deleteMany({ projectId: id });
};

export const addMember = async (projectId: string, data: any) => {
    return await ProjectMember.create({ projectId, ...data });
};

export const removeMember = async (projectId: string, userId: string) => {
    return await ProjectMember.findOneAndDelete({ projectId, userId });
};
