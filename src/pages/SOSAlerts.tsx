import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  User, 
  ChevronRight,
  PhoneCall,
  Navigation,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { storage, SEED_DATA } from '../lib/storage';

interface SOSAlert {
  id: string;
  reporter: string;
  type?: string;
  location: string;
  status: string;
  liveTime?: string;
  time?: string;
  priority: string;
  pulse?: boolean;
}

export default function SOSAlerts() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchAlerts = async () => {
    setLoading(true);
    setTimeout(() => {
      const data = storage.get<SOSAlert[]>('sentinel_sos', SEED_DATA.sos);
      if (localStorage.getItem('sentinel_sos') === null) {
        storage.set('sentinel_sos', SEED_DATA.sos);
      }
      setAlerts(data);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const [confirmDispatchId, setConfirmDispatchId] = useState<{ id: string, reporter: string, location: string } | null>(null);

  const handleDispatch = (id: string, reporter: string) => {
    storage.update<SOSAlert>('sentinel_sos', id, { status: 'Unit Dispatched' });
    showToast(`Unit dispatched to ${reporter}'s sector`, 'success');
    fetchAlerts();
    setConfirmDispatchId(null);
  };

  const initiateDispatch = (id: string, reporter: string, location: string) => {
    setConfirmDispatchId({ id, reporter, location });
  };

  const handleCall = (reporter: string) => {
    showToast(`Establishing secure line to ${reporter}...`, 'info');
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-2 relative">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Critical Response Hub
          </p>
        </div>
        <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Active SOS Alerts</h1>
        
        {/* Urgent global indicator */}
        <div className="absolute top-0 right-0 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 hidden lg:flex">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Active Alerts</p>
            <p className="text-xl font-black text-slate-900">{alerts.filter(a => a.priority === 'Critical').length} CRITICAL</p>
          </div>
        </div>
      </header>

      <Toast {...toast} onClose={hideToast} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-[2rem] animate-pulse" />
          ))
        ) : (
          alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group p-1 rounded-[2.5rem] relative transition-all hover:scale-[1.02]",
                alert.priority === 'Critical' ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse" : "bg-slate-200"
              )}
            >
              <div className="bg-white rounded-[2.3rem] p-6 h-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    alert.priority === 'Critical' ? "border-red-100 text-red-600 bg-red-50" : "border-slate-100 text-slate-500 bg-slate-50"
                  )}>
                    {alert.id}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <Clock size={12} />
                    <span>Live {alert.liveTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary-sentinel group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{alert.reporter}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{alert.type}</p>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={16} className="text-primary-sentinel mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-slate-600">{alert.location}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <ShieldAlert size={16} className="text-red-500" />
                    <span className="text-xs font-bold text-slate-700">{alert.status}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    disabled={alert.status === 'Unit Dispatched'}
                    onClick={() => initiateDispatch(alert.id, alert.reporter, alert.location)}
                    className="flex-1 py-3 bg-primary-sentinel text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-sentinel-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Navigation size={14} />
                    {alert.status === 'Unit Dispatched' ? 'Deployed' : 'Dispatch Unit'}
                  </button>
                  <button 
                    onClick={() => handleCall(alert.reporter)}
                    className="w-12 h-12 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-sentinel hover:border-primary-sentinel transition-all"
                  >
                    <PhoneCall size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Action required footer */}
      <div className="p-8 bg-white border-2 border-red-100 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center">
             <AlertCircle size={32} />
           </div>
           <div>
             <h3 className="text-xl font-bold font-headline">Pending Protocol Review</h3>
             <p className="text-sm text-slate-500">3 SOS alerts require command validation before deployment.</p>
           </div>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
          Initialize Full Secure Protocol
        </button>
      </div>
      {/* Confirmation Modal */}
      {confirmDispatchId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl"
          >
            <div className="w-16 h-16 bg-blue-100 text-primary-sentinel rounded-2xl flex items-center justify-center mb-6">
              <Navigation size={32} />
            </div>
            <h3 className="text-2xl font-black font-headline text-slate-900 mb-2">Confirm Dispatch</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to deploy an emergency response unit to <span className="font-bold text-slate-900">{confirmDispatchId.location}</span> for <span className="font-bold text-slate-900">{confirmDispatchId.reporter}</span>?
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDispatchId(null)}
                className="flex-1 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all hover:text-slate-600"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDispatch(confirmDispatchId.id, confirmDispatchId.reporter)}
                className="flex-1 py-4 bg-primary-sentinel text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-sentinel-dark shadow-xl shadow-blue-200 transition-all scale-105 active:scale-95"
              >
                Confirm Dispatch
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
