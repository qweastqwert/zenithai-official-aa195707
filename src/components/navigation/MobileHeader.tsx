
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  rightAction?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onSettings,
  rightAction
}) => {
  return (
    <div 
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/30"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 min-h-[48px]">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {showBack && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1.5 -ml-1.5 flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-base font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          {rightAction}
          {onSettings && (
            <Button variant="ghost" size="sm" onClick={onSettings} className="p-1.5">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
