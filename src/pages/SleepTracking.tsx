import React from 'react';
import { SleepTracker } from '@/components/sleep/SleepTracker';
import { WarmBackground } from '@/components/ui/WarmBackground';

const SleepTrackingPage = () => {
  return (
    <WarmBackground variant="dusk">
      <SleepTracker />
    </WarmBackground>
  );
};

export default SleepTrackingPage;