import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  UserCircle, 
  CreditCard, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'admin', name: 'Admin', icon: Users },
  { id: 'clinical', name: 'Clinical', icon: Stethoscope },
  { id: 'patients', name: 'Patients', icon: UserCircle },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'settings', name: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                'sidebar-item w-full',
                item.active ? 'sidebar-item-active' : 'sidebar-item-inactive'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <span className="animate-fade-in truncate">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
};
