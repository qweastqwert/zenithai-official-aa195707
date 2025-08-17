
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MessageCircle, 
  Wind, 
  Heart, 
  Music, 
  Settings,
  Home,
  Users,
  BookOpen,
  Brain,
  Flower2,
  Trophy
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
    { id: 'mood', icon: Heart, label: 'Mood' }
  ];

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-gray-200 dark:border-gray-700 dark:bg-gray-800/95 border-t border-l-0 border-r-0 border-b-0 rounded-t-lg rounded-b-none">
      <div className="flex justify-around items-center py-2 px-1 safe-area-inset-bottom">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-1.5 min-w-0 flex-1 ${
              currentView === item.id 
                ? 'text-zenith-primary bg-zenith-soft' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium truncate">{item.label}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1 h-auto py-2 px-1.5 text-gray-600 dark:text-gray-400 min-w-0 flex-1"
          onClick={onAchievements}
        >
          <Trophy className="h-5 w-5" />
          <span className="text-xs font-medium truncate">Rewards</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1 h-auto py-2 px-1.5 text-gray-600 dark:text-gray-400 min-w-0 flex-1"
          onClick={onSettings}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs font-medium truncate">Settings</span>
        </Button>
      </div>
    </Card>
  );
};

export default MobileNavigation;
