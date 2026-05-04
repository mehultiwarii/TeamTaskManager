import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

export default function TeamPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [userTasks, setUserTasks] = useState<any[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {}
    };

    const deleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            await api.delete(`/auth/users/${id}`);
            fetchUsers();
            if (selectedUser?._id === id) setSelectedUser(null);
        } catch (error) {}
    };

    const viewUserTasks = async (u: any) => {
        setSelectedUser(u);
        setLoadingTasks(true);
        try {
            const response = await api.get(`/tasks/user/${u._id}`);
            setUserTasks(response.data);
        } catch (error) {
            setUserTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <header className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between">
                <span className="text-xl font-black text-primary">ProManage</span>
                <span className="text-sm font-bold text-slate-600">Administrative Suite</span>
            </header>

            <div className="flex h-screen overflow-hidden">
                <Sidebar activePage="team" />
                <main className="flex-1 pt-24 p-8 overflow-y-auto relative">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-12 flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900">Team Management</h1>
                                <p className="text-slate-500 font-medium">Search and oversee all system members.</p>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input 
                                    className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-80 outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                                    placeholder="Search members..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </header>

                        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Member</th>
                                        <th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Role</th>
                                        <th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Contact</th>
                                        <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => viewUserTasks(u)}>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {u.name[0]}
                                                    </div>
                                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-500 font-medium">{u.email}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); deleteUser(u._id); }}
                                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-error/10 hover:text-error rounded-xl transition-all"
                                                        title="Remove Member"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">person_remove</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Task Panel */}
                    {selectedUser && (
                        <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl border-l border-slate-200 z-[100] flex flex-col animate-in slide-in-from-right duration-300">
                            <header className="p-8 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl mb-4">
                                        {selectedUser.name[0]}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedUser.name}</h2>
                                    <p className="text-slate-400 text-sm font-medium">{selectedUser.email}</p>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-8">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Assigned Tasks</h3>
                                
                                {loadingTasks ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : userTasks.length > 0 ? (
                                    <div className="space-y-4">
                                        {userTasks.map(task => (
                                            <div key={task._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-1">Project: {task.projectId?.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">task_alt</span>
                                        <p className="text-slate-400 text-xs font-bold">No tasks assigned yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
