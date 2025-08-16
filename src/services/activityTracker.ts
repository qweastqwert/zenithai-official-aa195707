
import { useActivityTracker } from '@/hooks/useActivityTracker';

class ActivityTrackerService {
  private static instance: ActivityTrackerService;

  static getInstance(): ActivityTrackerService {
    if (!ActivityTrackerService.instance) {
      ActivityTrackerService.instance = new ActivityTrackerService();
    }
    return ActivityTrackerService.instance;
  }

  trackMindMateUsage() {
    console.log('🧠 Tracking MindMate usage');
    const event = new CustomEvent('track-activity', { detail: { type: 'mindmate' } });
    window.dispatchEvent(event);
  }

  trackJournalUsage() {
    console.log('✍️ Tracking Journal usage');
    const event = new CustomEvent('track-activity', { detail: { type: 'journal' } });
    window.dispatchEvent(event);
  }

  trackMoodUsage() {
    console.log('💝 Tracking Mood usage');
    const event = new CustomEvent('track-activity', { detail: { type: 'mood' } });
    window.dispatchEvent(event);
  }

  trackMeditationUsage() {
    console.log('🧘 Tracking Meditation usage');
    const event = new CustomEvent('track-activity', { detail: { type: 'meditation' } });
    window.dispatchEvent(event);
  }

  trackBreathingUsage() {
    console.log('🌬️ Tracking Breathing usage');
    const event = new CustomEvent('track-activity', { detail: { type: 'breathing' } });
    window.dispatchEvent(event);
  }
}

export default ActivityTrackerService;
