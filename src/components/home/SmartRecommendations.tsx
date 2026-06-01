import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSmartRouting } from '@/hooks/useSmartRouting';

const DISMISS_KEY = 'zenith-smart-rec-dismissed';

function isDismissedToday(id: string): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw) as Record<string, string>;
    return map[id] === new Date().toISOString().split('T')[0];
  } catch { return false; }
}
function dismissToday(id: string) {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[id] = new Date().toISOString().split('T')[0];
    localStorage.setItem(DISMISS_KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

const SmartRecommendations: React.FC<{ onOpenMindMate?: () => void }> = ({ onOpenMindMate }) => {
  const suggestions = useSmartRouting();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = suggestions.filter(s => !dismissed.includes(s.id) && !isDismissedToday(s.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 mb-4 px-3 md:px-0">
      <AnimatePresence>
        {visible.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3 shadow-sm"
          >
            <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug">{s.label}</p>
              <p className="text-[11px] text-muted-foreground">{s.reason}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {s.cta === 'mindmate' && (
                <button
                  onClick={() => onOpenMindMate?.()}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  <MessageCircle className="inline h-3 w-3 mr-1" />Vent
                </button>
              )}
              {s.cta === 'breathing' && (
                <button
                  onClick={() => navigate('/breathing-exercises')}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  <Wind className="inline h-3 w-3 mr-1" />Breathe
                </button>
              )}
              <button
                onClick={() => { setDismissed(d => [...d, s.id]); dismissToday(s.id); }}
                className="p-1.5 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SmartRecommendations;