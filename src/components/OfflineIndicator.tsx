
import React from 'react';
import { useOffline } from '@/hooks/useOffline';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const { isOnline } = useOffline();

  if (isOnline) {
    return null;
  }

  return (
    <Badge 
      variant="secondary" 
      className="fixed top-4 left-4 z-50 bg-orange-100 text-orange-800 border-orange-200"
    >
      <WifiOff className="h-3 w-3 mr-1" />
      Offline Mode
    </Badge>
  );
};

export default OfflineIndicator;
