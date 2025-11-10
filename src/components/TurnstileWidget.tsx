import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'compact';
      }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const siteKey = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY;

  // Auto-verify if no sitekey is configured (development mode)
  useEffect(() => {
    if (!siteKey) {
      console.warn('Turnstile site key not configured. Auto-verifying for development.');
      onVerify('dev-bypass-token');
    }
  }, [siteKey, onVerify]);

  useEffect(() => {
    if (!siteKey) return; // Skip if no sitekey
    
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey) return; // Skip if no sitekey
    
    if (isLoaded && containerRef.current && window.turnstile) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire,
        theme,
        size,
      });
    }
  }, [isLoaded, onVerify, onError, onExpire, theme, size, siteKey]);

  // Don't render container if no sitekey
  if (!siteKey) return null;

  return <div ref={containerRef} className="flex justify-center" />;
};

export default TurnstileWidget;
