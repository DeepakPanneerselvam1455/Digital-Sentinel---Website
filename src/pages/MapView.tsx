import React from 'react';
import { motion } from 'motion/react';
import { 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Crosshair, 
  MapPin,
  Shield,
  Activity,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function MapView() {
  const activeUnits = [
    { id: 'UNIT-04', type: 'Patrol', pos: { top: '30%', left: '45%' }, status: 'Moving' },
    { id: 'UNIT-12', type: 'K9', pos: { top: '65%', left: '20%' }, status: 'Stationary' },
    { id: 'UNIT-09', type: 'Response', pos: { top: '48%', left: '72%' }, status: 'Emergency' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Global Positioning</p>
          <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Fleet Deployment</h1>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           <button className="px-6 py-2.5 bg-primary-sentinel text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md">Street</button>
           <button className="px-6 py-2.5 text-slate-400 text-xs font-bold uppercase tracking-wider">Satellite</button>
           <button className="px-6 py-2.5 text-slate-400 text-xs font-bold uppercase tracking-wider">Terrain</button>
        </div>
      </header>

      <div className="flex-1 bg-slate-200 rounded-[3rem] border-4 border-white shadow-xl relative overflow-hidden">
        {/* Mock Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-80"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548345666-a57164883378?q=80&w=2670&auto=format&fit=crop")' }}
        />
        
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        {/* Live Units */}
        {activeUnits.map((unit) => (
          <motion.div
            key={unit.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute z-10 cursor-pointer group"
            style={{ top: unit.pos.top, left: unit.pos.left }}
          >
            <div className="relative">
               <div className={cn(
                 "w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-transform group-hover:scale-110",
                 unit.status === 'Emergency' ? 'bg-red-500 text-white' : 'bg-primary-sentinel text-white'
               )}>
                  <Navigation size={20} className={unit.status === 'Moving' ? 'animate-pulse' : ''} />
               </div>
               
               {/* Label */}
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex flex-col items-center">
                     <span>{unit.id} • {unit.type}</span>
                     <span className="text-blue-300 mt-1">{unit.status}</span>
                  </div>
               </div>

               {/* Ring pulse for emergency */}
               {unit.status === 'Emergency' && (
                 <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping -z-10"></div>
               )}
            </div>
          </motion.div>
        ))}

        {/* Map Controls */}
        <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-20">
          <button className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:text-primary-sentinel transition-all">
            <Layers size={24} />
          </button>
          <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
             <button className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-100"><Plus size={20} /></button>
             <button className="p-4 hover:bg-slate-50 transition-colors"><Minus size={20} /></button>
          </div>
          <button className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary-sentinel transition-all hover:scale-110">
            <Crosshair size={24} />
          </button>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-6">
           <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/50 shadow-2xl flex items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-teal-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Activity size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase">Live Operations</h4>
                    <p className="text-xs font-bold text-teal-600">Sync with HQ: 99% Precision</p>
                 </div>
              </div>
              
              <div className="flex flex-1 items-center gap-2 justify-end">
                 <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden max-w-[120px]">
                    <div className="w-[12%] h-full bg-primary-sentinel"></div>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coverage</span>
              </div>

              <div className="flex items-center gap-4 border-l border-slate-200 pl-10">
                 <div className="text-center">
                    <p className="text-lg font-black text-slate-900">12</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Units</p>
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-black text-slate-900">03</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Alerts</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
