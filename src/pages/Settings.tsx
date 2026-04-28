import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, User, Lock, Save, Globe, Smartphone, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('Chief Officer');
  const [mobileSync, setMobileSync] = useState(true);
  const [overrides, setOverrides] = useState(false);

  const handleCommit = () => {
    showToast('Configuration updated and synced across HQ nodes', 'success');
  };

  const handleTerminate = async () => {
    if (confirm('CRITICAL: This will invalidate all active sessions immediately. Proceed?')) {
      try {
        const res = await fetch('/api/settings/terminate', { method: 'POST' });
        if (res.ok) {
          navigate('/login');
        }
      } catch {
        showToast('System lock failed. Check infrastructure logs.', 'error');
      }
    }
  };

  const sections = [
    { title: 'Personal Profile', icon: User, desc: 'Manage your credentials and badge identification' },
    { title: 'Security & Access', icon: Shield, desc: 'Control system permissions and authentication layers' },
    { title: 'Notification Hub', icon: Bell, desc: 'Route alerts to your tactical device or workstation' },
    { title: 'Regional Config', icon: Globe, desc: 'Select jurisdiction and active patrol boundaries' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">System Preferences</p>
        <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Control Center Settings</h1>
      </header>

      <Toast {...toast} onClose={hideToast} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Categories</p>
          {sections.map((section, i) => (
            <motion.button 
              key={section.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-full p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 group transition-all text-left flex items-start gap-4"
            >
              <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-primary-sentinel group-hover:text-white rounded-2xl transition-all">
                <section.icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900 mb-1">{section.title}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{section.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-black font-headline text-lg uppercase tracking-tight">Account Configuration</h3>
                <button 
                  onClick={handleCommit}
                  className="flex items-center gap-2 primary-gradient text-white px-6 py-2 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95"
                >
                   <Save size={16} />
                   Commit Changes
                </button>
             </div>

             <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-headline">Display Name</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-headline">Badge ID</label>
                      <div className="relative">
                         <input type="text" readOnly defaultValue="POL-9921-HQ" className="w-full bg-slate-100 border-none rounded-2xl p-4 text-sm font-bold text-slate-400 cursor-not-allowed" />
                         <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-headline">Interface Preferences</h4>
                   <div 
                    onClick={() => setMobileSync(!mobileSync)}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                   >
                      <div className="flex items-center gap-3">
                         <Smartphone className={cn("transition-colors", mobileSync ? "text-primary-sentinel" : "text-slate-400")} size={18} />
                         <div>
                            <p className="text-sm font-bold text-slate-700">Mobile Syncing</p>
                            <p className="text-[10px] text-slate-400 font-medium">Keep tactical data in sync with regional devices</p>
                         </div>
                      </div>
                      <div className={cn("w-12 h-6 rounded-full relative transition-colors", mobileSync ? "bg-teal-500" : "bg-slate-300")}>
                         <motion.div 
                          animate={{ x: mobileSync ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                         />
                      </div>
                   </div>
                   <div 
                    onClick={() => setOverrides(!overrides)}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                   >
                      <div className="flex items-center gap-3">
                         <Bell className={cn("transition-colors", overrides ? "text-primary-sentinel" : "text-slate-400")} size={18} />
                         <div>
                            <p className="text-sm font-bold text-slate-700">Critical Priority Overrides</p>
                            <p className="text-[10px] text-slate-400 font-medium">Allow alerts to bypass silent mode on dashboard</p>
                         </div>
                      </div>
                      <div className={cn("w-12 h-6 rounded-full relative transition-colors", overrides ? "bg-teal-500" : "bg-slate-300")}>
                         <motion.div 
                           animate={{ x: overrides ? 24 : 4 }}
                           className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                         />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                   <Lock size={24} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-red-600 uppercase">Emergency Override</h4>
                   <p className="text-xs text-red-400 font-bold">Lock system immediately and revoke all active sessions</p>
                </div>
             </div>
             <button 
              onClick={handleTerminate}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-100"
             >
                TERMINATE ALL
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
