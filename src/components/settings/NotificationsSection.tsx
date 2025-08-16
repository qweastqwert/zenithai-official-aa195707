
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Clock, BookOpen, Heart } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { NotificationService } from '@/services/notificationService';

const NotificationsSection = () => {
  const { settings, updateSettings, requestPermission } = useNotifications();
  const { toast } = useToast();

  const handlePermissionRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Notifications Enabled! 🔔",
        description: "You'll now receive wellness reminders.",
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings to receive reminders.",
        variant: "destructive",
      });
    }
  };

  const handleJournalTimeClick = () => {
    const notificationService = NotificationService.getInstance();
    notificationService.incrementJournalTestClick();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-blue-900 dark:text-blue-100">Enable Browser Notifications</span>
            <Button onClick={handlePermissionRequest} size="sm" variant="outline">
              Request Permission
            </Button>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Allow notifications to receive wellness reminders and mood check prompts.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Heart className="h-5 w-5 text-pink-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Mood Check Reminders</span>
                <Switch 
                  checked={settings.enableMoodReminders} 
                  onCheckedChange={(checked) => updateSettings({ enableMoodReminders: checked })}
                />
              </div>
              {settings.enableMoodReminders && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Every</span>
                  <Select 
                    value={settings.moodReminderInterval.toString()} 
                    onValueChange={(value) => updateSettings({ moodReminderInterval: parseInt(value) })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="1245">1245</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600 dark:text-gray-400">hours</span>
                  {settings.moodReminderInterval === 1245 && (
                    <span className="text-xs text-orange-600 dark:text-orange-400">(Test mode - 1 min)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <BookOpen className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Journal Reminders</span>
                <Switch 
                  checked={settings.enableJournalReminders} 
                  onCheckedChange={(checked) => updateSettings({ enableJournalReminders: checked })}
                />
              </div>
              {settings.enableJournalReminders && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Daily at</span>
                  <Input
                    type="time"
                    value={settings.journalReminderTime}
                    onChange={(e) => updateSettings({ journalReminderTime: e.target.value })}
                    onClick={handleJournalTimeClick}
                    className="w-24 cursor-pointer"
                    title="Click 10 times for test notification"
                  />
                  <span className="text-xs text-gray-500">(Click 10x for test)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;
