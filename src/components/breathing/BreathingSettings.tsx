import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Settings, Wind, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
  onCyclesChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Breathing Settings
          </DialogTitle>
          <DialogDescription>
            Choose a pattern that matches your current need.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Pattern grid */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-muted-foreground" />
              Breathing Pattern
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {patterns.map((pattern, idx) => {
                const isSelected = pattern.name === selectedPattern.name;
                return (
                  <motion.button
                    key={pattern.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPatternChange(pattern)}
                    className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all"
                        style={{
                          backgroundColor: pattern.color,
                          boxShadow: isSelected ? `0 0 12px ${pattern.color}` : 'none',
                          ['--tw-ring-color' as any]: isSelected ? pattern.color : 'transparent',
                        }}
                      />
                      <span className="font-medium text-sm">{pattern.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{pattern.description}</p>
                    <div className="flex gap-1 mt-2 text-[10px] text-muted-foreground/80">
                      <span>{pattern.inhale}s in</span>
                      {pattern.hold > 0 && <span>· {pattern.hold}s hold</span>}
                      <span>· {pattern.exhale}s out</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Cycles slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Total Cycles</label>
              <span className="text-sm font-semibold text-primary">{totalCycles}</span>
            </div>
            <Slider
              value={[totalCycles]}
              onValueChange={(value) => onCyclesChange(value[0])}
              max={20}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>3 (~1 min)</span>
              <span>20 (~6 min)</span>
            </div>
          </div>

          {/* Live preview */}
          <motion.div
            key={selectedPattern.name}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-muted/60 to-muted/20 border border-border/50"
          >
            <h4 className="font-medium mb-3 text-sm flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Pattern Preview
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <div className="font-bold text-base" style={{ color: selectedPattern.color }}>
                  {selectedPattern.inhale}s
                </div>
                <div className="text-muted-foreground text-xs">Inhale</div>
              </div>
              <div>
                <div className="font-bold text-base" style={{ color: selectedPattern.hold > 0 ? selectedPattern.color : 'hsl(var(--muted-foreground))' }}>
                  {selectedPattern.hold > 0 ? `${selectedPattern.hold}s` : '—'}
                </div>
                <div className="text-muted-foreground text-xs">Hold</div>
              </div>
              <div>
                <div className="font-bold text-base" style={{ color: selectedPattern.color }}>
                  {selectedPattern.exhale}s
                </div>
                <div className="text-muted-foreground text-xs">Exhale</div>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreathingSettings;
