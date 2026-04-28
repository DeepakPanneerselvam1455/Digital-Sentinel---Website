import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MapPin, 
  FileCheck, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const crimeData = [
  { name: 'Mon', crimes: 12 },
  { name: 'Tue', crimes: 19 },
  { name: 'Wed', crimes: 15 },
  { name: 'Thu', crimes: 22 },
  { name: 'Fri', crimes: 30 },
  { name: 'Sat', crimes: 28 },
  { name: 'Sun', crimes: 14 },
];

const categoryData = [
  { name: 'Theft', value: 40, color: '#00236f' },
  { name: 'Fraud', value: 30, color: '#1e3a8a' },
  { name: 'Drugs', value: 20, color: '#006b5f' },
  { name: 'Other', value: 10, color: '#64748b' },
];

import { storage, SEED_DATA } from '../lib/storage';

export default function Dashboard() {
  const stats = [
    { title: 'Active Units', value: '24', icon: MapPin, change: '+2', positive: true },
    { title: 'Pending Cases', value: '142', icon: FileCheck, change: '-4', positive: true },
    { title: 'Staff Online', value: '89', icon: Users, change: '+12%', positive: true },
    { title: 'SOS Alerts', value: '03', icon: AlertTriangle, change: '1 Urgent', positive: false },
  ];

  const [recentReports, setRecentReports] = React.useState<any[]>([]);

  React.useEffect(() => {
    // We use a small timeout to feel like a system check
    setTimeout(() => {
      const data = storage.get('sentinel_reports', SEED_DATA.reports);
      setRecentReports(Array.isArray(data) ? data.slice(0, 3) : []);
    }, 200);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Command Overview</p>
        <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Systems Operational</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-50 text-primary-sentinel rounded-2xl group-hover:bg-primary-sentinel group-hover:text-white transition-all">
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-teal-600' : 'text-red-500'}`}>
                {stat.change}
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-2 p-6 sm:p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold font-headline">Weekly Activity Log</h3>
              <p className="text-sm text-slate-400">Recorded cases and patrol interactions</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button className="px-4 py-2 text-xs font-bold bg-white rounded-lg shadow-sm">Cases</button>
              <button className="px-4 py-2 text-xs font-bold text-slate-500">Alerts</button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crimeData}>
                <defs>
                  <linearGradient id="colorCrimes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00236f" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00236f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="crimes" 
                  stroke="#00236f" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCrimes)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Board */}
        <div className="p-8 bg-primary-sentinel text-white rounded-[2.5rem] shadow-xl primary-gradient relative overflow-hidden flex flex-col">
          <div className="relative z-10">
            <h3 className="text-xl font-bold font-headline mb-1">Crime Spotlight</h3>
            <p className="text-sm text-blue-200 mb-8 font-medium">Major categories this month</p>
            
            <div className="space-y-6 flex-1">
              {categoryData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-blue-900/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className="h-full bg-blue-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-blue-300" size={18} />
                <span className="text-xs font-bold uppercase">Incident Peak Hour</span>
              </div>
              <h4 className="text-3xl font-black">23:00 - 02:00</h4>
              <p className="text-xs text-blue-300 mt-1">Based on historical 30-day data</p>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-blue-400/10 blur-3xl"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full bg-blue-600/20 blur-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <TrendingUp size={20} className="text-secondary-sentinel" />
              Units Efficiency
            </h3>
            <div className="h-[180px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Tooltip />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold font-headline">Recent System Reports</h3>
               <button onClick={() => window.location.href = '/reports'} className="text-xs font-bold text-primary-sentinel uppercase tracking-wider hover:underline">View All</button>
            </div>
            <div className="space-y-4">
               {recentReports.length > 0 ? recentReports.map((report) => (
                 <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-sentinel shadow-sm">
                          <FileCheck size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold">{report.id}: {report.type}</p>
                          <p className="text-xs text-slate-400">{report.time}</p>
                       </div>
                    </div>
                    <div className="text-xs font-bold px-3 py-1 bg-teal-100 text-teal-700 rounded-full sm:block hidden uppercase">{report.status}</div>
                 </div>
               )) : (
                 <p className="text-center py-8 text-slate-400 text-sm">No recent reports available.</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
