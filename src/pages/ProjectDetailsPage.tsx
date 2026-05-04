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
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskForm, setTaskForm] = useState({ title: '', description: '' });

    const fetchData = async () => {
        try {
            const projectsRes = await api.get('/projects');
            const current = projectsRes.data.find((p: any) => p._id === id);
            if (!current) throw new Error();
            setProject(current);

            const tasksRes = await api.get('/tasks');
            setTasks(tasksRes.data.filter((t: any) => t.projectId?._id === id));
        } catch (error) {
            navigate('/projects');
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { ...taskForm, projectId: id });
            setShowTaskModal(false);
            setTaskForm({ title: '', description: '' });
            fetchData();
        } catch (error) {}
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between">
                <span className="text-xl font-black text-primary">ProManage</span>
                <span className="text-sm font-bold text-slate-600">{project?.name}</span>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="projects" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="flex justify-between items-center mb-12">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900">{project?.name}</h1>
                                <p className="text-slate-500 font-medium">Project Lifecycle and Tasks</p>
                            </div>
                            {user?.role === 'Admin' && (
                                <button onClick={() => setShowTaskModal(true)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-black transition-all">
                                    Create Task
                                </button>
                            )}
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {['Todo', 'In Progress', 'Completed'].map(status => (
                                <div key={status} className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{status}</h3>
                                        <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600">
                                            {tasks.filter(t => t.status === status).length}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {tasks.filter(t => t.status === status).map(task => (
                                            <div key={task._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                                <h4 className="font-bold text-slate-900 mb-2">{task.title}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                                                {task.assignedTo && (
                                                    <div className="flex items-center gap-2">
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

            {showTaskModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[500px] rounded-3xl shadow-2xl p-8">
                        <h3 className="text-2xl font-black mb-6">New Task</h3>
                        <form onSubmit={createTask} className="space-y-6">
                            <input className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary" placeholder="Task Headline" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required />
                            <textarea className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary" rows={4} placeholder="Task Requirements" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
