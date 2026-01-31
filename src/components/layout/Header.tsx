import { Menu, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsMenu } from '@/components/common/SettingsMenu';
import { AppSwitcher } from '@/components/common/AppSwitcher';
import { UserMenu } from '@/components/common/UserMenu';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 bg-primary flex items-center justify-between px-4 shadow-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-primary-foreground hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary-foreground hidden sm:inline">
            HealthCare Pro
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <SettingsMenu variant="header" />
        <AppSwitcher variant="header" />
        <UserMenu variant="header" />
      </div>
    </header>
  );
};
