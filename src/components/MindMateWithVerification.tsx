
import React, { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ReCAPTCHA 
            onVerified={() => setIsVerified(true)} 
            title="Verify to Continue"
          />
        </div>
      </div>
    );
  }

  return <MindMate profile={profile} initialPrompt={autoPrompt} />;
};

export default MindMateWithVerification;
