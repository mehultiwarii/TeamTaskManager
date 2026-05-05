import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Strict Railway PORT validation and 0.0.0.0 binding
const PORT = process.env.PORT;
if (!PORT) {
    console.error("CRITICAL: process.env.PORT is missing. Railway deployment will fail.");
    process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("CRITICAL: MONGO_URI is missing. Database connection required.");
    process.exit(1);
}

// Bind to 0.0.0.0 to ensure the service is reachable from the public internet
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log("Server successfully bound to Railway PORT:", PORT);
});

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
