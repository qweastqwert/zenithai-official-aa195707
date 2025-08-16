
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
    <Card className="fixed bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-gray-200 dark:border-gray-700 dark:bg-gray-800/95">
      <div className="flex justify-around items-center py-1.5">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-0.5 h-auto py-1.5 px-2 ${
              currentView === item.id 
                ? 'text-zenith-primary bg-zenith-soft' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-0.5 h-auto py-1.5 px-2 text-gray-600 dark:text-gray-400"
          onClick={onAchievements}
        >
          <Trophy className="h-4 w-4" />
          <span className="text-xs font-medium">Rewards</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-0.5 h-auto py-1.5 px-2 text-gray-600 dark:text-gray-400"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4" />
          <span className="text-xs font-medium">Settings</span>
        </Button>
      </div>
    </Card>
  );
};

export default MobileNavigation;
