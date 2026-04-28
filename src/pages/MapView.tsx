import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Crosshair, 
  MapPin,
  Activity,
  Zap,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Unit {
  id: string;
  type: string;
  pos: { x: number; y: number }; // Percentage 0-100
  status: 'Moving' | 'Stationary' | 'Emergency';
  heading: number;
}

const INITIAL_UNITS: Unit[] = [
  { id: 'UNIT-04', type: 'Patrol', pos: { x: 45, y: 30 }, status: 'Moving', heading: 45 },
  { id: 'UNIT-12', type: 'K9', pos: { x: 20, y: 65 }, status: 'Stationary', heading: 0 },
  { id: 'UNIT-09', type: 'Response', pos: { x: 72, y: 48 }, status: 'Emergency', heading: 120 },
  { id: 'UNIT-22', type: 'Patrol', pos: { x: 60, y: 20 }, status: 'Moving', heading: 180 },
  { id: 'UNIT-31', type: 'Air Support', pos: { x: 30, y: 80 }, status: 'Moving', heading: 270 },
];

export default function MapView() {
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  const [layers, setLayers] = useState({
    units: true,
    heatmap: false,
    traffic: false
  });
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  // Real-time Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits(prev => prev.map(unit => {
        if (unit.status === 'Stationary') return unit;
        
        const moveSpeed = unit.status === 'Emergency' ? 1.5 : 0.6;
        const driftX = (Math.random() - 0.5) * moveSpeed;
        const driftY = (Math.random() - 0.5) * moveSpeed;
        
        return {
          ...unit,
          pos: {
            x: Math.min(Math.max(unit.pos.x + driftX, 5), 95),
            y: Math.min(Math.max(unit.pos.y + driftY, 5), 95)
          },
          heading: unit.status === 'Moving' ? (unit.heading + (Math.random() - 0.5) * 15) : unit.heading
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Sync selected unit if it moves
  useEffect(() => {
    if (selectedUnit) {
      const updated = units.find(u => u.id === selectedUnit.id);
      if (updated) setSelectedUnit(updated);
    }
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter(u => {
      const matchesSearch = u.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'All' || u.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [units, searchQuery, filterStatus]);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const resetMap = () => {
    setZoom(1);
    setSearchQuery('');
    setFilterStatus('All');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Global Positioning</p>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black font-headline text-slate-900 tracking-tight">Fleet Deployment</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 text-teal-600 rounded-lg border border-teal-100 mb-[-10px] hidden lg:flex">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Live Transmission</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-sentinel transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search ID/Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-blue-50 outline-none w-40 sm:w-48 transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex items-center bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            {['All', 'Moving', 'Emergency'].map((status) => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all",
                  filterStatus === status 
                    ? "bg-slate-900 text-white shadow-lg" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div ref={containerRef} className="flex-1 bg-slate-200 rounded-[3rem] border-4 border-white shadow-2xl relative overflow-hidden cursor-crosshair">
        {/* Interaction Layer */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          animate={{ scale: zoom }}
          drag
          dragConstraints={containerRef}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        >
          {/* Mock Map Background */}
          <div 
            className="absolute inset-[-100%] bg-cover bg-center grayscale pointer-events-none"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548345666-a57164883378?q=80&w=2670&auto=format&fit=crop")' }}
          />

          {/* Heatmap Layer */}
          {layers.heatmap && (
            <div className="absolute inset-[-100%] bg-gradient-to-tr from-red-500/20 via-orange-500/10 to-transparent pointer-events-none mix-blend-overlay animate-pulse" />
          )}

          {/* Traffic Layer */}
          {layers.traffic && (
            <div className="absolute inset-[-100%] opacity-20 pointer-events-none">
               <div className="w-full h-1 bg-red-400 absolute top-1/4" />
               <div className="w-full h-1 bg-teal-400 absolute top-1/2" />
               <div className="w-1 h-full bg-orange-400 absolute left-1/3" />
            </div>
          )}
          
          {/* Map Grid Pattern */}
          <div className="absolute inset-[-100%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

          {/* Live Units */}
          <AnimatePresence>
            {layers.units && filteredUnits.map((unit) => (
              <motion.div
                key={unit.id}
                layoutId={unit.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  left: `${unit.pos.x}%`,
                  top: `${unit.pos.y}%`
                }}
                transition={{
                  left: { type: "tween", duration: 2, ease: "linear" },
                  top: { type: "tween", duration: 2, ease: "linear" },
                  scale: { type: "spring", stiffness: 300, damping: 25 }
                }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute z-10 group"
                style={{ translateX: '-50%', translateY: '-50%' }}
              >
                <div className="relative">
                   <motion.div 
                     onClick={(e) => {
                       e.stopPropagation();
                       setSelectedUnit(unit);
                     }}
                     className={cn(
                       "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all group-hover:scale-125 cursor-pointer",
                       unit.status === 'Emergency' ? 'bg-red-500 text-white animate-pulse' : 
                       unit.status === 'Moving' ? 'bg-blue-500 text-white' :
                       'bg-slate-700 text-white opacity-80',
                       selectedUnit?.id === unit.id && "ring-4 ring-blue-400 ring-offset-2 scale-125"
                     )}
                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                     style={{ transform: `rotate(${unit.heading}deg)` }}
                   >
                      {unit.status === 'Emergency' ? <Zap size={18} /> : 
                       unit.status === 'Moving' ? <Navigation size={18} /> :
                       <MapPin size={18} />}
                   </motion.div>
                   
                   {/* Tooltip on Click or Hover */}
                   <AnimatePresence>
                     {(selectedUnit?.id === unit.id) && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.8 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.8 }}
                         className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
                       >
                         <div className="bg-slate-900 border border-slate-700 text-white p-4 rounded-3xl shadow-2xl min-w-[200px] flex flex-col gap-3">
                           <div className="flex items-center justify-between">
                             <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{unit.type}</p>
                               <h5 className="text-sm font-black">{unit.id}</h5>
                             </div>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setSelectedUnit(null);
                               }}
                               className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
                             >
                               <EyeOff size={14} />
                             </button>
                           </div>
                           
                           <div className="h-px bg-slate-800" />
                           
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <p className="text-[8px] font-black text-slate-500 uppercase">Velocity</p>
                               <p className="text-xs font-bold">{unit.status === 'Stationary' ? '0' : unit.status === 'Emergency' ? '85' : '42'} km/h</p>
                             </div>
                             <div>
                               <p className="text-[8px] font-black text-slate-500 uppercase">Heading</p>
                               <p className="text-xs font-bold">{Math.round(unit.heading)}° N</p>
                             </div>
                           </div>

                           <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                             <p className="text-[8px] font-black text-blue-400 uppercase mb-0.5">Objective</p>
                             <p className="text-[10px] font-medium text-blue-100">Patrol Sector 7G • Alpha Response</p>
                           </div>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   {/* Hover simple label (only if not selected) */}
                   <div className={cn(
                     "absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none",
                     selectedUnit?.id === unit.id && "hidden"
                   )}>
                      <div className="bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl flex flex-col items-center">
                         <span>{unit.id} • {unit.type}</span>
                         <span className={cn(
                           "mt-1",
                           unit.status === 'Emergency' ? 'text-red-400' : 'text-blue-300'
                         )}>{unit.status}</span>
                      </div>
                   </div>

                   {/* Radial pulse */}
                   {unit.status === 'Emergency' && (
                     <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75 -z-10"></div>
                   )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Map UI Overlays */}
        <div className="absolute top-10 right-10 flex flex-col gap-3 z-30">
          <div className="relative">
            <button 
              onClick={() => setShowLayersMenu(!showLayersMenu)}
              className={cn(
                "w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center transition-all",
                showLayersMenu ? "bg-slate-900 text-white" : "bg-white text-slate-800 hover:text-primary-sentinel"
              )}
            >
              <Layers size={20} />
            </button>
            
            <AnimatePresence>
              {showLayersMenu && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-14 top-0 bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 min-w-[180px]"
                >
                  <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-3 px-2">Visualization Layers</p>
                  <div className="space-y-1">
                    {(Object.keys(layers) as Array<keyof typeof layers>).map(layer => (
                      <button 
                        key={layer}
                        onClick={() => setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left",
                          layers[layer] ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-[11px] capitalize">{layer}</span>
                        {layers[layer] ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
             <button onClick={() => handleZoom(0.2)} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-100"><Plus size={20} /></button>
             <button onClick={() => handleZoom(-0.2)} className="p-4 hover:bg-slate-50 transition-colors"><Minus size={20} /></button>
          </div>
          
          <button 
            onClick={resetMap}
            className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary-sentinel transition-all hover:scale-110 active:scale-95"
          >
            <Crosshair size={20} />
          </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-10 left-10 z-30 pointer-events-none hidden sm:block">
          <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl overflow-hidden min-w-[140px]">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-3">Live Feed</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <span className="text-[10px] font-bold text-white uppercase">Sector Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                <span className="text-[10px] font-bold text-white uppercase">Emergency Alpha</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Operations Center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-6 pointer-events-none">
           <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 pointer-events-auto">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg relative">
                    <Activity size={24} className="animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-white"></div>
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase leading-tight">Vector-4 Simulation</h4>
                    <p className="text-[10px] font-bold text-teal-600 tracking-tighter">Satellite Sync: Stable</p>
                 </div>
              </div>
              
              <div className="flex flex-1 items-center gap-6 border-l border-slate-100 pl-8">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Fleet</span>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-slate-900 leading-none">{units.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 mb-0.5">Units</span>
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency</span>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-red-600 leading-none">{units.filter(u => u.status === 'Emergency').length}</span>
                      <span className="text-[10px] font-bold text-red-400 mb-0.5">Active</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={resetMap}
                className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                 Recenter Command
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
