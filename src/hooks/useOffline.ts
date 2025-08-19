
import { useState, useEffect } from 'react';
import { offlineManager } from '@/utils/offlineUtils';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(offlineManager.getIsOnline());

  useEffect(() => {
    const unsubscribe = offlineManager.onStatusChange((online) => {
      setIsOnline(online);
    });

    // Cache app resources on first load
    offlineManager.cacheAppResources();

    return unsubscribe;
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    isAIFeature: offlineManager.isAIFeature
  };
};
