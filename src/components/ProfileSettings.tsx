
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/hooks/useProfile';
import { Trash2, User } from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onDelete: () => void;
}

const ProfileSettings = ({ profile, onUpdate, onDelete }: ProfileSettingsProps) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedProfile.name || !editedProfile.age || !editedProfile.gender) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Age, Gender).",
        variant: "destructive",
      });
      return;
    }

    onUpdate(editedProfile);
    toast({
      title: "Profile Updated! ✨",
      description: "Your personalization settings have been saved.",
    });
  };

  const handleDelete = () => {
    onDelete();
    toast({
      title: "Profile Deleted",
      description: "Your profile has been removed. You can create a new one anytime.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="What should we call you?"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  value={editedProfile.age}
                  onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies & Interests</Label>
              <Textarea
                id="hobbies"
                placeholder="What do you enjoy doing?"
                value={editedProfile.hobbies}
                onChange={(e) => setEditedProfile({ ...editedProfile, hobbies: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problems">Areas you'd like support with</Label>
              <Textarea
                id="problems"
                placeholder="What challenges would you like help with?"
                value={editedProfile.problems}
                onChange={(e) => setEditedProfile({ ...editedProfile, problems: e.target.value })}
                className="min-h-[100px]"
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
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
