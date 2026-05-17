import React from 'react';
import { motion } from 'framer-motion';
import { DailySchedule } from '@/components/schedule/DailySchedule';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WarmBackground } from '@/components/ui/WarmBackground';
import SEO from '@/components/SEO';

const DailySchedulePage = () => {
  return (
    <WarmBackground variant="dawn">
      <SEO
        title="Daily Schedule — Zenith AI"
        description="Plan recurring wellness routines, schedule check-ins, and stay consistent with your self-care."
        path="/daily-schedule"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col min-h-screen"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 flex items-center gap-3 text-primary-foreground bg-gradient-to-r from-primary via-primary to-[hsl(290_70%_55%)] shadow-lg shadow-primary/20"
        >
          <Link to="/chat">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <CalendarHeart className="h-5 w-5" />
            <div>
              <h1 className="text-xl font-semibold leading-tight">Daily Schedule</h1>
              <p className="text-xs text-primary-foreground/80">Plan a kinder day for yourself ✨</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 overflow-auto p-4 pb-20"
        >
          <DailySchedule />
        </motion.div>
      </motion.div>
    </WarmBackground>
  );
};

export default DailySchedulePage;
