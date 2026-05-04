import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const [pRes, tRes] = await Promise.all([
                api.get('/projects'),
                api.get(`/tasks/project/${id}`)
            ]);
            const current = pRes.data.find((p: any) => p._id === id);
            if (!current) throw new Error();
            setProject(current);
            setTasks(tRes.data);
        } catch (error) {
            navigate('/projects');
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between shadow-sm">
                <span className="text-xl font-black text-primary">ProManage</span>
                <span className="text-sm font-bold text-slate-500">{project?.name} / Project Board</span>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="projects" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-12">
                            <h1 className="text-5xl font-black text-slate-900 mb-2">{project?.name}</h1>
                            <p className="text-slate-500 font-medium text-lg">{project?.description}</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {['Todo', 'In Progress', 'Completed'].map(status => (
                                <div key={status} className="space-y-6">
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{status}</h3>
                                        <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-black text-slate-400 shadow-sm">
                                            {tasks.filter(t => t.status === status).length}
                                        </span>
                                    </div>
                                    <div className="space-y-4 min-h-[200px] p-2 rounded-[32px] bg-slate-100/50 border border-dashed border-slate-200">
                                        {tasks.filter(t => t.status === status).map(task => (
                                            <div key={task._id} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                                                <h4 className="font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{task.title}</h4>
                                                <p className="text-[11px] text-slate-400 leading-relaxed mb-4 line-clamp-2">{task.description}</p>
                                                {task.assignedTo && (
                                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                            {task.assignedTo.name[0]}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400">{task.assignedTo.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
