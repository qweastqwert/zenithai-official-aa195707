
export interface NotificationSettings {
  enableMoodReminders: boolean;
  moodReminderInterval: number; // in hours
  enableJournalReminders: boolean;
  journalReminderTime: string; // in HH:MM format
  enableSleepReminders: boolean;
  sleepTime: string; // HH:MM
  wakeTime: string; // HH:MM
}

export class NotificationService {
  private static instance: NotificationService;
  private settings: NotificationSettings;
  private moodIntervalId: number | null = null;
  private journalTimeoutId: number | null = null;
  private sleepTimeoutId: number | null = null;
  private wakeTimeoutId: number | null = null;

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
        return { ...this.getDefaults(), ...JSON.parse(saved) };
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
    return this.getDefaults();
  }

  private getDefaults(): NotificationSettings {
    return {
      enableMoodReminders: true,
      moodReminderInterval: 4,
      enableJournalReminders: true,
      journalReminderTime: '21:00',
      enableSleepReminders: true,
      sleepTime: '23:00',
      wakeTime: '07:00'
    };
  }

  private saveSettings(): void {
    localStorage.setItem('zenith-notification-settings', JSON.stringify(this.settings));
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      if (granted && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('/sw.js').catch(err => {
          console.error('SW registration failed:', err);
          return null;
        });
        
        // Subscribe to push with VAPID key if available
        if (reg) {
          await this.subscribeToPush(reg);
        }
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private async subscribeToPush(registration: ServiceWorkerRegistration): Promise<void> {
    try {
      // Fetch VAPID public key from edge function
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase.functions.invoke('push-notifications', {
        body: { action: 'get-vapid-key' }
      });
      
      if (!data?.publicKey) {
        console.warn('No VAPID public key available');
        return;
      }

      const applicationServerKey = this.urlBase64ToUint8Array(data.publicKey);
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer
      });

      // Send subscription to server
      const subJson = subscription.toJSON();
      await supabase.functions.invoke('push-notifications', {
        body: {
          action: 'subscribe',
          subscription: {
            endpoint: subJson.endpoint,
            keys: subJson.keys
          }
        }
      });
      
      console.log('Push subscription registered successfully');
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private showNotification(title: string, body: string, tag: string): void {
    if (Notification.permission !== 'granted') return;

    // Try SW-based notification first (works when tab is in background)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png',
          badge: '/favicon.ico',
          tag,
        });
      }).catch(() => {
        // Fallback to regular notification
        this.showFallbackNotification(title, body, tag);
      });
    } else {
      this.showFallbackNotification(title, body, tag);
    }
  }

  private showFallbackNotification(title: string, body: string, tag: string): void {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag,
      badge: '/favicon.ico'
    });

    notification.onclick = () => {
      window.focus();
      if (tag === 'mood-reminder') {
        window.dispatchEvent(new CustomEvent('show-mood-tracker'));
      } else if (tag === 'journal-reminder') {
        window.dispatchEvent(new CustomEvent('show-journal'));
      }
      notification.close();
    };
  }

  private scheduleMoodReminders(): void {
    if (this.moodIntervalId) clearInterval(this.moodIntervalId);

    if (this.settings.enableMoodReminders) {
      const intervalMs = this.settings.moodReminderInterval * 60 * 60 * 1000;
      
      this.moodIntervalId = window.setInterval(() => {
        this.showNotification(
          'Mood Check 💜',
          'How are you feeling right now? Take a moment to track your mood.',
          'mood-reminder'
        );
      }, intervalMs);
    }
  }

  private scheduleJournalReminder(): void {
    if (this.journalTimeoutId) clearTimeout(this.journalTimeoutId);

    if (this.settings.enableJournalReminders) {
      const timeUntil = this.getTimeUntil(this.settings.journalReminderTime);
      
      this.journalTimeoutId = window.setTimeout(() => {
        this.showNotification(
          'Evening Reflection 📝',
          "It's time for your daily journal. Reflect on your day.",
          'journal-reminder'
        );
        this.scheduleJournalReminder(); // reschedule for next day
      }, timeUntil);
    }
  }

  private scheduleSleepReminders(): void {
    if (this.sleepTimeoutId) clearTimeout(this.sleepTimeoutId);
    if (this.wakeTimeoutId) clearTimeout(this.wakeTimeoutId);

    if (this.settings.enableSleepReminders) {
      // Schedule bedtime reminder (15 min before sleep time)
      const sleepMs = this.getTimeUntil(this.settings.sleepTime) - 15 * 60 * 1000;
      const sleepDelay = sleepMs > 0 ? sleepMs : sleepMs + 24 * 60 * 60 * 1000;
      
      this.sleepTimeoutId = window.setTimeout(() => {
        this.showNotification(
          'Time to Wind Down 🌙',
          'Bedtime is in 15 minutes. Start your sleep routine!',
          'sleep-reminder'
        );
        this.scheduleSleepReminders(); // reschedule
      }, sleepDelay);

      // Schedule wake-up reminder
      const wakeMs = this.getTimeUntil(this.settings.wakeTime);
      
      this.wakeTimeoutId = window.setTimeout(() => {
        this.showNotification(
          'Good Morning ☀️',
          'How did you sleep? Log your sleep quality.',
          'wake-reminder'
        );
        this.scheduleSleepReminders(); // reschedule
      }, wakeMs);
    }
  }

  private getTimeUntil(timeStr: string): number {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target.getTime() - now.getTime();
  }

  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.restartNotifications();
  }

  // Called externally when sleep profile is loaded/updated
  updateSleepTimes(sleepTime: string, wakeTime: string): void {
    this.settings.sleepTime = sleepTime;
    this.settings.wakeTime = wakeTime;
    this.settings.enableSleepReminders = true;
    this.saveSettings();
    this.scheduleSleepReminders();
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  private restartNotifications(): void {
    this.scheduleMoodReminders();
    this.scheduleJournalReminder();
    this.scheduleSleepReminders();
  }

  private async initializeNotifications(): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (hasPermission) {
      this.restartNotifications();
    }
  }

  destroy(): void {
    if (this.moodIntervalId) clearInterval(this.moodIntervalId);
    if (this.journalTimeoutId) clearTimeout(this.journalTimeoutId);
    if (this.sleepTimeoutId) clearTimeout(this.sleepTimeoutId);
    if (this.wakeTimeoutId) clearTimeout(this.wakeTimeoutId);
  }
}
