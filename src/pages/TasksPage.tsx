import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', projectId: '', dueDate: '' });

    const fetchData = async () => {
        try {
            const [tRes, pRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/projects')
            ]);
            setTasks(tRes.data);
            setProjects(pRes.data);
            if (pRes.data.length > 0 && !form.projectId) setForm(f => ({ ...f, projectId: pRes.data[0]._id }));
        } catch (error) {}
    };

    useEffect(() => {
        fetchData();
    }, []);

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', form);
            setShowModal(false);
            setForm({ title: '', description: '', projectId: projects[0]?._id || '', dueDate: '' });
            fetchData();
        } catch (error) {}
    };

    const deleteTask = async (id: string) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchData();
        } catch (error) {}
    };

    const updateStatus = async (taskId: string, status: string) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status });
            fetchData();
        } catch (error) {}
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between shadow-sm">
                <span className="text-2xl font-black text-primary tracking-tight">ProManage</span>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">{user?.role}</span>
                </div>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="tasks" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="flex justify-between items-end mb-12">
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 mb-2">Tasks</h1>
                                <p className="text-slate-500 font-medium text-lg">Centralized oversight for all project milestones.</p>
                            </div>
                            {user?.role === 'Admin' && (
                                <button onClick={() => setShowModal(true)} className="bg-primary text-white px-8 py-4 rounded-[20px] font-bold shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all">
                                    Create New Task
                                </button>
                            )}
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tasks.map(task => (
                                <div key={task._id} className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm hover:shadow-2xl transition-all flex flex-col group relative">
                                    {user?.role === 'Admin' && (
                                        <button onClick={() => deleteTask(task._id)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 text-slate-300 hover:bg-error hover:text-white transition-all flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    )}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-primary mb-1">{task.projectId?.name || 'Project'}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                                task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                                task.status === 'Overdue' ? 'bg-error-container text-on-error-container' : 'bg-primary/10 text-primary'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        {task.dueDate && (
                                            <div className="flex flex-col items-end">
                                                <span className="text-[8px] font-black uppercase text-slate-300">Deadline</span>
                                                <span className={`text-[10px] font-bold ${task.status === 'Overdue' ? 'text-error' : 'text-slate-400'}`}>
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{task.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-3">{task.description}</p>
                                    
                                    <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                {task.assignedTo?.name?.[0] || 'A'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-300">Owner</span>
                                                <span className="text-xs font-bold text-slate-700">{task.assignedTo?.name || 'Admin'}</span>
                                            </div>
                                        </div>
                                        {user?.role === 'Member' && task.status !== 'Completed' && (
                                            <button 
                                                onClick={() => updateStatus(task._id, task.status === 'Todo' ? 'In Progress' : 'Completed')}
                                                className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-black/10 hover:bg-black transition-all"
                                            >
                                                {task.status === 'Todo' ? 'Claim Task' : 'Finalize'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[550px] rounded-[50px] shadow-2xl p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        
                        <h3 className="text-4xl font-black text-slate-900 mb-2">New Task</h3>
                        <p className="text-slate-400 font-medium mb-10">Assign mission-critical work to your team.</p>

                        <form onSubmit={createTask} className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Linked Project</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[25px] px-8 py-5 outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-700 appearance-none"
                                        value={form.projectId}
                                        onChange={e => setForm({...form, projectId: e.target.value})}
                                        required
                                    >
                                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Task Title</label>
                                <input 
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[25px] px-8 py-5 outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                                    placeholder="e.g. Implement OAuth2" 
                                    value={form.title} 
                                    onChange={e => setForm({...form, title: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Deadline</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[25px] px-8 py-5 outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-900" 
                                        value={form.dueDate} 
                                        onChange={e => setForm({...form, dueDate: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Brief Description</label>
                                <textarea 
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[25px] px-8 py-5 outline-none focus:border-primary/20 focus:bg-white transition-all font-medium text-slate-600 placeholder:text-slate-300 min-h-[120px]" 
                                    placeholder="Explain the requirements..." 
                                    value={form.description} 
                                    onChange={e => setForm({...form, description: e.target.value})} 
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 font-black text-slate-300 hover:text-slate-400 transition-colors">Dismiss</button>
                                <button type="submit" className="flex-1 bg-primary text-white py-5 rounded-[25px] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
