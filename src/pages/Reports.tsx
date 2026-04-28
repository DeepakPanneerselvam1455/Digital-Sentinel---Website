import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  MoreVertical,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  FileText,
  Radio
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { storage, SEED_DATA } from '../lib/storage';

interface Report {
  id: string;
  type: string;
  live: boolean;
  status: string;
  priority: string;
  time: string;
  description: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const [newReport, setNewReport] = useState({
    type: 'Theft',
    priority: 'Medium',
    status: 'In Investigation',
    description: ''
  });

  const fetchReports = async () => {
    setLoading(true);
    // Simulate system response time
    setTimeout(() => {
      const data = storage.get<Report[]>('sentinel_reports', SEED_DATA.reports);
      // Ensure local storage is initialized with seeds if empty
      if (localStorage.getItem('sentinel_reports') === null) {
        storage.set('sentinel_reports', SEED_DATA.reports);
      }
      setReports(data);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.description) return showToast('Please enter a description', 'error');

    const report: Report = {
      id: `CR-${Math.floor(Math.random() * 90000) + 10000}`,
      live: true,
      time: new Date().toLocaleString(),
      ...newReport
    };

    storage.add('sentinel_reports', report);
    showToast('Report filed in local repository', 'success');
    setIsModalOpen(false);
    setNewReport({ type: 'Theft', priority: 'Medium', status: 'In Investigation', description: '' });
    fetchReports();
  };

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case 'urgent': return 'text-red-500 bg-red-50 border-red-100';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'low': return 'text-slate-500 bg-slate-50 border-slate-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (s: string) => {
    if (s.includes('Investigation')) return <Activity size={14} className="text-blue-600" />;
    if (s.includes('Resolved')) return <CheckCircle2 size={14} className="text-teal-600" />;
    return <Clock size={14} className="text-slate-500" />;
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Case Records</p>
          <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Incidents & Reports</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="primary-gradient text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
           <Activity size={18} />
           New Incident Report
        </button>
      </header>

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
                    <FileText size={20} />
                  </div>
                  <h3 className="text-xl font-bold font-headline">File New Incident</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Incident Type</label>
                    <select 
                      value={newReport.type}
                      onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all"
                    >
                      <option>Theft</option>
                      <option>Fraud</option>
                      <option>Narcotics</option>
                      <option>Assault</option>
                      <option>Traffic</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Priority Level</label>
                    <select 
                      value={newReport.priority}
                      onChange={(e) => setNewReport(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all"
                    >
                      <option>Urgent</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Incident Description</label>
                  <textarea 
                    value={newReport.description}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium h-32 focus:ring-4 focus:ring-blue-50 transition-all"
                    placeholder="Enter full details of the incident..."
                  />
                </div>

                <button className="w-full primary-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all">
                  Submit to Repository
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast {...toast} onClose={hideToast} />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by case ID, type, or officer..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-blue-50 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 h-[58px]">
          <button className="px-6 bg-white border border-slate-100 rounded-2xl text-slate-600 text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-6 bg-white border border-slate-100 rounded-2xl text-slate-600 text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50">
            Export JSON
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden lg:grid grid-cols-[140px_1fr_160px_160px_100px] gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[0.6875rem] font-black uppercase tracking-widest text-slate-400">
           <div>Case ID</div>
           <div>Type & Description</div>
           <div>Status</div>
           <div>Priority</div>
           <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100 divide-dashed">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-8 animate-pulse flex flex-col gap-4">
                   <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                   <div className="h-3 bg-slate-100 rounded w-full"></div>
                </div>
             ))
          ) : (
            reports.map((report, i) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "group transition-all cursor-pointer relative overflow-hidden",
                  report.live 
                    ? "bg-blue-50/40 hover:bg-blue-50/60 border-l-4 border-l-blue-500" 
                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                )}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr_160px_160px_100px] items-start lg:items-center gap-4 px-6 lg:px-8 py-6">
                   <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between">
                      <span className={cn(
                        "text-sm font-black",
                        report.live ? "text-blue-700" : "text-primary-sentinel"
                      )}>{report.id}</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 font-mono mt-1">{report.time.split(' ')[0]}</span>
                   </div>

                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {report.live && <Radio size={14} className="text-blue-500 animate-pulse" />}
                        <span className="text-sm font-bold text-slate-900">{report.type}</span>
                        {report.live && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                            Incoming
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs line-clamp-1",
                        report.live ? "text-blue-600/70 font-medium" : "text-slate-500"
                      )}>{report.description}</p>
                   </div>

                   <div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 bg-white shadow-sm inline-flex">
                        {getStatusIcon(report.status)}
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{report.status}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-2">
                      <div className={cn(
                        "px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider",
                        getPriorityColor(report.priority)
                      )}>
                        {report.priority}
                      </div>
                   </div>

                   <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary-sentinel hover:bg-white hover:shadow-sm rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-primary-sentinel hover:bg-white hover:shadow-sm rounded-lg transition-all lg:hidden">
                        <ChevronRight size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Showing {reports.length} critical cases</p>
        <div className="flex gap-2">
           <button className="px-4 py-2 text-xs font-bold text-slate-400 disabled:opacity-30" disabled>Previous</button>
           <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-xs font-black bg-primary-sentinel text-white rounded-lg">1</button>
              <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">2</button>
           </div>
           <button className="px-4 py-2 text-xs font-bold text-primary-sentinel">Next</button>
        </div>
      </div>
    </div>
  );
}
