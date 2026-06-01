import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home,
  Brain,
  BookOpen,
  Flower2,
  Heart,
  Moon,
  Trophy,
  Settings,
  Wind,
  MoreHorizontal
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
  const [moreOpen, setMoreOpen] = useState(false);

  // 4 primary destinations + Home so we never squish more than 5 items in the
  // bottom bar. Everything else lives in the "More" bottom sheet.
  const primaryItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'mindmate', icon: Brain, label: 'MindMate' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'mood', icon: Heart, label: 'Mood' },
  ];

  const moreItems: Array<{ id: string; icon: any; label: string; action: () => void }> = [
    { id: 'meditation', icon: Flower2, label: 'Meditate', action: () => onNavigate('meditation') },
    { id: 'breathing', icon: Wind, label: 'Breathing', action: () => onNavigate('breathing') },
    { id: 'sleep', icon: Moon, label: 'Sleep', action: () => onNavigate('sleep') },
    { id: 'rewards', icon: Trophy, label: 'Rewards', action: () => onAchievements?.() },
    { id: 'settings', icon: Settings, label: 'Settings', action: () => onSettings() },
  ];

  const handleMoreClick = (action: () => void) => {
    setMoreOpen(false);
    setTimeout(action, 80);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg z-50 border-t border-border/30">
        <div
          className="flex justify-around items-stretch px-1 pt-1"
          style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
        >
          {primaryItems.map((item) => {
            const active = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center justify-center gap-0.5 h-auto py-1.5 px-2 min-w-0 flex-1 rounded-2xl transition-all ${
                  active
                    ? 'text-primary bg-primary/10 scale-[1.02]'
                    : 'text-muted-foreground'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-tight max-[360px]:hidden">
                  {item.label}
                </span>
              </Button>
            );
          })}

          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center gap-0.5 h-auto py-1.5 px-2 min-w-0 flex-1 rounded-2xl text-muted-foreground"
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-tight max-[360px]:hidden">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-3xl pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
              <SheetHeader>
                <SheetTitle>More</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-3 pt-4">
                {moreItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMoreClick(item.action)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-muted/40 hover:bg-muted/60 active:scale-95 transition py-4 px-2"
                  >
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
