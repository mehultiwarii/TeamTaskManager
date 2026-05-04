import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function ProjectsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);
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

    const deleteProject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch (error) {}
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between">
                <span className="text-xl font-black text-primary">ProManage</span>
                <span className="text-sm font-bold text-slate-600">Enterprise Dashboard</span>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="projects" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900">Projects</h1>
                                <p className="text-slate-500 font-medium">Browse projects created by administrator.</p>
                            </div>
                            {user?.role === 'Admin' && (
                                <button onClick={() => setShowModal(true)} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                                    New Project
                                </button>
                            )}
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map(p => (
                                <div key={p._id} onClick={() => navigate(`/projects/${p._id}`)} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative">
                                    {user?.role === 'Admin' && (
                                        <button 
                                            onClick={(e) => deleteProject(e, p._id)}
                                            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 text-slate-300 hover:bg-error hover:text-white transition-all flex items-center justify-center z-10"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    )}
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6">
                                        <span className="material-symbols-outlined">folder</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{p.name}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[500px] rounded-3xl shadow-2xl p-8">
                        <h3 className="text-2xl font-black mb-6">Create Project</h3>
                        <form onSubmit={createProject} className="space-y-6">
                            <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary" placeholder="Project Title" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            <textarea className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary" rows={4} placeholder="Project Details" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg">Launch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
