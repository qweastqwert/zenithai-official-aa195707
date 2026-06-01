import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2 } from 'lucide-react';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface JournalHistoryViewProps {
  journalHook: any;
  isMobile?: boolean;
  /** When true, show ONLY private entries (Private Space mode). */
  privateOnly?: boolean;
}

const JournalHistoryView: React.FC<JournalHistoryViewProps> = ({ journalHook, isMobile, privateOnly = false }) => {
  const { entries: allEntries, deleteEntry } = journalHook;
  const { toast } = useToast();

  const entries = (allEntries || []).filter((e: any) =>
    privateOnly ? !!e.is_private : !e.is_private
  );

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    toast({
      title: "Entry Deleted",
      description: "Journal entry has been removed.",
    });
  };

  const moodEmojis: { [key: string]: string } = {
    'amazing': '🤩',
    'great': '😊',
    'good': '🙂',
    'okay': '😐',
    'not-great': '😕',
    'bad': '😢',
    'terrible': '😭'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "space-y-4 overflow-y-auto",
        isMobile ? "p-4 h-full pb-8" : "p-6 max-h-[calc(90vh-120px)]"
      )}
    >
      <div className="text-center mb-4">
        <h3 className={cn("font-semibold flex items-center gap-2 justify-center", isMobile ? "text-lg" : "text-xl")}>
          {privateOnly && <Lock className="h-4 w-4 text-primary" />}
          {privateOnly ? 'Private Journal' : 'Journal History'}
        </h3>
        <p className="text-muted-foreground text-sm">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} recorded
        </p>
      </div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            No journal entries yet. Start writing to see your history here!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry: any, index: number) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "overflow-hidden border-l-4",
                entry.is_private ? "border-l-primary bg-primary/5" : "border-l-primary"
              )}>
                <CardContent className="p-0">
                  <div className={cn(
                    "flex items-start gap-3",
                    isMobile ? "p-3" : "p-4"
                  )}>
                    <div className="text-2xl flex-shrink-0">{moodEmojis[entry.mood] || '📝'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {entry.is_private && <Lock className="h-3 w-3" />}
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className={cn(
                        "text-foreground whitespace-pre-wrap",
                        isMobile ? "text-sm line-clamp-4" : "text-sm"
                      )}>
                        {entry.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default JournalHistoryView;
