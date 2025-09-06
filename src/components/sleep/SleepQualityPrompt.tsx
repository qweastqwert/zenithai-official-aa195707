import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSleepLogs } from '@/hooks/useSleepLogs';

interface SleepQualityPromptProps {
  onComplete: () => void;
}

const qualityOptions = [
  { value: 'excellent', label: 'Excellent', description: 'Felt fully rested and refreshed' },
  { value: 'good', label: 'Good', description: 'Woke up feeling mostly rested' },
  { value: 'fair', label: 'Fair', description: 'Some rest but could be better' },
  { value: 'poor', label: 'Poor', description: 'Restless night, tired in the morning' },
  { value: 'terrible', label: 'Terrible', description: 'Very poor sleep, exhausted' }
];

export const SleepQualityPrompt = ({ onComplete }: SleepQualityPromptProps) => {
  const { logSleepQuality } = useSleepLogs();
  const [selectedQuality, setSelectedQuality] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedQuality) {
      toast.error('Please select your sleep quality');
      return;
    }

    setSubmitting(true);

    try {
      const result = await logSleepQuality(selectedQuality);
      
      if (result?.success) {
        toast.success('Sleep quality logged! Thank you 😊');
        onComplete();
      } else {
        toast.error('Failed to log sleep quality');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Good Morning! ☀️</CardTitle>
        <CardDescription>
          How well did you sleep last night?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedQuality} onValueChange={setSelectedQuality}>
          {qualityOptions.map((option) => (
            <div key={option.value} className="flex items-start space-x-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="flex gap-2">
          <Button 
            onClick={onComplete} 
            variant="outline" 
            className="flex-1"
            disabled={submitting}
          >
            Skip
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1"
            disabled={submitting || !selectedQuality}
          >
            {submitting ? 'Logging...' : 'Log Sleep Quality'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};