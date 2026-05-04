import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ projects: 0, tasks: 0 });

    const fetchStats = async () => {
        try {
            const pRes = await api.get('/projects');
            const tRes = await api.get('/tasks');
            setStats({ projects: pRes.data.length, tasks: tRes.data.length });
        } catch (error) {}
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between">
                <span className="text-xl font-black text-primary">ProManage</span>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black uppercase text-primary bg-primary/5 px-3 py-1 rounded-full">{user?.role}</span>
                </div>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="dashboard" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-12">
                            <h1 className="text-5xl font-black text-slate-900 mb-2">Hello, {user?.name}</h1>
                            <p className="text-slate-500 font-medium text-lg">Here is what is happening with your workspace today.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-between">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10">
                                    <span className="material-symbols-outlined text-3xl">folder</span>
                                </div>
                                <div>
                                    <p className="text-6xl font-black text-slate-900 mb-2">{stats.projects}</p>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Projects</p>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                <div className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center mb-10">
                                    <span className="material-symbols-outlined text-3xl">task_alt</span>
                                </div>
                                <div>
                                    <p className="text-6xl font-black text-white mb-2">{stats.tasks}</p>
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                                        {user?.role === 'Admin' ? 'System Tasks' : 'My Active Tasks'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-200 p-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-1">Quick Navigation</h3>
                                <p className="text-slate-500 font-medium">Access your work modules instantly.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => navigate('/projects')} className="px-8 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 hover:bg-slate-100 transition-all">Projects</button>
                                <button onClick={() => navigate('/tasks')} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all">All Tasks</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
