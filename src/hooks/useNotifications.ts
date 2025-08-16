
import { useState, useEffect } from 'react';
import { NotificationService, NotificationSettings } from '@/services/notificationService';

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enableMoodReminders: true,
    moodReminderInterval: 4,
    enableJournalReminders: true,
    journalReminderTime: '21:00'
  });

  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    setSettings(notificationService.getSettings());
  }, []);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    notificationService.updateSettings(newSettings);
  };

  const requestPermission = async () => {
    return await notificationService.requestPermission();
  };

  return {
    settings,
    updateSettings,
    requestPermission
  };
};
