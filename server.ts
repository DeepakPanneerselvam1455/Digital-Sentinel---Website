import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'police-secret-key-12345';

// Mock Data
const reports = [
  { id: 'CR-92831', type: 'Grand Theft Auto', live: true, status: 'In Investigation', priority: 'Urgent', time: '10-12-2023 23:14:02', description: 'Vehicle (Blue Sedan, Plate: KX-291) reported stolen from residential parking lot.' },
  { id: 'CR-92840', type: 'Narcotics Possession', live: true, status: 'Evidence Logged', priority: 'Medium', time: '10-11-2023 14:22:15', description: 'Suspected dealer apprehended with illicit substances.' },
  { id: 'CR-92812', type: 'Cyber Fraud', live: false, status: 'Resolved', priority: 'Low', time: '10-09-2023 09:10:44', description: 'Phishing campaign targeting local business employees.' },
];

const sosAlerts = [
  { id: 'SOS-9210', reporter: 'Elena Rodriguez', type: 'Citizen Reporter', location: '422 Oakwood Ave, Sector 4', status: 'Dispatch Pending', liveTime: '04:22', priority: 'Critical' },
  { id: 'SOS-9211', reporter: 'Mark Thompson', type: 'Business Owner', location: 'Northside Plaza, Entrance C', status: 'Silent Alarm', liveTime: '02:45', priority: 'Critical' },
];

const staff = [
  { id: '1024', name: 'Det. Marcus Thorne', rank: 'Detective Sgt.', role: 'Investigator', station: 'Central District HQ', status: 'Active', email: 'marcus.thorne@sentinel.pd' },
  { id: '9921', name: 'Insp. Elena Rodriguez', rank: 'Inspector', role: 'Admin', station: 'North Command', status: 'Active', email: 'e.rodriguez@sentinel.pd' },
  { id: '4302', name: 'Officer Julian Chen', rank: 'Officer', role: 'Operator', station: 'South Precinct', status: 'On Leave', email: 'j.chen@sentinel.pd' },
];

async function startServer() {
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // API Routes
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'Admin@police.com' && password === 'Police@100') {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('auth_token', token, { httpOnly: true, maxAge: 86400000 });
      return res.json({ success: true, user: { username } });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  });

  app.post('/api/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
  });

  app.get('/api/me', (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: decoded });
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

  // Protected Data Routes
  app.get('/api/reports', authenticate, (req, res) => res.json(reports));
  app.post('/api/reports', authenticate, (req, res) => {
    const newReport = {
      id: `CR-${Math.floor(Math.random() * 90000) + 10000}`,
      live: true,
      time: new Date().toLocaleString(),
      ...req.body
    };
    reports.unshift(newReport);
    res.json(newReport);
  });

  app.get('/api/sos', authenticate, (req, res) => res.json(sosAlerts));
  app.post('/api/sos/:id/dispatch', authenticate, (req, res) => {
    const alert = sosAlerts.find(a => a.id === req.params.id);
    if (alert) {
      alert.status = 'Unit Dispatched';
      return res.json(alert);
    }
    res.status(404).json({ error: 'Alert not found' });
  });

  app.get('/api/staff', authenticate, (req, res) => res.json(staff));
  app.post('/api/staff', authenticate, (req, res) => {
    const newStaff = {
      id: `${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Active',
      ...req.body
    };
    staff.unshift(newStaff);
    res.json(newStaff);
  });

  app.post('/api/announcements', authenticate, (req, res) => {
    res.json({ success: true, message: 'Broadcast sent to all units' });
  });

  app.post('/api/settings/terminate', authenticate, (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true, message: 'Sessions terminated' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
