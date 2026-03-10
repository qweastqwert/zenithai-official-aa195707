import React from 'react';
import { DailySchedule } from '@/components/schedule/DailySchedule';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DailySchedulePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center text-primary-foreground bg-primary">
        <Link to="/chat" className="mr-4">
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Daily Schedule</h1>
      </div>
      <div className="flex-1 overflow-auto p-4 pb-20">
        <DailySchedule />
      </div>
    </div>
  );
};

export default DailySchedulePage;
