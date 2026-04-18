import React from 'react';
import { motion } from 'framer-motion';

interface WarmBackgroundProps {
  children: React.ReactNode;
  variant?: 'dawn' | 'dusk' | 'meadow' | 'lavender' | 'cocoa';
  className?: string;
}

/**
 * WarmBackground — wraps a page with a soft, lively, comforting backdrop.
 * Uses semantic tokens + subtle animated orbs to add warmth without distraction.
 */
const VARIANT_GRADIENTS: Record<NonNullable<WarmBackgroundProps['variant']>, string> = {
  dawn: 'from-[hsl(30_80%_96%)] via-[hsl(340_70%_97%)] to-[hsl(263_60%_96%)] dark:from-[hsl(263_40%_8%)] dark:via-[hsl(280_30%_10%)] dark:to-[hsl(220_30%_8%)]',
  dusk: 'from-[hsl(263_50%_96%)] via-[hsl(290_50%_96%)] to-[hsl(220_50%_96%)] dark:from-[hsl(263_40%_9%)] dark:via-[hsl(280_30%_8%)] dark:to-[hsl(220_30%_7%)]',
  meadow: 'from-[hsl(160_50%_96%)] via-[hsl(180_50%_96%)] to-[hsl(263_40%_97%)] dark:from-[hsl(180_30%_8%)] dark:via-[hsl(200_30%_8%)] dark:to-[hsl(263_30%_9%)]',
  lavender: 'from-[hsl(263_70%_97%)] via-[hsl(280_60%_97%)] to-[hsl(310_50%_97%)] dark:from-[hsl(263_40%_9%)] dark:via-[hsl(280_35%_9%)] dark:to-[hsl(310_30%_9%)]',
  cocoa: 'from-[hsl(25_50%_96%)] via-[hsl(15_50%_96%)] to-[hsl(340_40%_97%)] dark:from-[hsl(25_30%_8%)] dark:via-[hsl(15_30%_8%)] dark:to-[hsl(340_30%_9%)]',
};

const VARIANT_ORBS: Record<NonNullable<WarmBackgroundProps['variant']>, { a: string; b: string; c: string }> = {
  dawn: { a: 'bg-[hsl(30_90%_75%/0.35)]', b: 'bg-[hsl(340_80%_80%/0.3)]', c: 'bg-[hsl(263_70%_75%/0.25)]' },
  dusk: { a: 'bg-[hsl(263_80%_75%/0.3)]', b: 'bg-[hsl(290_70%_78%/0.28)]', c: 'bg-[hsl(220_70%_78%/0.25)]' },
  meadow: { a: 'bg-[hsl(160_70%_70%/0.28)]', b: 'bg-[hsl(180_70%_75%/0.25)]', c: 'bg-[hsl(263_60%_75%/0.22)]' },
  lavender: { a: 'bg-[hsl(263_80%_78%/0.32)]', b: 'bg-[hsl(290_70%_80%/0.28)]', c: 'bg-[hsl(310_60%_80%/0.25)]' },
  cocoa: { a: 'bg-[hsl(25_80%_75%/0.3)]', b: 'bg-[hsl(15_70%_78%/0.28)]', c: 'bg-[hsl(340_60%_80%/0.22)]' },
};

export const WarmBackground: React.FC<WarmBackgroundProps> = ({
  children,
  variant = 'lavender',
  className = '',
}) => {
  const gradient = VARIANT_GRADIENTS[variant];
  const orbs = VARIANT_ORBS[variant];

  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {/* Ambient orbs — pure CSS, no external libs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className={`absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full blur-3xl ${orbs.a}`}
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full blur-3xl ${orbs.b}`}
          animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className={`absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full blur-3xl ${orbs.c}`}
          animate={{ y: [0, -15, 0], x: [0, 20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Soft grain/noise overlay using radial gradient */}
        <div
          className="absolute inset-0 opacity-[0.4] mix-blend-soft-light"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, hsl(0 0% 100% / 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(0 0% 100% / 0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content above orbs */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default WarmBackground;
