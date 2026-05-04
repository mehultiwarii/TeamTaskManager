import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog {
    status: string;
    timestamp: Date;
    description: string;
}

export interface ITask extends Document {
    title: string;
    description: string;
    projectId: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    status: 'Todo' | 'In Progress' | 'Completed' | 'Overdue';
    dueDate?: Date;
    history: IActivityLog[];
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Todo', 'In Progress', 'Completed', 'Overdue'], default: 'Todo' },
    dueDate: { type: Date },
    history: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        description: String
    }]
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
