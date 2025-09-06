import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon } from 'lucide-react';
import { SleepSetupForm } from './SleepSetupForm';

interface SleepPromptProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const SleepPrompt = ({ onComplete, onSkip }: SleepPromptProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Moon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Sleep Tracking Setup</CardTitle>
          <CardDescription>
            Complete your profile with sleep tracking to get personalized wellness insights and reminders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SleepSetupForm onComplete={onComplete} isOnboarding={false} />
          <div className="text-center">
            <Button variant="ghost" onClick={onSkip} className="text-sm">
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};