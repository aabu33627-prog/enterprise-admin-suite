import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export type ModuleType = 'dashboard' | 'admin' | 'clinical' | 'patient' | 'billing' | 'reports';

export interface SidebarMenuItem {
  id: string;
  name: string;
  path: string;
  icon: string;
}

export interface ModuleConfig {
  id: ModuleType;
  name: string;
  menuItems: SidebarMenuItem[];
}

const moduleConfigs: Record<ModuleType, ModuleConfig> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    menuItems: [
      { id: 'overview', name: 'Overview', path: '/dashboard', icon: 'LayoutDashboard' },
      { id: 'analytics', name: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
      { id: 'reports', name: 'Quick Reports', path: '/dashboard/reports', icon: 'FileText' },
    ],
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    menuItems: [
      { id: 'users', name: 'User Management', path: '/admin/users', icon: 'Users' },
      { id: 'roles', name: 'Roles & Permissions', path: '/admin/roles', icon: 'Shield' },
      { id: 'settings', name: 'System Settings', path: '/admin/settings', icon: 'Settings' },
      { id: 'masters', name: 'Master Data', path: '/admin/masters', icon: 'Database' },
    ],
  },
  clinical: {
    id: 'clinical',
    name: 'Clinical',
    menuItems: [
      { id: 'appointments', name: 'Appointments', path: '/clinical/appointments', icon: 'Calendar' },
      { id: 'consultations', name: 'Consultations', path: '/clinical/consultations', icon: 'Stethoscope' },
      { id: 'prescriptions', name: 'Prescriptions', path: '/clinical/prescriptions', icon: 'FileText' },
      { id: 'lab-orders', name: 'Lab Orders', path: '/clinical/lab-orders', icon: 'TestTube' },
    ],
  },
  patient: {
    id: 'patient',
    name: 'Patient',
    menuItems: [
      { id: 'list', name: 'List of Patients', path: '/patient', icon: 'Users' },
      { id: 'register', name: 'Register Patient', path: '/patient/add', icon: 'UserPlus' },
      { id: 'search', name: 'Search Patient', path: '/patient/search', icon: 'Search' },
    ],
  },
  billing: {
    id: 'billing',
    name: 'Billing',
    menuItems: [
      { id: 'invoices', name: 'Invoices', path: '/billing/invoices', icon: 'FileText' },
      { id: 'payments', name: 'Payments', path: '/billing/payments', icon: 'CreditCard' },
      { id: 'receipts', name: 'Receipts', path: '/billing/receipts', icon: 'Receipt' },
      { id: 'reports', name: 'Billing Reports', path: '/billing/reports', icon: 'BarChart3' },
    ],
  },
  reports: {
    id: 'reports',
    name: 'Reports',
    menuItems: [
      { id: 'patient-reports', name: 'Patient Reports', path: '/reports/patients', icon: 'Users' },
      { id: 'financial', name: 'Financial Reports', path: '/reports/financial', icon: 'DollarSign' },
      { id: 'clinical-reports', name: 'Clinical Reports', path: '/reports/clinical', icon: 'Activity' },
      { id: 'custom', name: 'Custom Reports', path: '/reports/custom', icon: 'FileSpreadsheet' },
    ],
  },
};

interface ModuleContextType {
  currentModule: ModuleType;
  setCurrentModule: (module: ModuleType) => void;
  moduleConfig: ModuleConfig;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [currentModule, setCurrentModule] = useState<ModuleType>('dashboard');
  const location = useLocation();

  // Auto-detect module based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/patient')) {
      setCurrentModule('patient');
    } else if (path.startsWith('/admin')) {
      setCurrentModule('admin');
    } else if (path.startsWith('/clinical')) {
      setCurrentModule('clinical');
    } else if (path.startsWith('/billing')) {
      setCurrentModule('billing');
    } else if (path.startsWith('/reports')) {
      setCurrentModule('reports');
    } else if (path.startsWith('/dashboard')) {
      setCurrentModule('dashboard');
    }
  }, [location.pathname]);

  const moduleConfig = moduleConfigs[currentModule];

  return (
    <ModuleContext.Provider value={{ currentModule, setCurrentModule, moduleConfig }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule must be used within a ModuleProvider');
  }
  return context;
};
