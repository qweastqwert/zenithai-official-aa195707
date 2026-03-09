import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScheduleEvents } from '@/hooks/useScheduleEvents';

interface ScheduleWidgetProps {
  onNavigate: () => void;
}

export const ScheduleWidget = ({ onNavigate }: ScheduleWidgetProps) => {
  const { events, loading } = useScheduleEvents();
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.event_date === today);
  const completed = todayEvents.filter(e => e.is_completed).length;
  const total = todayEvents.filter(e => !e.is_auto_generated).length;

  // Next upcoming event
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const nextEvent = todayEvents.find(e => e.start_time > currentTime && !e.is_completed);

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={onNavigate} className="cursor-pointer">
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.03))' }}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))' }}>
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Daily Schedule</h4>
                <p className="text-[10px] text-muted-foreground">
                  {total > 0 ? `${completed}/${total} tasks done` : 'No tasks yet'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          {nextEvent && (
            <div className="bg-background/60 rounded-lg p-2 mt-1">
              <p className="text-[10px] text-muted-foreground">Next up:</p>
              <p className="text-xs font-medium truncate">{nextEvent.title}</p>
              <p className="text-[10px] text-primary">{formatTime(nextEvent.start_time)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
