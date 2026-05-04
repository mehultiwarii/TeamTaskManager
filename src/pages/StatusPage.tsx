import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function StatusPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [filter, setFilter] = useState('Ongoing');

    const fetchStatus = async () => {
        try {
            const response = await api.get(`/tasks/status?filter=${filter}`);
            setTasks(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        fetchStatus();
    }, [filter]);

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between">
                <span className="text-xl font-black text-primary">ProManage</span>
                <span className="text-sm font-bold text-slate-600">Activity Tracker</span>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="status" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <header className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900">Work Status</h1>
                                <p className="text-slate-500 font-medium">Timeline of your task activities.</p>
                            </div>
                            <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1">
                                {['Ongoing', 'Completed', 'Overdue'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === f ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </header>

                        <div className="space-y-6">
                            {tasks.map(task => (
                                <div key={task._id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-primary mb-1 block">{task.projectId?.name}</span>
                                            <h3 className="text-2xl font-bold text-slate-900">{task.title}</h3>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="border-l-2 border-slate-100 ml-4 pl-8 space-y-6 relative">
                                        {task.history.slice().reverse().map((log: any, idx: number) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-primary"></div>
                                                <p className="text-sm font-bold text-slate-900">{log.description}</p>
                                                <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {tasks.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                    <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">history</span>
                                    <p className="text-slate-400 font-bold">No tasks found for this status.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
