import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Heart, Wind, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CrisisHelpCardProps {
  onDismiss?: () => void;
  compact?: boolean;
}

/**
 * Inline gentle helpline card surfaced when crisis language is detected
 * in MindMate chat, journal entries, or other free-text inputs.
 */
const CrisisHelpCard: React.FC<CrisisHelpCardProps> = ({ onDismiss, compact }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border border-destructive/30 bg-destructive/5 ${compact ? 'p-3' : 'p-4'} shadow-sm`}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-9 w-9 shrink-0 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center">
          <Heart className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            You don't have to face this alone.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            What you're feeling matters. Talking to a trained listener — even for a moment — can help.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <a href="tel:9152987821">
              <Button size="sm" variant="destructive" className="h-8">
                <Phone className="h-3.5 w-3.5 mr-1.5" /> iCall · 9152987821
              </Button>
            </a>
            <a href="tel:18602662345">
              <Button size="sm" variant="outline" className="h-8">
                <Phone className="h-3.5 w-3.5 mr-1.5" /> Vandrevala · 1860-266-2345
              </Button>
            </a>
            <Button
              size="sm"
              variant="ghost"
              className="h-8"
              onClick={() => navigate('/breathing-exercises')}
            >
              <Wind className="h-3.5 w-3.5 mr-1.5" /> 60-sec calm
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrisisHelpCard;