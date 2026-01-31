import { Users, Stethoscope, UserCircle, CreditCard, FileText, LayoutGrid } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const modules = [
  { id: 'admin', name: 'Admin', icon: Users, color: 'text-blue-500' },
  { id: 'clinical', name: 'Clinical', icon: Stethoscope, color: 'text-green-500' },
  { id: 'patient', name: 'Patient', icon: UserCircle, color: 'text-purple-500' },
  { id: 'billing', name: 'Billing', icon: CreditCard, color: 'text-orange-500' },
  { id: 'reports', name: 'Reports', icon: FileText, color: 'text-red-500' },
];

interface AppSwitcherProps {
  variant?: 'header' | 'default';
}

export const AppSwitcher = ({ variant = 'default' }: AppSwitcherProps) => {
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
      <DropdownMenuContent align="end" className="w-56 p-3">
        <div className="grid grid-cols-3 gap-2">
          {modules.map((module) => (
            <button
              key={module.id}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className={`p-2 rounded-lg bg-accent group-hover:scale-110 transition-transform ${module.color}`}>
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
