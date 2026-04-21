
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, X } from 'lucide-react';

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

const PWAInstallDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the dialog
    const hasSeenDialog = localStorage.getItem('zenith-pwa-dialog-seen');
    
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!hasSeenDialog && !isStandalone) {
      // Show dialog after 5 seconds for iOS/Android users
      if (isIOSDevice || isAndroidDevice) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      if (!hasSeenDialog) {
        setTimeout(() => {
          setIsOpen(true);
        }, 5000);
      }
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
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
    
    setIsOpen(false);
    localStorage.setItem('zenith-pwa-dialog-seen', 'true');
  };

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('zenith-pwa-dialog-seen', 'true');
  };

  const getInstallInstructions = () => {
    if (isIOS) {
      return (
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium">To install Zenith AI on your iPhone/iPad:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Tap the Share button <span className="inline-block w-4 h-4 bg-blue-500 rounded text-white text-xs text-center leading-4">↗</span> in Safari</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" to confirm</li>
          </ol>
        </div>
      );
    }
    
    if (isAndroid && !isInstallable) {
      return (
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium">To install Zenith AI on your Android device:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Open Chrome menu (⋮)</li>
            <li>Tap "Add to Home screen"</li>
            <li>Tap "Add" to confirm</li>
          </ol>
        </div>
      );
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <img 
                  src="/zenith-logo-mark.png"
                  alt="Zenith AI"
                  className="w-8 h-8"
                />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">Install Zenith AI</DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Add to your home screen for quick access
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <Smartphone className="h-16 w-16 mx-auto text-purple-500 mb-3" />
            <p className="text-gray-700 dark:text-gray-300">
              Get instant access to your mental wellness companion directly from your home screen.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Note: AI features require internet connection. Meditation, breathing exercises, and music work offline.
            </p>
          </div>

          {getInstallInstructions()}

          <div className="flex gap-3">
            {isInstallable && (
              <Button 
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className={isInstallable ? "flex-1" : "w-full"}
            >
              {isInstallable ? "Maybe Later" : "Got it"}
            </Button>
          </div>

          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            ✨ Works offline (non-AI features) • 🚀 Faster loading • 📱 Native experience
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallDialog;
