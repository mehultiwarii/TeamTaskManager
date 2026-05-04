import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalProjects: 0, activeTasks: 0 });
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });

    const fetchStats = async () => {
        try {
            const projects = await api.get('/projects');
            setStats(s => ({ ...s, totalProjects: projects.data.length }));
        } catch (error) {}
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projects', form);
            setShowModal(false);
            setForm({ name: '', description: '' });
            fetchStats();
        } catch (error) {}
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <header className="fixed top-0 left-0 w-full z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
                <span className="text-xl font-bold text-slate-900">ProManage</span>
                <span className="text-body-sm font-bold text-primary">Welcome, {user?.name}</span>
            </header>

            <div className="flex pt-16 h-screen">
                <Sidebar activePage="dashboard" />
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <header className="flex justify-between items-center">
                            <div>
                                <h1 className="text-h1 font-h1">Dashboard Overview</h1>
                                <p className="text-body-md text-on-surface-variant">Your personal isolated workspace.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                New Project
                            </button>
                        </header>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <span className="material-symbols-outlined text-4xl text-primary mb-4">folder</span>
                                <p className="text-4xl font-black text-slate-900">{stats.totalProjects}</p>
                                <p className="text-slate-500 font-medium">Active Projects</p>
                            </div>
                            <div
                                onClick={() => navigate('/projects')}
                                className="bg-slate-900 p-8 rounded-2xl shadow-xl flex flex-col justify-between cursor-pointer group"
                            >
                                <h3 className="text-white text-2xl font-bold">Go to Projects</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-slate-400">View and manage your tasks</p>
                                    <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[500px] min-h-[300px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-900">Start New Project</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={createProject} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Project Name</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-body-md"
                                    placeholder="e.g. Website Redesign"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                                <textarea
                                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-body-md"
                                    rows={4}
                                    placeholder="What is this project about?"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
