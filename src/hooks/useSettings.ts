
import { useState, useEffect } from 'react';

interface Settings {
  enableSpeech: boolean;
  creativityLevel: number;
  responseLength: 'short' | 'medium' | 'long';
  toneStyle: 'friendly' | 'professional' | 'humorous' | 'motivational';
}

const defaultSettings: Settings = {
  enableSpeech: false,
  creativityLevel: 0.7,
  responseLength: 'medium',
  toneStyle: 'friendly'
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('zenith-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('zenith-settings', JSON.stringify(newSettings));
  };

  return {
    settings,
    updateSettings
  };
};
