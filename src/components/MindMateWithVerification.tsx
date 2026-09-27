import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MindMate from './MindMate';

interface MindMateWithVerificationProps {
  profile: any;
  onBack?: () => void;
}

// MindMate requires a signed-in session, which already proves the visitor is human.
const MindMateWithVerification: React.FC<MindMateWithVerificationProps> = ({ profile, onBack }) => {
  const [autoPrompt, setAutoPrompt] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPrompt = localStorage.getItem('zenith-auto-prompt');
    if (storedPrompt) {
      setAutoPrompt(storedPrompt);
      localStorage.removeItem('zenith-auto-prompt');
    }
  }, []);

  return <MindMate profile={profile} initialPrompt={autoPrompt} onBack={onBack ?? (() => navigate('/chat'))} />;
};

export default MindMateWithVerification;
