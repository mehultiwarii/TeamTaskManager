import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span></div>;
    return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

import React from 'react';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><ProjectsPage /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetailsPage /></PrivateRoute>} />
            <Route path="/team" element={<PrivateRoute><TeamPage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
