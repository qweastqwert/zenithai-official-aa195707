
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

const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLandscape: false,
      screenWidth: 0,
      screenHeight: 0,
      userAgent: '',
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;
  const userAgent = navigator.userAgent;

  const isMobileBySize = width < 768;
  const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTabletByUA = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  const isTabletBySize = width >= 768 && width <= 1024;

  let isMobile = false;
  let isTablet = false;
  let isDesktop = false;

  if (isMobileByUA && !isTabletByUA) {
    isMobile = true;
  } else if (isTabletByUA || (isTabletBySize && !isLandscape)) {
    isTablet = true;
  } else if (isTabletBySize && isLandscape) {
    isDesktop = true;
  } else if (width >= 1025) {
    isDesktop = true;
  } else {
    isMobile = true;
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    screenWidth: width,
    screenHeight: height,
    userAgent,
  };
};

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

  useEffect(() => {
    const detectDevice = () => {
      setDeviceInfo(getDeviceInfo());
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
