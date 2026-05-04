import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    assignedTo: { _id: string; name: string };
}

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [project, setProject] = useState<any>(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: user?.id, status: 'todo' });

    const fetchData = async () => {
        try {
            const projectsRes = await api.get('/projects');
            const current = projectsRes.data.find((p: any) => p._id === id);
            if (!current) throw new Error('Project not found');
            setProject(current);

            const tasksRes = await api.get(`/tasks/project/${id}`);
            setTasks(tasksRes.data);
        } catch (error) {
            navigate('/projects');
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { ...taskForm, projectId: id });
            setShowTaskModal(false);
            setTaskForm({ title: '', description: '', assignedTo: user?.id, status: 'todo' });
            fetchData();
        } catch (error) {}
    };

    const updateTaskStatus = async (taskId: string, status: string) => {
        try {
            await api.patch(`/tasks/${taskId}`, { status });
            fetchData();
        } catch (error) {}
    };

    const deleteTask = async (taskId: string) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchData();
        } catch (error) {}
    };

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 w-full z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-slate-900">ProManage</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-body-sm font-medium text-slate-600">{project?.name}</span>
                </div>
            </header>

            <div className="flex pt-16 h-screen overflow-hidden">
                <Sidebar activePage="projects" />
                <main className="flex-1 overflow-y-auto p-8">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-h1 font-h1">{project?.name}</h1>
                        <button onClick={() => setShowTaskModal(true)} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md flex items-center gap-2">
                            <span className="material-symbols-outlined">add</span>
                            New Task
                        </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['todo', 'in-progress', 'done'].map(status => (
                            <div key={status} className="bg-slate-50 p-4 rounded-xl min-h-[500px]">
                                <h3 className="text-h3 font-h3 mb-4 capitalize">{status.replace('-', ' ')}</h3>
                                <div className="space-y-4">
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group">
                                            <h4 className="font-bold mb-1">{task.title}</h4>
                                            <p className="text-[12px] text-slate-500 mb-4">{task.assignedTo?.name}</p>
                                            <div className="flex justify-between items-center">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                    className="text-[11px] font-bold border border-slate-200 rounded px-2 py-1 outline-none"
                                                >
                                                    <option value="todo">To Do</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="done">Done</option>
                                                </select>
                                                <button onClick={() => deleteTask(task._id)} className="text-error opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {showTaskModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[500px] min-h-[300px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-900">Create New Task</h3>
                            <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={createTask} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Task Title</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-body-md"
                                    placeholder="What needs to be done?"
                                    value={taskForm.title}
                                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                                <textarea
                                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-body-md"
                                    rows={4}
                                    placeholder="Add more details about this task..."
                                    value={taskForm.description}
                                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
