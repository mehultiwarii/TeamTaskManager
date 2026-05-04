import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    activePage: string;
}

export default function Sidebar({ activePage }: SidebarProps) {
    const { user, logout } = useAuth();

    const initials = user?.name ? user.name.split(' ').map((w: any) => w[0]).join('').toUpperCase() : 'U';

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { key: 'projects', label: 'Projects', icon: 'folder_open', path: '/projects' },
        { key: 'tasks', label: 'Tasks', icon: 'task_alt', path: '/tasks' },
    ];

    if (user?.role === 'Admin') {
        navItems.push({ key: 'team', label: 'Team Management', icon: 'group', path: '/team' });
    } else {
        navItems.push({ key: 'status', label: 'My Status', icon: 'insights', path: '/status' });
    }

    return (
        <aside className="bg-white h-screen w-64 border-r border-slate-200 flex flex-col pt-16">
            <nav className="flex-1 p-4 space-y-2">
                <div className="px-3 py-4 mb-6 bg-slate-50 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">{initials}</div>
                    <div>
                        <p className="font-bold text-slate-900 truncate w-32">{user?.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-primary font-black">{user?.role}</p>
                    </div>
                </div>

                {navItems.map((item) => (
                    <Link
                        key={item.key}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            activePage === item.key ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="font-bold text-sm">{item.label}</span>
                    </Link>
                ))}

                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/5 w-full mt-auto">
                    <span className="material-symbols-outlined">logout</span>
                    <span className="font-bold text-sm">Logout</span>
                </button>
            </nav>
        </aside>
    );
}
