
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Volume2 } from 'lucide-react';

const AudioSection = () => {
  const [audioVolume, setAudioVolume] = useState([70]);
  const [autoPlay, setAutoPlay] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Volume2 className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Audio Settings</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Master Volume</span>
          <div className="w-32">
            <Slider
              value={audioVolume}
              onValueChange={setAudioVolume}
              max={100}
              step={1}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Auto-play music suggestions</span>
          <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
        </div>
      </div>
    </div>
  );
};

export default AudioSection;
