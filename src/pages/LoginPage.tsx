import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-gutter">
            <main className="w-full max-w-[440px] flex flex-col gap-lg">
                <div className="flex flex-col items-center gap-xs">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-sm shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-on-primary text-2xl">grid_view</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tighter text-slate-900">ProManage</h1>
                </div>

                <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant/30 shadow-xl">
                    <header className="mb-lg">
                        <h2 className="font-h2 text-h2 text-on-surface mb-xs">Welcome back</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">Please enter your details to sign in.</p>
                    </header>

                    {error && (
                        <div className="mb-lg p-md bg-error-container/30 border border-error/20 rounded-xl flex items-start gap-md animate-in fade-in slide-in-from-top-2 duration-300">
                            <span className="material-symbols-outlined text-error text-xl mt-0.5">error</span>
                            <div className="flex-1">
                                <p className="font-bold text-on-error-container text-sm mb-1">Login Failed</p>
                                <p className="text-on-error-container/80 text-xs leading-relaxed">{error}</p>
                            </div>
                            <button 
                                onClick={() => setError('')}
                                className="text-on-error-container/50 hover:text-on-error-container transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg font-bold">close</span>
                            </button>
                        </div>
                    )}

                    <form className="flex flex-col gap-md" onSubmit={submit}>
                        <div className="flex flex-col gap-xs">
                            <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email</label>
                            <input className="w-full px-md py-md bg-white border border-outline-variant rounded-lg" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="flex flex-col gap-xs">
                            <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                            <input className="w-full px-md py-md bg-white border border-outline-variant rounded-lg" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md disabled:opacity-50" type="submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>
                </div>
                <footer className="text-center">
                    <p className="text-body-md text-on-surface-variant">
                        Don't have an account? <Link className="text-primary font-semibold" to="/signup">Signup</Link>
                    </p>
                </footer>
            </main>
        </div>
    );
}
