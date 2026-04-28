import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Activity,
  CheckCircle2,
  Circle,
  X,
  BadgeInfo
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { storage, SEED_DATA } from '../lib/storage';

interface Staff {
  id: string;
  name: string;
  rank: string;
  role: string;
  station: string;
  status: string;
  email: string;
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const [newStaff, setNewStaff] = useState({
    name: '',
    rank: 'Officer',
    role: 'Operator',
    station: 'Central District HQ',
    email: ''
  });

  const fetchStaff = async () => {
    setLoading(true);
    setTimeout(() => {
      const data = storage.get<Staff[]>('sentinel_staff', SEED_DATA.staff);
      if (localStorage.getItem('sentinel_staff') === null) {
        storage.set('sentinel_staff', SEED_DATA.staff);
      }
      setStaff(data);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return showToast('Please fill all fields', 'error');

    const personnel: Staff = {
      id: `${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Active',
      ...newStaff
    };

    storage.add('sentinel_staff', personnel);
    showToast('Personnel registered in local vault', 'success');
    setIsModalOpen(false);
    setNewStaff({ name: '', rank: 'Officer', role: 'Operator', station: 'Central District HQ', email: '' });
    fetchStaff();
  };

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Name', 'Rank', 'Role', 'Station', 'Status', 'Email'];
    const rows = staff.map(p => [p.id, p.name, p.rank, p.role, p.station, p.status, p.email]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "police_personnel.csv");
    document.body.appendChild(link);
    link.click();
    showToast('Staff list exported successfully', 'success');
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Personnel Division</p>
          <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Staff Management</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 primary-gradient text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} />
          Register Personnel
        </button>
      </header>

      <Toast {...toast} onClose={hideToast} />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-primary-sentinel rounded-xl flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Register Official</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleRegister} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                   <input 
                     type="text" 
                     value={newStaff.name}
                     onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all"
                     placeholder="Officer Name"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Rank</label>
                      <select 
                        value={newStaff.rank}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, rank: e.target.value }))}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all"
                      >
                         <option>Officer</option>
                         <option>Detective</option>
                         <option>Sergeant</option>
                         <option>Inspector</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                      <input 
                        type="email" 
                        value={newStaff.email}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all"
                        placeholder="official@sentinel.pd"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Station Assignment</label>
                   <input 
                     type="text" 
                     value={newStaff.station}
                     onChange={(e) => setNewStaff(prev => ({ ...prev, station: e.target.value }))}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all"
                   />
                </div>

                <button className="w-full primary-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all">
                  Onboard Personnel
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {[
           { label: 'Total Officers', value: '1,280', color: 'bg-blue-500' },
           { label: 'Active Duty', value: '942', color: 'bg-teal-500' },
           { label: 'Off Duty', value: '238', color: 'bg-slate-400' },
           { label: 'Medical Leave', value: '100', color: 'bg-amber-500' },
         ].map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm"
           >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                <div className={cn("w-1.5 h-6 rounded-full", stat.color)}></div>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name, badge ID, or rank..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-slate-100">
              <option>All Ranks</option>
              <option>Inspector</option>
              <option>Detective</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest">
                 <th className="px-8 py-4 text-left font-black">Personnel</th>
                 <th className="px-8 py-4 text-left font-black">Station & Role</th>
                 <th className="px-8 py-4 text-left font-black">Status</th>
                 <th className="px-8 py-4 text-left font-black">Security</th>
                 <th className="px-8 py-4 text-right font-black">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-8 py-4 animate-pulse">
                      <div className="h-10 bg-slate-50 rounded-xl"></div>
                    </td>
                  </tr>
                ))
              ) : (
                staff.map((p, i) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} alt={p.name} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{p.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{p.rank} • #{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-700">{p.station}</p>
                      <p className="text-xs text-slate-400">{p.role}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border w-fit",
                        p.status === 'Active' ? "border-teal-100 bg-teal-50 text-teal-600" : "border-slate-100 bg-slate-50 text-slate-500"
                      )}>
                        {p.status === 'Active' ? <Activity size={12} /> : <Circle size={12} />}
                        {p.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-400">
                       <Shield size={18} className="group-hover:text-primary-sentinel transition-colors" />
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
                          <MoreHorizontal size={20} />
                       </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
       <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
             <h3 className="text-3xl font-black font-headline tracking-tight">Duty Roster Updates</h3>
             <p className="text-slate-400 max-w-md font-medium">Automatic generation for next shift is pending. Review operational capacity before finalizing deployment orders.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={handleDownloadCSV}
               className="px-8 py-4 border-2 border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all focus:outline-none focus:ring-4 focus:ring-slate-200"
             >
               Download CSV
             </button>
             <button 
               onClick={() => showToast('Smart Roster generation sequence initiated...', 'info')}
               className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-100"
             >
               Generate Roster
             </button>
          </div>
       </div>
    </div>
  );
}
