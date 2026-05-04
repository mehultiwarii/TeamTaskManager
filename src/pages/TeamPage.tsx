import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function TeamPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users'); // I'll add this route
            setUsers(response.data);
        } catch (error) {}
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
                <main className="flex-1 pt-24 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-12 flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900">Team Management</h1>
                                <p className="text-slate-500 font-medium">Search and oversee all system members.</p>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input 
                                    className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-80 outline-none focus:ring-2 focus:ring-primary shadow-sm"
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
                                        <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {u.name[0]}
                                                    </div>
                                                    <span className="font-bold text-slate-900">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-500 font-medium">{u.email}</td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
