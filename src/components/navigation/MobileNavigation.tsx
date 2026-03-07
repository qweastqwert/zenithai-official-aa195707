import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home,
  Brain,
  BookOpen,
  Flower2,
  Heart,
  Moon,
  Trophy,
  Settings
} from 'lucide-react';

interface MobileNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onSettings: () => void;
  onAchievements?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  currentView, 
  onNavigate, 
  onSettings,
  onAchievements 
}) => {
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'mindmate', icon: Brain, label: 'MindMate' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'meditation', icon: Flower2, label: 'Meditate' },
    { id: 'mood', icon: Heart, label: 'Mood' },
    { id: 'sleep', icon: Moon, label: 'Sleep' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg z-50 border-t border-border/30">
      <div 
        className="flex justify-around items-center py-1 px-0.5"
        style={{ paddingBottom: 'max(4px, env(safe-area-inset-bottom))' }}
      >
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-0 h-auto py-1 px-1.5 min-w-0 flex-1 rounded-xl ${
              currentView === item.id 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-[9px] font-medium leading-tight mt-0.5">{item.label}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-0 h-auto py-1 px-1.5 text-muted-foreground min-w-0 flex-1 rounded-xl"
          onClick={onAchievements}
        >
          <Trophy className="h-4 w-4" />
          <span className="text-[9px] font-medium leading-tight mt-0.5">Rewards</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-0 h-auto py-1 px-1.5 text-muted-foreground min-w-0 flex-1 rounded-xl"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4" />
          <span className="text-[9px] font-medium leading-tight mt-0.5">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
