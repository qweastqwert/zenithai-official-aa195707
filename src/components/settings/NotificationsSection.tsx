import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, Clock, BookOpen, Heart, AlertCircle, Moon, Smile } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMoodPromptFrequency } from '@/hooks/useMoodPromptFrequency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NotificationsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getSettings, updateFrequency } = useMoodPromptFrequency();
  const [moodFrequency, setMoodFrequency] = useState<'low' | 'medium' | 'high'>(() => getSettings().frequency);
  const [prefs, setPrefs] = useState({
    mood_reminder_time: '09:00',
    journal_reminder_time: '21:00',
    sleep_reminder_enabled: true,
    push_enabled: true,
  });

  useEffect(() => {
    if (!user) return;
    const loadPrefs = async () => {
      const { data } = await supabase.from('notification_preferences')
        .select('*').eq('user_id', user.id).maybeSingle();
      if (data) {
        setPrefs({
          mood_reminder_time: data.mood_reminder_time || '09:00',
          journal_reminder_time: data.journal_reminder_time || '21:00',
          sleep_reminder_enabled: data.sleep_reminder_enabled ?? true,
          push_enabled: data.push_enabled ?? true,
        });
      }
    };
    loadPrefs();
  }, [user]);

  const savePrefs = async (updates: Partial<typeof prefs>) => {
    const newPrefs = { ...prefs, ...updates };
    setPrefs(newPrefs);
    if (!user) return;
    
    await supabase.from('notification_preferences').upsert({
      user_id: user.id,
      ...newPrefs,
    }, { onConflict: 'user_id' });
  };

  const handlePermissionRequest = async () => {
    if (!('Notification' in window)) {
      toast({ title: "Not Supported", description: "Your browser doesn't support notifications.", variant: "destructive" });
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast({ title: "Notifications Enabled! 🔔", description: "You'll receive wellness reminders at your set times." });
      
      // Try to subscribe to push
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
        }).catch(() => null);
        
        if (subscription && user) {
          await supabase.functions.invoke('push-notifications', {
            body: { action: 'subscribe', subscription: subscription.toJSON() }
          });
        }
      } catch (e) {
        console.log('Push subscription not available, using local notifications');
      }
    } else {
      toast({ title: "Permission Denied", description: "Please enable notifications in your browser settings.", variant: "destructive" });
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
                <p className="text-xs text-muted-foreground">Get reminded to check in with yourself</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button onClick={handlePermissionRequest} size="sm" variant="outline">Enable</Button>
              <Button
                onClick={async () => {
                  const { data, error } = await supabase.functions.invoke('push-notifications', {
                    body: { action: 'test-push' }
                  });
                  if (error || (data as any)?.error) {
                    toast({ title: 'Test failed', description: (data as any)?.error || error?.message || 'Unknown error', variant: 'destructive' });
                  } else {
                    toast({ title: 'Test sent! 🔔', description: (data as any)?.message || 'Check your device.' });
                  }
                }}
                size="sm"
              >Test</Button>
            </div>
          </div>
        </div>

        {/* Mood Reminder Time */}
        <div className="p-3 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <Label className="text-sm font-medium">Mood Check-in</Label>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-6">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Remind me at</span>
            <Input
              type="time"
              value={prefs.mood_reminder_time}
              onChange={(e) => savePrefs({ mood_reminder_time: e.target.value })}
              className="w-24 h-8 text-xs"
            />
          </div>
        </div>

        {/* In-App Mood Prompt Frequency */}
        <div className="p-3 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-amber-500" />
              <Label className="text-sm font-medium">Mood Pop-up Frequency</Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pl-6">
            How often the mood check-in appears while you use the app.
          </p>
          <div className="pl-6">
            <Select
              value={moodFrequency}
              onValueChange={(v: 'low' | 'medium' | 'high') => {
                setMoodFrequency(v);
                updateFrequency(v);
                toast({ title: 'Frequency updated', description: `Mood prompt set to ${v} (${v === 'low' ? '~8h' : v === 'medium' ? '~4h' : '~2h'}).` });
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Frequent — every ~2 hours</SelectItem>
                <SelectItem value="medium">Balanced — every ~4 hours</SelectItem>
                <SelectItem value="low">Gentle — every ~8 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Journal Reminder Time */}
        <div className="p-3 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-medium">Daily Journal Reminder</Label>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-6">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Remind me at</span>
            <Input
              type="time"
              value={prefs.journal_reminder_time}
              onChange={(e) => savePrefs({ journal_reminder_time: e.target.value })}
              className="w-24 h-8 text-xs"
            />
          </div>
        </div>

        {/* Sleep Reminder */}
        <div className="p-3 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              <Label className="text-sm font-medium">Sleep Reminder</Label>
            </div>
            <Switch
              checked={prefs.sleep_reminder_enabled}
              onCheckedChange={(checked) => savePrefs({ sleep_reminder_enabled: checked })}
            />
          </div>
          <p className="text-xs text-muted-foreground pl-6">
            Uses your sleep time from Sleep Tracker settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;
