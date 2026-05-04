import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Member { _id: string; name: string; email: string; role: 'admin' | 'member'; }

const avatarColors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-cyan-500'];
const getColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];
const initials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

export default function TeamPage() {
    const { user } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState('');
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');

    useEffect(() => {
        api.get('/team').then(r => setMembers(r.data)).catch(() => {});
    }, []);

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

    const changeRole = async (id: string, role: string) => {
        try { await api.put(`/team/${id}/role`, { role }); api.get('/team').then(r => setMembers(r.data)); } catch {}
    };

    const admins = members.filter(m => m.role === 'admin');
    const mems = members.filter(m => m.role === 'member');

    return (
        <div className="bg-background text-on-background min-h-screen flex overflow-hidden">
            <aside className="hidden md:flex flex-col h-screen w-64 border-r border-slate-200 bg-slate-50 p-4 gap-2 z-50">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <span className="material-symbols-outlined text-primary text-2xl">grid_view</span>
                    <span className="text-lg font-black text-slate-900 tracking-tighter">ProManage</span>
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    {[{to:'/dashboard',icon:'dashboard',label:'Dashboard'},{to:'/projects',icon:'folder_open',label:'Projects'},{to:'/projects',icon:'assignment_turned_in',label:'Tasks'}].map(n => (
                        <Link key={n.label} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors font-inter text-[13px] font-medium" to={n.to}>
                            <span className="material-symbols-outlined">{n.icon}</span>{n.label}
                        </Link>
                    ))}
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 font-inter text-[13px] font-medium" to="/team">
                        <span className="material-symbols-outlined">group</span>Team
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors font-inter text-[13px] font-medium" to="/settings">
                        <span className="material-symbols-outlined">settings</span>Settings
                    </Link>
                </nav>
                <div className="mt-auto p-3 bg-white rounded-xl ring-1 ring-slate-200 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getColor(user?.name||'U')}`}>{initials(user?.name||'User')}</div>
                    <div className="flex flex-col">
                        <span className="text-label-md font-bold text-slate-900">{user?.name}</span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider capitalize">{user?.role}</span>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white flex items-center justify-between px-6 z-40 border-b border-slate-200 shadow-sm">
                    <h1 className="text-xl font-bold tracking-tighter text-slate-900">Team Directory</h1>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-body-sm w-32 md:w-48 text-slate-600 outline-none" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2" onClick={() => setShowInvite(true)}>
                            <span className="material-symbols-outlined text-sm">person_add</span>Add Member
                        </button>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white ${getColor(user?.name||'U')}`}>{initials(user?.name||'U')}</div>
                    </div>
                </header>

                <main className="flex-1 pt-16 overflow-y-auto bg-background">
                    <div className="max-w-6xl mx-auto p-6 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-h1 font-h1 text-on-background">Collaborators</h2>
                                <p className="text-body-md text-on-surface-variant mt-1">Manage permissions and team roles across your workspace.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                                <button className="px-4 py-1.5 bg-slate-100 text-primary font-bold text-label-md rounded-lg">Active ({members.length})</button>
                                <button className="px-4 py-1.5 text-slate-500 font-medium text-label-md rounded-lg hover:bg-slate-50">Pending (0)</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-h3 font-h3 text-slate-900 mb-4">Team Composition</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-body-md text-slate-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span>Administrators</span>
                                            <span className="font-bold text-slate-900">{admins.length}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-primary h-full" style={{width: members.length ? `${(admins.length/members.length)*100}%` : '25%'}}></div></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-body-md text-slate-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span>Members</span>
                                            <span className="font-bold text-slate-900">{mems.length}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-secondary h-full" style={{width: members.length ? `${(mems.length/members.length)*100}%` : '75%'}}></div></div>
                                    </div>
                                </div>
                                <div className="bg-primary-container p-6 rounded-xl text-on-primary-container relative overflow-hidden">
                                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-10">shield_person</span>
                                    <h3 className="text-h3 font-h3 mb-2">Invite Credits</h3>
                                    <p className="text-body-sm opacity-80 mb-4">Your organization has 5 seats remaining on the Pro Plan.</p>
                                    <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-label-md font-bold">Upgrade Seat Limit</button>
                                </div>
                            </div>

                            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-left text-label-md font-bold text-slate-400 uppercase tracking-wider">Member</th>
                                                <th className="px-6 py-4 text-left text-label-md font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-4 text-right text-label-md font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filtered.map(m => (
                                                <tr key={m._id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm ${getColor(m.name)}`}>{initials(m.name)}</div>
                                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-body-md font-bold text-slate-900">{m.name}</span>
                                                                <span className="text-body-sm text-slate-500">{m.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${m.role==='admin' ? 'bg-primary/10 text-primary' : 'bg-secondary-container/30 text-secondary'}`}>{m.role}</span>
                                                            {user?.role==='admin' && m._id!==user._id && (
                                                                <select className="bg-transparent border-none focus:ring-0 text-[11px] text-slate-400 font-medium cursor-pointer p-0 w-24 outline-none" defaultValue="" onChange={e => { if(e.target.value) changeRole(m._id, e.target.value); }}>
                                                                    <option value="">Change role</option>
                                                                    <option value="admin">Admin</option>
                                                                    <option value="member">Member</option>
                                                                </select>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filtered.length === 0 && (
                                                <tr><td colSpan={3} className="px-6 py-12 text-center text-on-surface-variant text-body-md">No members found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-body-sm text-slate-500">Showing {filtered.length} of {members.length} members</span>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 rounded hover:bg-slate-200 text-slate-400"><span className="material-symbols-outlined">chevron_left</span></button>
                                        <button className="p-1 rounded hover:bg-slate-200 text-slate-400"><span className="material-symbols-outlined">chevron_right</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {showInvite && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-h3 text-slate-900 font-h3">Invite new member</h3>
                            <button onClick={() => setShowInvite(false)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-label-md font-bold text-slate-700 block">Email Address</label>
                                <input className="w-full rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none px-3 py-2 text-body-md" placeholder="colleague@company.com" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-label-md font-bold text-slate-700 block">Assign Role</label>
                                <select className="w-full rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none px-3 py-2 text-body-md" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                                    <option value="member">Member (View and edit tasks)</option>
                                    <option value="admin">Admin (Full workspace control)</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex items-center justify-end gap-3">
                            <button onClick={() => setShowInvite(false)} className="px-4 py-2 text-label-md font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button className="px-4 py-2 text-label-md font-bold bg-primary text-on-primary rounded-lg shadow-sm">Send Invitation</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
