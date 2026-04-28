import React, { useState } from 'react';
import { Megaphone, MessageSquare, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

export default function Announcements() {
  const [broadcast, setBroadcast] = useState('');
  const { toast, showToast, hideToast } = useToast();

  const handleBroadcast = async () => {
    if (!broadcast) return showToast('Broadcast message cannot be empty', 'error');

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: broadcast })
      });
      if (res.ok) {
        showToast('System-wide broadcast sent', 'success');
        setBroadcast('');
      }
    } catch {
      showToast('Failed to send broadcast', 'error');
    }
  };

  const announcements = [
    { id: 1, title: 'Tactical Training Update', body: 'All units must complete the new cyber-crime response module by Friday.', date: 'Today, 09:00', type: 'Required' },
    { id: 2, title: 'Sector 4 Patrol Increase', body: 'Increased activity reported in Sector 4. Additional units deployed for night shift.', date: 'Yesterday, 18:30', type: 'Operation' },
    { id: 3, title: 'System Maintenance', body: 'Command center database will undergo routine maintenance at 02:00 AM.', date: 'Yesterday, 14:00', type: 'System' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Internal Communications</p>
        <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Announcements</h1>
      </header>

      <Toast {...toast} onClose={hideToast} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {announcements.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-primary-sentinel rounded-xl flex items-center justify-center">
                    <Megaphone size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-sentinel transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">
                  {item.type}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-sidebar-sentinel rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xl font-black font-headline mb-4">Broadcast Message</h3>
                <p className="text-sm text-slate-500 mb-6">Send an urgent update to all active duty personnel in the region.</p>
                <textarea 
                  value={broadcast}
                  onChange={(e) => setBroadcast(e.target.value)}
                  className="w-full h-32 bg-white/70 backdrop-blur-md border border-white rounded-2xl p-4 text-sm focus:ring-4 focus:ring-blue-100 transition-all mb-4"
                  placeholder="Type message here..."
                />
                <button 
                  onClick={handleBroadcast}
                  className="w-full primary-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                   <Bell size={16} />
                   Send Broadcast
                </button>
             </div>
             <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
          </div>
          
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <MessageSquare size={14} />
                Recent Feedback
             </h4>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <p className="text-xs text-slate-500 italic">"Radio interference reported in Sector 2. Checking signal repeaters."</p>
                   <p className="text-[10px] font-bold text-slate-400 mt-2">— Officer Sterling</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
