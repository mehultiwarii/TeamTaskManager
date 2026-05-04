import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectMember extends Document {
    userId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    role: 'Admin' | 'Member';
}

const ProjectMemberSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    role: { type: String, enum: ['Admin', 'Member'], required: true }
}, { timestamps: true });

ProjectMemberSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export default mongoose.model<IProjectMember>('ProjectMember', ProjectMemberSchema);
