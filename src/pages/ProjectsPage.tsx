import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Project {
    _id: string;
    name: string;
    description: string;
}

export default function ProjectsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projects', form);
            setShowModal(false);
            setForm({ name: '', description: '' });
            fetchProjects();
        } catch (error) {}
    };

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 w-full z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold tracking-tighter text-slate-900">ProManage</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-body-sm font-medium text-slate-600">{user?.name}</span>
                </div>
            </header>

            <div className="flex pt-16 h-screen overflow-hidden">
                <Sidebar activePage="projects" />
                <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="font-h1 text-h1 text-on-surface">Projects</h1>
                                <p className="font-body-md text-body-md text-on-surface-variant">Isolated workflow cycles.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md hover:opacity-90 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                New Project
                            </button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(p => (
                                <div
                                    key={p._id}
                                    onClick={() => navigate(`/projects/${p._id}`)}
                                    className="bg-white border border-outline-variant rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <h3 className="font-h3 text-h3 text-on-surface mb-2">{p.name}</h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[500px] min-h-[300px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-900">Create New Project</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={createProject} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Project Name</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-body-md"
                                    placeholder="e.g. Q3 Roadmap"
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
                                    placeholder="What are the goals of this cycle?"
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
