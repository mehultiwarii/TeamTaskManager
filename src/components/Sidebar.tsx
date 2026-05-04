import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    activePage: 'dashboard' | 'projects' | 'tasks' | 'team' | 'settings';
}

export default function Sidebar({ activePage }: SidebarProps) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const initials = user?.name
        ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { key: 'projects', label: 'Projects', icon: 'folder_open', path: '/projects' },
        { key: 'team', label: 'Team', icon: 'group', path: '/team' },
        { key: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
    ];

    return (
        <aside className="bg-slate-50 h-screen w-64 border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col">
            <nav className="flex flex-col h-full p-4 gap-2 font-inter text-[13px] font-medium">
                <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                    </div>
                    <div>
                        <p className="text-slate-900 font-bold leading-tight">{user?.name || 'User'}</p>
                        <p className="text-slate-500 text-[11px] capitalize">Member</p>
                    </div>
                </div>

                {navItems.map((item) => (
                    <Link
                        key={item.key}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors active:scale-[0.98] ${
                            activePage === item.key
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <div className="mt-auto flex flex-col gap-1">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error-container/10 transition-colors active:scale-[0.98] w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}
