import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  Search,
  Stethoscope, 
  Calendar,
  FileText,
  TestTube,
  CreditCard, 
  Receipt,
  BarChart3,
  DollarSign,
  Activity,
  FileSpreadsheet,
  Shield,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useModule } from '@/contexts/ModuleContext';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  UserPlus,
  Search,
  Stethoscope,
  Calendar,
  FileText,
  TestTube,
  CreditCard,
  Receipt,
  BarChart3,
  DollarSign,
  Activity,
  FileSpreadsheet,
  Shield,
  Settings,
  Database,
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleConfig } = useModule();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    if (path === '/patient' && location.pathname === '/patient') return true;
    if (path === '/patient/add' && location.pathname === '/patient/add') return true;
    if (path !== '/patient' && path !== '/patient/add' && location.pathname.startsWith(path)) return true;
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Module Title */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
            {moduleConfig.name}
          </h2>
        </div>
      )}

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {moduleConfig.menuItems.map((item) => {
            const IconComponent = iconMap[item.icon] || LayoutDashboard;
            const isActive = isActivePath(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'sidebar-item w-full',
                  isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                )}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                {isOpen && (
                  <span className="animate-fade-in truncate">{item.name}</span>
                )}
              </button>
            );
          })}
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
