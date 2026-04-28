
export type StorageKey = 'sentinel_reports' | 'sentinel_staff' | 'sentinel_sos';

export const storage = {
  get: <T>(key: StorageKey, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  },

  set: <T>(key: StorageKey, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  },

  // Helper to add item to list
  add: <T>(key: StorageKey, item: T): void => {
    const items = storage.get<T[]>(key, []);
    storage.set(key, [item, ...items]);
  },

  // Helper to update item in list
  update: <T extends { id: string | number }>(key: StorageKey, id: string | number, updates: Partial<T>): void => {
    const items = storage.get<T[]>(key, []);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      storage.set(key, items);
    }
  }
};

// Initial Data Seeds
export const SEED_DATA = {
  reports: [
    { id: 'CR-88291', type: 'Theft', priority: 'Medium', status: 'In Investigation', time: 'Today, 14:20', description: 'Suspect sighted near Sector 7 warehouse. Stolen electronics reported.', live: true },
    { id: 'CR-88290', type: 'Traffic', priority: 'Low', status: 'Closed', time: 'Today, 12:15', description: 'Minor collision on 5th Avenue. Units cleared the scene.', live: false },
    { id: 'CR-88289', type: 'Assault', priority: 'Urgent', status: 'In Investigation', time: 'Yesterday, 23:40', description: 'Emergency call from downtown transit hub. Suspect in custody.', live: false },
  ],
  staff: [
    { id: '1024', name: 'Officer Sarah Chen', rank: 'Sergeant', role: 'Field Operations', station: 'Downtown Central', status: 'Active', email: 's.chen@sentinel.pd' },
    { id: '2155', name: 'Detective Marcus Thorne', rank: 'Detective', role: 'Cyber Crimes', station: 'HQ Division', status: 'On Leave', email: 'm.thorne@sentinel.pd' },
    { id: '8821', name: 'Officer Elena Rodriguez', rank: 'Officer', role: 'Patrol', station: 'East Sector', status: 'Active', email: 'e.rodriguez@sentinel.pd' },
    { id: '3341', name: 'Chief Robert Sterling', rank: 'Inspector', role: 'Command', station: 'HQ Division', status: 'Active', email: 'r.sterling@sentinel.pd' },
  ],
  sos: [
    { id: 'SOS-1', priority: 'Critical', reporter: 'Civ-8820', location: '7th Crossway, Sector 2', status: 'Live Alert', time: '2m ago', pulse: true, coordinates: { x: 45, y: 30 } },
    { id: 'SOS-2', priority: 'High', reporter: 'Officer-112', location: 'Transit Hub Terminal A', status: 'Pending Rescue', time: '15m ago', pulse: false, coordinates: { x: 70, y: 65 } },
    { id: 'SOS-3', priority: 'Critical', reporter: 'Internal-Sys', location: 'Restricted Node 04', status: 'System Breach', time: '1h ago', pulse: false, coordinates: { x: 20, y: 80 } },
  ]
};
