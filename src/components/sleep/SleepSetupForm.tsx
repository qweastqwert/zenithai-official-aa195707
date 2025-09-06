import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSleepProfile } from '@/hooks/useSleepProfile';

interface SleepSetupFormProps {
  onComplete: () => void;
  isOnboarding?: boolean;
}

export const SleepSetupForm = ({ onComplete, isOnboarding = false }: SleepSetupFormProps) => {
  const { profile, createProfile, updateProfile, loading } = useSleepProfile();
  const [sleepTime, setSleepTime] = useState(profile?.sleep_time || '22:00');
  const [wakeTime, setWakeTime] = useState(profile?.wake_time || '07:00');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sleepTime || !wakeTime) {
      toast.error('Please fill in both sleep and wake times');
      return;
    }

    setSubmitting(true);

    try {
      const result = profile 
        ? await updateProfile(sleepTime, wakeTime)
        : await createProfile(sleepTime, wakeTime);

      if (result?.success) {
        toast.success(profile ? 'Sleep schedule updated!' : 'Sleep schedule saved!');
        onComplete();
      } else {
        toast.error('Failed to save sleep schedule');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isOnboarding ? 'Set Your Sleep Schedule' : 'Update Sleep Schedule'}
        </CardTitle>
        <CardDescription>
          {isOnboarding 
            ? 'Help us send you timely sleep reminders and track your sleep patterns'
            : 'Update your sleep and wake times for better tracking'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sleepTime">Sleep Time</Label>
            <Input
              id="sleepTime"
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wakeTime">Wake Time</Label>
            <Input
              id="wakeTime"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (profile ? 'Update Schedule' : 'Save Schedule')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};