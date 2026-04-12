
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useProfile, UserProfile } from '@/hooks/useProfile';
import { useSleepProfile } from '@/hooks/useSleepProfile';

interface OnboardingFormProps {
  onComplete: () => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const { createProfile } = useProfile();
  const { createProfile: createSleepProfile } = useSleepProfile();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    age: '',
    gender: '',
    hobbies: '',
    problems: '',
    sleepTime: '22:00',
    wakeTime: '07:00'
  });

  const handleNextStep = () => {
    if (step === 1) {
      if (!profile.name || !profile.age || !profile.gender) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields (Name, Age, Gender).",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.sleepTime || !profile.wakeTime) {
      toast({
        title: "Missing Information",
        description: "Please set your sleep schedule.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create user profile
      await createProfile({
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        hobbies: profile.hobbies,
        problems: profile.problems,
        username: profile.username || undefined
      });

      // Create sleep profile
      await createSleepProfile(profile.sleepTime, profile.wakeTime);

      toast({
        title: "Profile Created! 🎉",
        description: "Welcome to Zenith AI! Your personalized experience is ready.",
      });
      onComplete();
    } catch (error: any) {
      toast({
        title: "Error Creating Profile",
        description: error.message || "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenith-softpurple to-white p-2 sm:p-4">
      <Card className="w-full max-w-2xl mx-2 sm:mx-4 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-zenith-darkpurple mb-2">
            Welcome to Zenith AI! 🌟
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm sm:text-base px-2">
            {step === 1 
              ? "Let's personalize your mental wellness journey. Tell us a bit about yourself."
              : "Set up your sleep schedule for better wellness tracking and reminders."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
              <Input
                id="name"
                placeholder="What should we call you?"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username (for community posts)</Label>
              <Input
                id="username"
                placeholder="Choose a unique username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                className="border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20"
              />
              <p className="text-xs text-muted-foreground">This will be shown on your community posts and characters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  required
                  className="border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">Gender *</Label>
                <Select onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                  <SelectTrigger className="border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-sm font-medium">Hobbies & Interests</Label>
              <Textarea
                id="hobbies"
                placeholder="What do you enjoy doing? (e.g., reading, sports, music, cooking...)"
                value={profile.hobbies}
                onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                className="min-h-[60px] sm:min-h-[80px] border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problems" className="text-sm font-medium">Areas you'd like support with</Label>
              <Textarea
                id="problems"
                placeholder="What challenges or concerns would you like help with? (e.g., stress, anxiety, sleep, relationships...)"
                value={profile.problems}
                onChange={(e) => setProfile({ ...profile, problems: e.target.value })}
                className="min-h-[80px] sm:min-h-[100px] border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20 resize-none"
              />
            </div>

              <Button 
                type="submit"
                className="w-full zenith-button-primary text-base sm:text-lg py-3 sm:py-4 font-semibold"
              >
                Continue to Sleep Schedule
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">
                  Help us send you timely sleep reminders and track your sleep patterns
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleepTime" className="text-sm font-medium">Sleep Time *</Label>
                <Input
                  id="sleepTime"
                  type="time"
                  value={profile.sleepTime}
                  onChange={(e) => setProfile({ ...profile, sleepTime: e.target.value })}
                  required
                  className="border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wakeTime" className="text-sm font-medium">Wake Time *</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={profile.wakeTime}
                  onChange={(e) => setProfile({ ...profile, wakeTime: e.target.value })}
                  required
                  className="border-gray-200 focus:border-zenith-primary focus:ring-zenith-primary/20"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 zenith-button-primary text-base sm:text-lg py-3 sm:py-4 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    'Complete Setup 🚀'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
