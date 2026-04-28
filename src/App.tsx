/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import SOSAlerts from './pages/SOSAlerts';
import MapView from './pages/MapView';
import StaffManagement from './pages/StaffManagement';
import Announcements from './pages/Announcements';
import Settings from './pages/Settings';
import { ShieldAlert } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/sos" element={<PrivateRoute><SOSAlerts /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><MapView /></PrivateRoute>} />
          <Route path="/staff" element={<PrivateRoute><StaffManagement /></PrivateRoute>} />
          <Route path="/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          
          {/* Fallback for within layout */}
          <Route path="*" element={
            <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Module Under Construction</h3>
                <p className="text-slate-400 text-sm">Target system module is currently being encrypted and deployed.</p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
