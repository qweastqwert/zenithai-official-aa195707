import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number;
  shouldTrigger: boolean;
}

const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  progress,
  shouldTrigger,
}) => {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <motion.div
      className="absolute left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
      style={{ 
        top: 0,
        height: pullDistance,
        minHeight: isRefreshing ? 48 : 0,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: pullDistance > 10 || isRefreshing ? 1 : 0 }}
    >
      <motion.div
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          shouldTrigger || isRefreshing 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background border border-border'
        }`}
        style={{
          scale: 0.5 + progress * 0.5,
        }}
      >
        {isRefreshing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="h-5 w-5" />
          </motion.div>
        ) : shouldTrigger ? (
          <Check className="h-5 w-5" />
        ) : (
          <motion.div
            style={{ rotate: progress * 180 }}
          >
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PullToRefreshIndicator;
