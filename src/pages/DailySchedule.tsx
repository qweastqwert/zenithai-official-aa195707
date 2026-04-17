import React from 'react';
import { motion } from 'framer-motion';
import { DailySchedule } from '@/components/schedule/DailySchedule';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DailySchedulePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-screen bg-background"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="p-4 flex items-center text-primary-foreground bg-primary"
      >
        <Link to="/chat" className="mr-4">
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Daily Schedule</h1>
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
  );
};

export default DailySchedulePage;
