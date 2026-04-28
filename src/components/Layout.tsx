import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  AlertCircle, 
  Map as MapIcon, 
  Megaphone, 
  Users, 
  Settings,
  Search,
  Lock,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Reports / Cases', icon: FileText, path: '/reports' },
    { name: 'SOS Alerts', icon: AlertCircle, path: '/sos' },
    { name: 'Map View', icon: MapIcon, path: '/map' },
    { name: 'Announcements', icon: Megaphone, path: '/announcements' },
    { name: 'Staff Management', icon: Users, path: '/staff' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar-sentinel flex flex-col z-[70] border-r border-slate-200 transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex flex-col gap-1">
          <h1 className="text-xl font-bold text-primary-sentinel font-headline">Digital Sentinel</h1>
          <p className="text-[0.6875rem] uppercase font-bold tracking-wider text-slate-500">Police Command Center</p>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={user ? item.path : '#'}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  return;
                }
                setIsSidebarOpen(false);
              }}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                !user && "opacity-40 cursor-not-allowed grayscale",
                isActive && user
                  ? "text-primary-sentinel font-bold border-r-4 border-primary-sentinel bg-white/50 scale-[0.98]" 
                  : "text-slate-500 hover:bg-slate-200"
              )}
            >
              <div className="relative">
                <item.icon size={20} />
                {!user && <Lock size={12} className="absolute -top-1 -right-1 text-slate-400 bg-white rounded-full p-0.5" />}
              </div>
              <span className="text-sm font-body">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          {user ? (
            <>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors mb-4"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJRwukJEJ7kSUvzmG1J6bZbZ63mU18JQUDbaT1NQDkxK0W1ZADM2fGHuR4aOTKiPsPj6kxfVzdnSWSt4w3rqSP_DCTjEwQUf6ZuhKKuz-FMptgFsTsOTNv54ovnFxNZO0NbY95INLjly0R_B1jpTVykh0bI3Uc_wOlxAoxCiZscZxfzo0ItqFWEBH3QZi86UmbGlauYhafvkFLKxm-BpFnOxt_oqbEhRqp8x64KYOgKZu61YD5P9AM7Dy54XN_WRq0ndE36kSoE0jB" alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs font-bold truncate">Chief Officer</p>
                   <p className="text-[10px] text-slate-500 truncate">HQ Command</p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-center">
              <Lock size={20} className="mx-auto mb-2 text-slate-300" />
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Authentication Required</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 shadow-[0_10px_30px_-5px_rgba(18,28,42,0.04)]">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-black text-primary-sentinel-dark font-headline hidden sm:block">Crime Reporting Dashboard</h2>
            <div className="relative max-w-md w-full ml-4 hidden md:block">
              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2", !user ? "text-slate-300" : "text-slate-400")} size={16} />
              <input 
                type="text" 
                disabled={!user}
                placeholder={user ? "Search case files, officers, or locations..." : "Authentication required for global search..."}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all",
                  user ? "bg-slate-50 border-none focus:ring-2 focus:ring-slate-200" : "bg-slate-100/50 border border-slate-100 cursor-not-allowed text-slate-400 font-medium"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className={cn(
              "glass-badge px-3 py-1.5 rounded-full border flex items-center gap-2 transition-colors",
              user ? "border-teal-100" : "border-red-100 bg-red-50/50"
            )}>
              <Lock size={14} className={user ? "text-secondary-sentinel" : "text-red-500"} />
              <span className={cn(
                "text-[0.6rem] sm:text-[0.6875rem] font-bold tracking-wider uppercase whitespace-nowrap",
                user ? "text-secondary-sentinel" : "text-red-500"
              )}>
                {user ? "Secure System" : "System Locked"}
              </span>
            </div>
            <button 
              disabled={!user}
              className={cn(
                "p-2 transition-all relative",
                user ? "text-slate-500 hover:text-primary-sentinel" : "text-slate-300 cursor-not-allowed"
              )}
            >
              <Bell size={20} />
              {user && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
