
import { getCookie, setCookie } from '@/utils/cookieUtils';

interface MoodPromptSettings {
  frequency: 'low' | 'medium' | 'high'; // 8h, 4h, 2h intervals
  lastPrompt: number;
  dismissed: number; // Track dismissals
}

export const useMoodPromptFrequency = () => {
  const SETTINGS_KEY = 'zenith-mood-prompt-settings';
  
  const getSettings = (): MoodPromptSettings => {
    try {
      const saved = getCookie(SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading mood prompt settings:', error);
    }
    
    // Default settings
    return {
      frequency: 'medium',
      lastPrompt: 0,
      dismissed: 0
    };
  };

  const saveSettings = (settings: MoodPromptSettings) => {
    setCookie(SETTINGS_KEY, JSON.stringify(settings), 30 * 24); // 30 days
  };

  const shouldShowPrompt = (): boolean => {
    const settings = getSettings();
    const now = Date.now();
    
    // Frequency intervals in milliseconds
    const intervals = {
      low: 8 * 60 * 60 * 1000,    // 8 hours
      medium: 4 * 60 * 60 * 1000, // 4 hours  
      high: 2 * 60 * 60 * 1000    // 2 hours
    };

    const interval = intervals[settings.frequency];
    const timeSinceLastPrompt = now - settings.lastPrompt;

    // Don't show if recently dismissed multiple times
    if (settings.dismissed >= 3) {
      return false;
    }

    return timeSinceLastPrompt >= interval;
  };

  const recordPromptShown = () => {
    const settings = getSettings();
    settings.lastPrompt = Date.now();
    settings.dismissed = 0; // Reset dismissal count on successful show
    saveSettings(settings);
  };

  const recordPromptDismissed = () => {
    const settings = getSettings();
    settings.dismissed += 1;
    settings.lastPrompt = Date.now();
    saveSettings(settings);
  };

  const updateFrequency = (frequency: 'low' | 'medium' | 'high') => {
    const settings = getSettings();
    settings.frequency = frequency;
    saveSettings(settings);
  };

  return {
    shouldShowPrompt,
    recordPromptShown,
    recordPromptDismissed,
    updateFrequency,
    getSettings
  };
};
