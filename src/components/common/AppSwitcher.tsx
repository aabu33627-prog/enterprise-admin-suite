import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, UserCircle, CreditCard, FileText, LayoutGrid } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useModule, ModuleType } from '@/contexts/ModuleContext';

const modules: { id: ModuleType; name: string; icon: typeof Users; path: string; colorClass: string }[] = [
  { id: 'admin', name: 'Admin', icon: Users, path: '/admin', colorClass: 'text-primary' },
  { id: 'clinical', name: 'Clinical', icon: Stethoscope, path: '/clinical', colorClass: 'text-success' },
  { id: 'patient', name: 'Patient', icon: UserCircle, path: '/patient', colorClass: 'text-primary' },
  { id: 'billing', name: 'Billing', icon: CreditCard, path: '/billing', colorClass: 'text-warning' },
  { id: 'reports', name: 'Reports', icon: FileText, path: '/reports', colorClass: 'text-destructive' },
];

interface AppSwitcherProps {
  variant?: 'header' | 'default';
}

export const AppSwitcher = ({ variant = 'default' }: AppSwitcherProps) => {
  const navigate = useNavigate();
  const { setCurrentModule } = useModule();

  const handleModuleClick = (moduleId: ModuleType, path: string) => {
    setCurrentModule(moduleId);
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={variant === 'header' ? 'text-primary-foreground hover:bg-white/10' : ''}
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-3 bg-popover">
        <div className="grid grid-cols-3 gap-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module.id, module.path)}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className={`p-2 rounded-lg bg-accent group-hover:scale-110 transition-transform ${module.colorClass}`}>
                <module.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                {module.name}
              </span>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
