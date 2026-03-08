import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, Clock, BookOpen, Heart, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

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
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reminders</h3>
      </div>

      <div className="space-y-4">
        {/* Permission Request */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-sm">Browser Notifications</span>
                <p className="text-xs text-muted-foreground">
                  Get reminded to check in with yourself
                </p>
              </div>
            </div>
            <Button onClick={handlePermissionRequest} size="sm" variant="outline" className="flex-shrink-0">
              Enable
            </Button>
          </div>
        </div>

        {/* Mood Reminders */}
        <div className="p-3 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <Label className="text-sm font-medium">Mood Check-ins</Label>
            </div>
            <Switch 
              checked={settings.enableMoodReminders} 
              onCheckedChange={(checked) => updateSettings({ enableMoodReminders: checked })}
            />
          </div>
          
          {settings.enableMoodReminders && (
            <div className="flex items-center gap-2 pl-6">
              <span className="text-xs text-muted-foreground">Remind me every</span>
              <Select 
                value={settings.moodReminderInterval.toString()} 
                onValueChange={(value) => updateSettings({ moodReminderInterval: parseInt(value) })}
              >
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Journal Reminders */}
        <div className="p-3 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-medium">Daily Journal Reminder</Label>
            </div>
            <Switch 
              checked={settings.enableJournalReminders} 
              onCheckedChange={(checked) => updateSettings({ enableJournalReminders: checked })}
            />
          </div>
          
          {settings.enableJournalReminders && (
            <div className="flex items-center gap-2 pl-6">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Remind me at</span>
              <Input
                type="time"
                value={settings.journalReminderTime}
                onChange={(e) => updateSettings({ journalReminderTime: e.target.value })}
                className="w-24 h-8 text-xs"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;
