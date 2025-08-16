
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setCookie, getCookie } from '@/utils/cookieUtils';

interface ReCAPTCHAProps {
  onVerified: () => void;
  title: string;
}

const ReCAPTCHA = ({ onVerified, title }: ReCAPTCHAProps) => {
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Check if user has valid session
    const sessionToken = getCookie('zenith-recaptcha-session');
    if (sessionToken) {
      const sessionTime = parseInt(sessionToken);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if ((now - sessionTime) < oneHour) {
        onVerified();
        return;
      }
    }
  }, [onVerified]);

  const handleVerification = async () => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      // Set 1-hour session cookie
      setCookie('zenith-recaptcha-session', Date.now().toString(), 1);
      onVerified();
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenith-softpurple to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zenith-darkpurple dark:text-zenith-purple">
            {title}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Please verify to continue with premium access
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={handleVerification}
              disabled={isVerifying}
              className="w-full"
              style={{ backgroundColor: 'var(--zenith-primary)' }}
            >
              {isVerifying ? 'Verifying...' : 'Verify Access'}
            </Button>
          </div>
          {isVerifying && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Preparing your royal experience...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReCAPTCHA;
