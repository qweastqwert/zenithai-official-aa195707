
import { useCallback } from 'react';
import ActivityTrackerService from '@/services/activityTracker';

export const useActivityLogger = () => {
  const activityTracker = ActivityTrackerService.getInstance();

  const logMindMateUsage = useCallback(() => {
    activityTracker.trackMindMateUsage();
  }, [activityTracker]);

  const logJournalUsage = useCallback(() => {
    activityTracker.trackJournalUsage();
  }, [activityTracker]);

  const logMoodUsage = useCallback(() => {
    activityTracker.trackMoodUsage();
  }, [activityTracker]);

  const logMeditationUsage = useCallback(() => {
    activityTracker.trackMeditationUsage();
  }, [activityTracker]);

  const logBreathingUsage = useCallback(() => {
    activityTracker.trackBreathingUsage();
  }, [activityTracker]);

  return {
    logMindMateUsage,
    logJournalUsage,
    logMoodUsage,
    logMeditationUsage,
    logBreathingUsage
  };
};
