import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    projectId: { _id: string; name: string };
    assignedTo: { _id: string; name: string };
}

export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateTaskStatus = async (taskId: string, status: string) => {
        try {
            await api.patch(`/tasks/${taskId}`, { status });
            fetchTasks();
        } catch (error) {}
    };

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 w-full z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
                <span className="text-xl font-bold text-slate-900">ProManage</span>
                <span className="text-body-sm font-medium text-slate-600">{user?.name}</span>
            </header>

            <div className="flex pt-16 h-screen overflow-hidden">
                <Sidebar activePage="tasks" />
                <main className="flex-1 overflow-y-auto p-8">
                    <header className="mb-8">
                        <h1 className="text-h1 font-h1">My Tasks</h1>
                        <p className="text-body-md text-on-surface-variant">All tasks across your projects.</p>
                    </header>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-bold text-slate-700">Task</th>
                                    <th className="p-4 font-bold text-slate-700">Project</th>
                                    <th className="p-4 font-bold text-slate-700">Status</th>
                                    <th className="p-4 font-bold text-slate-700">Assigned To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{task.title}</p>
                                            <p className="text-xs text-slate-500">{task.description}</p>
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">{task.projectId?.name}</td>
                                        <td className="p-4">
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-white"
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="done">Done</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-slate-600">{task.assignedTo?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
