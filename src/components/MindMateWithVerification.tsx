
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MindMate from './MindMate';
import ReCAPTCHA from './ReCAPTCHA';

interface MindMateWithVerificationProps {
  profile: any;
  onBack?: () => void;
}

const MindMateWithVerification: React.FC<MindMateWithVerificationProps> = ({ profile, onBack }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [autoPrompt, setAutoPrompt] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for auto-prompt from transformation challenge
    const storedPrompt = localStorage.getItem('zenith-auto-prompt');
    if (storedPrompt) {
      setAutoPrompt(storedPrompt);
      localStorage.removeItem('zenith-auto-prompt');
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/chat');
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:to-purple-900/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="mb-6">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="zenith-button-secondary flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Royal Menu
            </Button>
          </div>
          <div className="luxury-glass p-8 rounded-2xl">
            <ReCAPTCHA 
              onVerified={() => setIsVerified(true)} 
              title="Access Royal MindMate"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:to-purple-900/20">
      <div className="p-6 border-b luxury-glass backdrop-blur-xl">
        <Button
          onClick={handleBack}
          className="zenith-button-secondary flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Royal Menu
        </Button>
      </div>
      <MindMate profile={profile} initialPrompt={autoPrompt} />
    </div>
  );
};

export default MindMateWithVerification;
