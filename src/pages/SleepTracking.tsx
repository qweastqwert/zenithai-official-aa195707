import React from 'react';
import { SleepTracker } from '@/components/sleep/SleepTracker';
import { WarmBackground } from '@/components/ui/WarmBackground';
import SEO from '@/components/SEO';

const SleepTrackingPage = () => {
  return (
    <WarmBackground variant="dusk">
      <SEO
        title="Sleep Tracking — Zenith AI"
        description="Track your sleep schedule and quality, view trends, and improve rest with personalized insights."
        path="/sleep-tracking"
      />
      <SleepTracker />
    </WarmBackground>
  );
};

export default SleepTrackingPage;