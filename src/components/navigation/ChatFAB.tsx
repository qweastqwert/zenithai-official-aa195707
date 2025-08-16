
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wind } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const ChatFAB: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isChatRoute = location.pathname === '/chat';
  if (!isChatRoute) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => navigate('/breathing-exercises')}
        className="shadow-lg px-5 py-5 rounded-full flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all"
        aria-label="Open Breathing Exercises"
      >
        <Wind className="h-5 w-5" />
        Breathing Exercises
      </Button>
    </div>
  );
};

export default ChatFAB;
