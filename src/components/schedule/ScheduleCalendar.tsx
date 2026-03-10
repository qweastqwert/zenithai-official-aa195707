import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScheduleEvent } from '@/hooks/useScheduleEvents';
import { RecurringEvent } from '@/hooks/useRecurringEvents';

interface ScheduleCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  events: ScheduleEvent[];
  recurringEvents: RecurringEvent[];
  getRecurringEventsForDate: (date: string) => RecurringEvent[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const ScheduleCalendar = ({ selectedDate, onSelectDate, events, getRecurringEventsForDate }: ScheduleCalendarProps) => {
  const selected = new Date(selectedDate + 'T00:00:00');
  const [viewMonth, setViewMonth] = React.useState(selected.getMonth());
  const [viewYear, setViewYear] = React.useState(selected.getFullYear());
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Sync view when selected date changes to a different month
  const handleSelectDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
    onSelectDate(dateStr);
  };

  const navigateMonth = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
  
  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true });
  }
  // Next month fill
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  const getDateStr = (cell: typeof cells[0]) => {
    return `${cell.year}-${(cell.month + 1).toString().padStart(2, '0')}-${cell.day.toString().padStart(2, '0')}`;
  };

  const getEventCount = (dateStr: string) => {
    const scheduled = events.filter(e => e.event_date === dateStr).length;
    const recurring = getRecurringEventsForDate(dateStr).length;
    return scheduled + recurring;
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{MONTHS[viewMonth]} {viewYear}</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary h-6 px-2" onClick={() => {
            const t = new Date();
            handleSelectDate(t.toISOString().split('T')[0]);
          }}>
            Today
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const dateStr = getDateStr(cell);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const count = getEventCount(dateStr);

          return (
            <button
              key={i}
              onClick={() => onSelectDate(dateStr)}
              className={`
                relative flex flex-col items-center justify-center h-10 rounded-xl text-xs transition-all
                ${!cell.isCurrentMonth ? 'text-muted-foreground/40' : 'text-foreground'}
                ${isSelected ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-primary/50 font-bold' : ''}
                ${!isSelected ? 'hover:bg-accent/50' : ''}
              `}
            >
              <span className="text-[11px]">{cell.day}</span>
              {count > 0 && (
                <div className={`flex gap-0.5 mt-0.5 ${isSelected ? '' : ''}`}>
                  {Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                    <div key={j} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-primary-foreground/70' : 'bg-primary/60'}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
