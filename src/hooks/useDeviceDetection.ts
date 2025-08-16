
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
}

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLandscape: false,
    screenWidth: 0,
    screenHeight: 0,
    userAgent: ''
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      const userAgent = navigator.userAgent;

      // Mobile detection based on screen size and user agent
      const isMobileBySize = width < 768;
      const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Tablet detection (iPad or Android tablets)
      const isTabletByUA = /iPad|Android(?!.*Mobile)/i.test(userAgent);
      const isTabletBySize = width >= 768 && width <= 1024;
      
      // Final device classification
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (isMobileByUA && !isTabletByUA) {
        // Definitely mobile device
        isMobile = true;
      } else if (isTabletByUA || (isTabletBySize && !isLandscape)) {
        // Tablet in portrait or confirmed tablet
        isTablet = true;
      } else if (isTabletBySize && isLandscape) {
        // Tablet in landscape - treat as desktop
        isDesktop = true;
      } else if (width >= 1025) {
        // Large screen - desktop
        isDesktop = true;
      } else {
        // Small screen without mobile UA - likely mobile
        isMobile = true;
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isLandscape,
        screenWidth: width,
        screenHeight: height,
        userAgent
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return deviceInfo;
};
