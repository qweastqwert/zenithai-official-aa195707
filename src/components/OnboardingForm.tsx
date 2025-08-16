
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useProfile, UserProfile } from '@/hooks/useProfile';

interface OnboardingFormProps {
  onComplete: () => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const { createProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    hobbies: '',
    problems: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name || !profile.age || !profile.gender) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Age, Gender).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createProfile(profile);
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
          <p className="text-gray-600 text-sm sm:text-base px-2">
            Let's personalize your mental wellness journey. Tell us a bit about yourself.
          </p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
              disabled={loading}
              className="w-full zenith-button-primary text-base sm:text-lg py-3 sm:py-4 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Your Profile...
                </>
              ) : (
                'Start My Wellness Journey 🚀'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
