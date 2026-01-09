
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMoodData } from '@/hooks/useMoodData';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MoodPromptWidget from '@/components/mood/MoodPromptWidget';
import { setCookie } from '@/utils/cookieUtils';

interface MoodTrackerProps {
  showPromptOnly?: boolean;
  onPromptComplete?: () => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ 
  showPromptOnly = false, 
  onPromptComplete 
}) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [showPrompt, setShowPrompt] = useState(showPromptOnly);
  const { user } = useAuth();
  
  // Use appropriate hook based on authentication status
  const cookieMoodData = useMoodData();
  const supabaseMoodData = useMoodDataSupabase();
  
  const { toast } = useToast();
  const { isMobile } = useDeviceDetection();

  useEffect(() => {
    if (showPromptOnly) {
      setShowPrompt(true);
    }
  }, [showPromptOnly]);

  const handleMoodSubmit = async (reason?: string) => {
    if (!selectedMood) return;

    // Handle both cookie and Supabase data saving
    if (user) {
      await supabaseMoodData.addEntry(selectedMood, reason || '');
    } else {
      // For cookie-based storage, use saveMoodEntry method
      cookieMoodData.saveMoodEntry(selectedMood, reason || '');
    }

    // Set cookie to track last mood prompt
    setCookie('zenith-last-mood-prompt', Date.now().toString(), 30);

    // Show success toast with beautiful animation
    toast({
      title: "Magnificent! ✨",
      description: `Your ${selectedMood} mood has been elegantly recorded${user ? ' and saved to your account' : ''}. Thank you for this precious moment of self-reflection.`,
      duration: 4000,
    });

    setShowPrompt(false);
    setSelectedMood('');
    
    if (onPromptComplete) {
      onPromptComplete();
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    setSelectedMood('');
    
    if (onPromptComplete) {
      onPromptComplete();
    }
  };

  if (!showPrompt) {
    return null;
  }

  const { isTablet } = useDeviceDetection();

  return (
    <AnimatePresence>
      {showPrompt && (
        <MoodPromptWidget
          selectedMood={selectedMood}
          onMoodSelect={setSelectedMood}
          onSubmit={handleMoodSubmit}
          onClose={handleClose}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      )}
    </AnimatePresence>
  );
};


export default MoodTracker;
