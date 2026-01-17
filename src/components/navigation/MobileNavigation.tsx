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
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg z-50 border-t border-border/50">
      <div 
        className="flex justify-around items-center py-1.5 px-1"
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 min-w-0 flex-1 rounded-lg ${
              currentView === item.id 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 text-muted-foreground min-w-0 flex-1 rounded-lg"
          onClick={onAchievements}
        >
          <Trophy className="h-4 w-4" />
          <span className="text-[10px] font-medium">Rewards</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 text-muted-foreground min-w-0 flex-1 rounded-lg"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4" />
          <span className="text-[10px] font-medium">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
