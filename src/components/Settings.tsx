
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import ProfileSection from '@/components/settings/ProfileSection';
import AppearanceSection from '@/components/settings/AppearanceSection';
import LanguageSection from '@/components/settings/LanguageSection';
import UICustomizationSection from '@/components/settings/UICustomizationSection';
import AudioSection from '@/components/settings/AudioSection';
import NotificationsSection from '@/components/settings/NotificationsSection';
import AccessibilitySettingsSection from '@/components/settings/AccessibilitySettingsSection';
import { MindArchiveSection } from '@/components/settings/MindArchiveSection';
import DangerZoneSection from '@/components/settings/DangerZoneSection';
import { useAuth } from '@/hooks/useAuth';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">Settings</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileSection />
          <Separator />
          <MindArchiveSection />
          <Separator />
          <AppearanceSection />
          <Separator />
          <LanguageSection />
          <Separator />
          <AccessibilitySettingsSection />
          <Separator />
          <UICustomizationSection />
          <Separator />
          <AudioSection />
          <Separator />
          <NotificationsSection />
          <Separator />
          
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
            <Button 
              onClick={handleSignOut} 
              variant="destructive" 
              className="w-full"
            >
              Sign Out
            </Button>
          </div>

          <Separator />
          <DangerZoneSection />
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
