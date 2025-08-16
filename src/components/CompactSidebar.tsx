
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
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompactSidebarProps {
  onNavigate: (destination: string) => void;
  onSettings: () => void;
}

const CompactSidebar: React.FC<CompactSidebarProps> = ({ onNavigate, onSettings }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', action: () => onNavigate('home') },
    { id: 'mindmate', icon: MessageCircle, label: 'MindMate', action: () => onNavigate('mindmate') },
    { id: 'achievements', icon: Trophy, label: 'Achievements', action: () => onNavigate('achievements') },
    { id: 'characters', icon: Users, label: 'Characters', action: () => onNavigate('characters') },
    { id: 'breathing', icon: Wind, label: 'Breathing', action: () => navigate('/breathing-exercises') },
    { id: 'mood', icon: Heart, label: 'Mood', action: () => navigate('/mood-tracking') },
    { id: 'music', icon: Music, label: 'Music', action: () => navigate('/soothing-music') },
    { id: 'settings', icon: Settings, label: 'Settings', action: onSettings },
  ];

  return (
    <Card className="fixed left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-12 md:w-16 py-2 md:py-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg">
      <div className="flex flex-col space-y-1 md:space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className="w-8 h-8 md:w-12 md:h-12 mx-auto touch-manipulation active:scale-95 hover:bg-zenith-softpurple transition-all duration-200"
            onClick={item.action}
            title={item.label}
          >
            <item.icon className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default CompactSidebar;
