
export interface NotificationSettings {
  enableMoodReminders: boolean;
  moodReminderInterval: number; // in hours
  enableJournalReminders: boolean;
  journalReminderTime: string; // in HH:MM format
}

export class NotificationService {
  private static instance: NotificationService;
  private settings: NotificationSettings;
  private moodIntervalId: number | null = null;
  private journalTimeoutId: number | null = null;
  private journalClickCount: number = 0;

  private constructor() {
    this.settings = this.loadSettings();
    this.initializeNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private loadSettings(): NotificationSettings {
    const saved = localStorage.getItem('zenith-notification-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        console.log('🔔 Loaded notification settings:', settings);
        return settings;
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
    const defaultSettings = {
      enableMoodReminders: true,
      moodReminderInterval: 4,
      enableJournalReminders: true,
      journalReminderTime: '21:00'
    };
    console.log('🔔 Using default notification settings:', defaultSettings);
    return defaultSettings;
  }

  private saveSettings(): void {
    localStorage.setItem('zenith-notification-settings', JSON.stringify(this.settings));
    console.log('💾 Saved notification settings:', this.settings);
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission already granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('❌ Notification permission denied');
      return false;
    }

    try {
      console.log('🔔 Requesting notification permission...');
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      console.log(`🔔 Notification permission ${granted ? 'granted' : 'denied'}`);
      
      if (granted && 'serviceWorker' in navigator) {
        // Register service worker for notifications
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.error('SW registration failed:', err);
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private showNotification(title: string, body: string, tag: string): void {
    if (Notification.permission === 'granted') {
      console.log(`🔔 Showing notification: ${title}`);
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag,
        badge: '/favicon.ico'
      });

      notification.onclick = () => {
        console.log(`🔔 Notification clicked: ${tag}`);
        window.focus();
        if (tag === 'mood-reminder') {
          window.dispatchEvent(new CustomEvent('show-mood-tracker'));
        } else if (tag === 'journal-reminder') {
          window.dispatchEvent(new CustomEvent('show-journal'));
        }
        notification.close();
      };
    } else {
      console.log('🔔 Cannot show notification - permission not granted');
    }
  }

  private scheduleMoodReminders(): void {
    if (this.moodIntervalId) {
      clearInterval(this.moodIntervalId);
      console.log('🔔 Cleared previous mood reminder interval');
    }

    if (this.settings.enableMoodReminders) {
      // Testing mode: if interval is set to 1245, send notification in 1 minute
      if (this.settings.moodReminderInterval === 1245) {
        console.log('🔔 Mood reminder testing mode activated - notification in 1 minute');
        this.moodIntervalId = window.setTimeout(() => {
          this.showNotification(
            'Mood Check 💜 (Test)',
            'This is a test notification for mood tracking.',
            'mood-reminder'
          );
        }, 60000); // 1 minute
        return;
      }

      const intervalMs = this.settings.moodReminderInterval * 60 * 60 * 1000;
      console.log(`🔔 Scheduling mood reminders every ${this.settings.moodReminderInterval} hours (${intervalMs}ms)`);
      
      this.moodIntervalId = window.setInterval(() => {
        this.showNotification(
          'Mood Check 💜',
          'How are you feeling right now? Take a moment to track your mood.',
          'mood-reminder'
        );
      }, intervalMs);
    } else {
      console.log('🔔 Mood reminders disabled');
    }
  }

  private scheduleJournalReminder(): void {
    if (this.journalTimeoutId) {
      clearTimeout(this.journalTimeoutId);
      console.log('🔔 Cleared previous journal reminder timeout');
    }

    if (this.settings.enableJournalReminders) {
      const now = new Date();
      const [hours, minutes] = this.settings.journalReminderTime.split(':').map(Number);
      
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hours, minutes, 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilReminder = scheduledTime.getTime() - now.getTime();
      console.log(`🔔 Scheduling journal reminder at ${this.settings.journalReminderTime} (in ${Math.round(timeUntilReminder / 1000 / 60)} minutes)`);

      this.journalTimeoutId = window.setTimeout(() => {
        this.showNotification(
          'Evening Reflection 📝',
          "It's time for your daily journal. Reflect on your day and write down your thoughts.",
          'journal-reminder'
        );
        
        this.scheduleJournalReminder();
      }, timeUntilReminder);
    } else {
      console.log('🔔 Journal reminders disabled');
    }
  }

  incrementJournalTestClick(): void {
    this.journalClickCount++;
    console.log(`🔔 Journal test click count: ${this.journalClickCount}`);
    
    if (this.journalClickCount >= 10) {
      console.log('🔔 Journal reminder testing mode activated - notification in 1 minute');
      setTimeout(() => {
        this.showNotification(
          'Evening Reflection 📝 (Test)',
          'This is a test notification for journaling.',
          'journal-reminder'
        );
      }, 60000); // 1 minute
      
      // Reset counter
      this.journalClickCount = 0;
    }
  }

  updateSettings(newSettings: Partial<NotificationSettings>): void {
    console.log('🔔 Updating notification settings:', newSettings);
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.restartNotifications();
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  private restartNotifications(): void {
    console.log('🔔 Restarting notification services...');
    this.scheduleMoodReminders();
    this.scheduleJournalReminder();
  }

  private async initializeNotifications(): Promise<void> {
    console.log('🔔 Initializing notification service...');
    const hasPermission = await this.requestPermission();
    if (hasPermission) {
      this.scheduleMoodReminders();
      this.scheduleJournalReminder();
      console.log('🔔 Notification service initialized successfully');
    } else {
      console.log('🔔 Notification service initialized but permissions not granted');
    }
  }

  destroy(): void {
    console.log('🔔 Destroying notification service...');
    if (this.moodIntervalId) {
      clearInterval(this.moodIntervalId);
    }
    if (this.journalTimeoutId) {
      clearTimeout(this.journalTimeoutId);
    }
  }
}
