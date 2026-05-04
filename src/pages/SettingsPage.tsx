import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwMsg, setPwMsg] = useState('');
    const [pwError, setPwError] = useState('');
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [teamUpdates, setTeamUpdates] = useState(false);

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwMsg('');
        setPwError('');
        if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
        try {
            await api.put('/team/password', { currentPassword: currentPw, newPassword: newPw });
            setPwMsg('Password updated successfully.');
            setCurrentPw(''); setNewPw(''); setConfirmPw('');
        } catch (err: any) {
            setPwError(err.response?.data?.message || 'Failed to update password.');
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div className="bg-background text-on-background antialiased overflow-hidden">
            <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-6 h-16 bg-white border-b border-slate-200 shadow-sm font-inter antialiased text-sm">
                <div className="flex items-center gap-4">
                    <button className="text-slate-900 active:opacity-80 transition-opacity hover:bg-slate-50 p-2 rounded-lg">
                        <span className="material-symbols-outlined">grid_view</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tighter text-slate-900">ProManage</h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-medium">Settings</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-primary-container flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                    </div>
                </div>
            </header>

            <div className="flex h-screen pt-16">
                <aside className="hidden md:flex flex-col h-full w-64 bg-slate-50 border-r border-slate-200 p-4 gap-2 font-inter text-[13px] font-medium">
                    <div className="flex items-center gap-3 mb-6 p-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-container flex items-center justify-center text-white font-bold">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 font-bold text-sm">{user?.name}</span>
                            <span className="text-slate-500 text-xs capitalize">{user?.role}</span>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {[{to:'/dashboard',icon:'dashboard',label:'Dashboard'},{to:'/projects',icon:'folder_open',label:'Projects'},{to:'/projects',icon:'assignment_turned_in',label:'Tasks'},{to:'/team',icon:'group',label:'Team'}].map(n => (
                            <Link key={n.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150 active:scale-[0.98]" to={n.to}>
                                <span className="material-symbols-outlined">{n.icon}</span><span>{n.label}</span>
                            </Link>
                        ))}
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 font-semibold transition-all duration-150 active:scale-[0.98]" to="/settings">
                            <span className="material-symbols-outlined">settings</span><span>Settings</span>
                        </Link>
                    </nav>
                    <div className="mt-auto pt-4 border-t border-slate-200">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error-container/10 transition-colors active:scale-[0.98]">
                            <span className="material-symbols-outlined">logout</span><span>Logout</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-surface-container-low p-6 md:p-margin-page">
                    <div className="max-w-[800px] mx-auto">
                        <div className="mb-lg">
                            <h2 className="font-h2 text-h2 text-on-surface mb-xs">Account Settings</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Manage your profile, security preferences, and notification settings.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-lg">
                            <section className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
                                <div className="p-md border-b border-outline-variant/20 flex items-center justify-between">
                                    <h3 className="font-h3 text-h3 text-on-surface">User Profile</h3>
                                    <button className="text-primary font-label-md text-label-md hover:underline">Edit Info</button>
                                </div>
                                <div className="p-lg flex flex-col md:flex-row items-center gap-lg">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-surface-container-high ring-offset-2 bg-primary-container flex items-center justify-center text-white text-3xl font-bold">
                                            {initials}
                                        </div>
                                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white active:scale-95 transition-transform">
                                            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                                        </button>
                                    </div>
                                    <div className="flex-1 space-y-md">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-outline font-bold mb-1">Full Name</p>
                                                <p className="font-body-lg text-body-lg text-on-surface font-semibold">{user?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-outline font-bold mb-1">Email Address</p>
                                                <p className="font-body-lg text-body-lg text-on-surface font-semibold">{user?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-outline font-bold mb-1">Role</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                                                    <p className="font-body-lg text-body-lg text-on-surface capitalize">{user?.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
                                <div className="p-md border-b border-outline-variant/20">
                                    <h3 className="font-h3 text-h3 text-on-surface">Security</h3>
                                </div>
                                <div className="p-lg">
                                    {pwMsg && <div className="mb-md p-sm bg-emerald-50 text-emerald-700 rounded-lg text-body-sm font-medium">{pwMsg}</div>}
                                    {pwError && <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg text-body-sm font-medium">{pwError}</div>}
                                    <form className="space-y-md" onSubmit={updatePassword}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                                            <div className="space-y-sm">
                                                <label className="font-label-md text-label-md text-on-surface-variant block">Current Password</label>
                                                <input className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface transition-all outline-none font-body-md text-body-md" placeholder="••••••••" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
                                            </div>
                                            <div className="hidden md:block"></div>
                                            <div className="space-y-sm">
                                                <label className="font-label-md text-label-md text-on-surface-variant block">New Password</label>
                                                <input className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface transition-all outline-none font-body-md text-body-md" placeholder="Min 8 characters" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
                                            </div>
                                            <div className="space-y-sm">
                                                <label className="font-label-md text-label-md text-on-surface-variant block">Confirm New Password</label>
                                                <input className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface transition-all outline-none font-body-md text-body-md" placeholder="Confirm password" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-md">
                                            <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm active:scale-95" type="submit">Update Password</button>
                                        </div>
                                    </form>
                                </div>
                            </section>

                            <section className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
                                <div className="p-md border-b border-outline-variant/20">
                                    <h3 className="font-h3 text-h3 text-on-surface">Notifications</h3>
                                </div>
                                <div className="divide-y divide-outline-variant/10">
                                    {[
                                        { label: 'Email Notifications', desc: 'Receive daily digests and project alerts via email.', val: emailNotif, set: setEmailNotif },
                                        { label: 'Push Notifications', desc: 'Get real-time updates on task assignments and comments.', val: pushNotif, set: setPushNotif },
                                        { label: 'Team Updates', desc: 'Weekly reports on team velocity and performance.', val: teamUpdates, set: setTeamUpdates },
                                    ].map(item => (
                                        <div key={item.label} className="p-lg flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-body-lg text-body-lg text-on-surface font-semibold">{item.label}</p>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input className="sr-only peer" type="checkbox" checked={item.val} onChange={e => item.set(e.target.checked)} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mb-xl">
                                <div className="bg-error-container/20 rounded-xl border border-error/20 p-lg flex flex-col md:flex-row items-center justify-between gap-md">
                                    <div className="space-y-1">
                                        <h3 className="font-h3 text-h3 text-error">Logout</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">Sign out of your ProManage account on this device.</p>
                                    </div>
                                    <button onClick={handleLogout} className="w-full md:w-auto px-lg py-sm bg-error text-white rounded-lg font-label-md text-label-md hover:bg-red-700 transition-colors shadow-sm active:scale-95">Log Out</button>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
