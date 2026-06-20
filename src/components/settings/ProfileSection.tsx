
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Trash2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const ProfileSection = () => {
  const { profile, updateProfile, deleteProfile } = useProfile();
  const { toast } = useToast();
  
  const [editedProfile, setEditedProfile] = useState(profile || {
    name: '',
    age: '',
    gender: '',
    hobbies: '',
    problems: '',
    username: '',
    birth_date: ''
  });

  const handleProfileUpdate = () => {
    if (!editedProfile.name || !editedProfile.age || !editedProfile.gender) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Age, Gender).",
        variant: "destructive",
      });
      return;
    }

    updateProfile(editedProfile);
    toast({
      title: "Profile Updated! ✨",
      description: "Your personalization settings have been saved.",
    });
  };

  const handleProfileDelete = () => {
    deleteProfile();
    toast({
      title: "Profile Deleted",
      description: "Your profile has been removed. You can create a new one anytime.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Settings</h3>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name *</Label>
            <Input
              id="name"
              placeholder="What should we call you?"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Your age"
              value={editedProfile.age}
              onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_date" className="text-gray-700 dark:text-gray-300">Birthday 🎂</Label>
          <Input
            id="birth_date"
            type="date"
            value={editedProfile.birth_date || ''}
            onChange={(e) => setEditedProfile({ ...editedProfile, birth_date: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">We'll send you a special letter on your birthday ✨</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Username</Label>
          <Input
            id="username"
            placeholder="Your community username"
            value={editedProfile.username || ''}
            onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
          />
          <p className="text-xs text-muted-foreground">Shown on community posts and characters you create</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-gray-700 dark:text-gray-300">Gender *</Label>
          <Select 
            value={editedProfile.gender} 
            onValueChange={(value) => setEditedProfile({ ...editedProfile, gender: value })}
          >
            <SelectTrigger>
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
        
        <div className="space-y-2">
          <Label htmlFor="hobbies" className="text-gray-700 dark:text-gray-300">Hobbies & Interests</Label>
          <Textarea
            id="hobbies"
            placeholder="What do you enjoy doing?"
            value={editedProfile.hobbies}
            onChange={(e) => setEditedProfile({ ...editedProfile, hobbies: e.target.value })}
            className="min-h-[60px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="problems" className="text-gray-700 dark:text-gray-300">Areas you'd like support with</Label>
          <Textarea
            id="problems"
            placeholder="What challenges would you like help with?"
            value={editedProfile.problems}
            onChange={(e) => setEditedProfile({ ...editedProfile, problems: e.target.value })}
            className="min-h-[60px]"
          />
        </div>
        
        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Profile
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your profile and all personalization data. 
                  You can always create a new profile later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleProfileDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={handleProfileUpdate} style={{ backgroundColor: 'var(--zenith-primary)' }}>
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
