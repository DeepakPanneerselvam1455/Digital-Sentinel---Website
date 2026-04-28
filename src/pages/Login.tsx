import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [username, setUsername] = useState('Admin@police.com');
  const [password, setPassword] = useState('Police@100');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login({ username, password });
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,35,111,0.1)] overflow-hidden border border-slate-100"
      >
        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-sentinel">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-black font-headline text-primary-sentinel mb-2 uppercase tracking-tight">Digital Sentinel</h1>
          <p className="text-slate-500 font-medium text-sm">Law Enforcement Personnel Login</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold text-slate-500 uppercase tracking-widest ml-1">Username / ID</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-slate-50 border-transparent focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl p-4 pl-12 text-sm transition-all"
                placeholder="badge_id / email"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Shield size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.6875rem] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-slate-50 border-transparent focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-2xl p-4 pl-12 pr-12 text-sm transition-all"
                placeholder="secure password"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </div>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full primary-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter System'}
          </button>

          <p className="text-center text-[0.6875rem] text-slate-400 font-bold uppercase tracking-widest">
            Encryption: AES-256 Validated
          </p>
        </form>
      </motion.div>
      
      <p className="mt-8 text-slate-400 text-xs font-medium">
        Unauthorized access is strictly prohibited and subject to legal action.
      </p>
    </div>
  );
}
