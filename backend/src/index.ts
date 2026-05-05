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

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Production Environment Validation
if (!PORT || !MONGO_URI) {
    console.error("CRITICAL: Missing environment variables (PORT or MONGO_URI)");
    process.exit(1);
}

// Ensure database connection is established BEFORE starting the server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        // Start listening only after successful DB connection
        app.listen(Number(PORT), '0.0.0.0', () => {
            console.log("Server successfully started on Railway PORT:", PORT);
        });
    })
    .catch((err) => {
        console.error("CRITICAL: MongoDB connection error:", err);
        // Fail the process to notify Railway to retry/restart
        process.exit(1);
    });
