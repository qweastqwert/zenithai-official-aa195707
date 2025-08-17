
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isStandalone) {
      return; // Don't show button if already installed
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
        setIsInstallable(false);
      }
      
      setDeferredPrompt(null);
    } else if (isIOS) {
      // Show iOS instructions
      alert('To install on iOS:\n1. Tap the Share button (↗) in Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm');
    } else if (isAndroid) {
      // Show Android instructions
      alert('To install on Android:\n1. Open Chrome menu (⋮)\n2. Tap "Add to Home screen"\n3. Tap "Add" to confirm');
    }
  };

  // Don't show if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 border-purple-200 text-purple-700 hover:text-purple-800"
    >
      <img 
        src="/lovable-uploads/289cf3ca-64e3-425c-8e29-1e27aae89509.png"
        alt="Zenith AI"
        className="w-4 h-4"
      />
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Install App</span>
    </Button>
  );
};

export default PWAInstallButton;
