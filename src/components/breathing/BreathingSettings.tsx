
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
  color: string;
}

interface BreathingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  patterns: BreathingPattern[];
  selectedPattern: BreathingPattern;
  onPatternChange: (pattern: BreathingPattern) => void;
  totalCycles: number;
  onCyclesChange: (cycles: number) => void;
}

const BreathingSettings: React.FC<BreathingSettingsProps> = ({
  isOpen,
  onClose,
  patterns,
  selectedPattern,
  onPatternChange,
  totalCycles,
  onCyclesChange
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Breathing Settings
                </h3>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Breathing Pattern</label>
                  <Select 
                    value={selectedPattern.name} 
                    onValueChange={(value) => {
                      const pattern = patterns.find(p => p.name === value);
                      if (pattern) onPatternChange(pattern);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {patterns.map((pattern) => (
                        <SelectItem key={pattern.name} value={pattern.name}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: pattern.color }}
                            />
                            <div>
                              <div className="font-medium">{pattern.name}</div>
                              <div className="text-xs text-gray-500">{pattern.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Cycles: {totalCycles}
                  </label>
                  <Slider
                    value={[totalCycles]}
                    onValueChange={(value) => onCyclesChange(value[0])}
                    max={20}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium mb-2">Current Pattern</h4>
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-blue-600">{selectedPattern.inhale}s</div>
                      <div className="text-gray-600 dark:text-gray-400">Inhale</div>
                    </div>
                    {selectedPattern.hold > 0 && (
                      <div>
                        <div className="font-semibold text-yellow-600">{selectedPattern.hold}s</div>
                        <div className="text-gray-600 dark:text-gray-400">Hold</div>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-green-600">{selectedPattern.exhale}s</div>
                      <div className="text-gray-600 dark:text-gray-400">Exhale</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreathingSettings;
