
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, RotateCcw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const AppearanceSection = () => {
  const { settings: themeSettings, updateSettings: updateTheme, getAgeBasedTheme } = useTheme();
  const { profile } = useProfile();
  const { toast } = useToast();

  const handleAutoAgeTheme = () => {
    console.log('Auto age theme clicked, profile:', profile);
    if (profile?.age) {
      const ageBasedTheme = getAgeBasedTheme(parseInt(profile.age));
      console.log('Applying age-based theme:', ageBasedTheme, 'for age:', profile.age);
      updateTheme({ ageTheme: ageBasedTheme });
      toast({
        title: "Age Theme Applied! 🎨",
        description: `Theme updated to "${ageBasedTheme}" based on your age (${profile.age}).`,
      });
    } else {
      console.log('No age found in profile, showing error');
      toast({
        title: "Age Required",
        description: "Please set your age first to apply an age-based theme.",
        variant: "destructive",
      });
    }
  };

  const handleResetTheme = () => {
    console.log('Resetting theme to defaults');
    updateTheme({ ageTheme: 'normal', accentColor: 'purple', isDarkMode: false });
    toast({
      title: "Theme Reset ↻",
      description: "All theme settings have been reset to default.",
    });
  };

  const handleThemeChange = (key: string, value: any) => {
    console.log(`Theme setting changed: ${key} = ${value}`);
    updateTheme({ [key]: value });
  };

  const getThemeDescription = (theme: string) => {
    const descriptions = {
      'normal': 'Standard Zenith design',
      'kids': 'Colorful and playful with rounded corners',
      'teen': 'Modern purple gradients with cool vibes',
      'young-adult': 'Clean blue minimalist design',
      'mature': 'Professional warm tones with sophistication',
      'senior': 'Larger text and calming green colors'
    };
    return descriptions[theme as keyof typeof descriptions] || 'Custom theme';
  };

  console.log('Current theme settings:', themeSettings);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Palette className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 dark:text-gray-100">Dark mode</span>
          <Switch 
            checked={themeSettings.isDarkMode} 
            onCheckedChange={(checked) => handleThemeChange('isDarkMode', checked)} 
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-900 dark:text-gray-100">Accent color</span>
          <Select 
            value={themeSettings.accentColor} 
            onValueChange={(value) => handleThemeChange('accentColor', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="pink">Pink</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="teal">Teal</SelectItem>
              <SelectItem value="indigo">Indigo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Age-Based Themes</h4>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-gray-100">Theme style</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getThemeDescription(themeSettings.ageTheme)}
              </span>
            </div>
            <Select 
              value={themeSettings.ageTheme} 
              onValueChange={(value) => handleThemeChange('ageTheme', value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="kids">Kids (≤12)</SelectItem>
                <SelectItem value="teen">Teen (13-17)</SelectItem>
                <SelectItem value="young-adult">Young Adult (18-30)</SelectItem>
                <SelectItem value="mature">Mature (31-60)</SelectItem>
                <SelectItem value="senior">Senior (60+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAutoAgeTheme}
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Auto-apply by Age
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetTheme}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;
