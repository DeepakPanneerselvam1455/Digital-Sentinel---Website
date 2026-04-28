import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-sentinel flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 border-4 border-slate-200 border-t-primary-sentinel rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold font-headline text-primary-sentinel uppercase tracking-widest">Digital Sentinel</h2>
        <p className="text-slate-400 text-xs font-bold mt-2">Initializing Secure Environment...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
