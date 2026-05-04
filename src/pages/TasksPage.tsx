import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateStatus = async (taskId: string, status: string) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status });
            fetchTasks();
        } catch (error) {}
    };

    const deleteTask = async (taskId: string) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchTasks();
        } catch (error) {}
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between">
                <span className="text-xl font-black text-primary">ProManage</span>
                <span className="text-sm font-bold text-slate-600">Task Central</span>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="tasks" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-4xl font-black text-slate-900">Available Tasks</h1>
                            <p className="text-slate-500 font-medium">Select a task created by admin to begin working.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map(task => (
                                <div key={task._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                                            {task.projectId?.name}
                                        </span>
                                        {user?.role === 'Admin' && (
                                            <button onClick={() => deleteTask(task._id)} className="text-error hover:bg-error/5 p-1 rounded-lg">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{task.title}</h3>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-3">{task.description}</p>

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                                            <span className="text-sm font-black text-slate-900">{task.status}</span>
                                        </div>

                                        {user?.role === 'Member' && (
                                            <div className="flex gap-2">
                                                {task.status === 'Todo' && (
                                                    <button 
                                                        onClick={() => updateStatus(task._id, 'In Progress')}
                                                        className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20"
                                                    >
                                                        Start Task
                                                    </button>
                                                )}
                                                {task.status === 'In Progress' && (
                                                    <button 
                                                        onClick={() => updateStatus(task._id, 'Completed')}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-green-600/20"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
