
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JournalHistoryViewProps {
  journalHook: any; // Hook from either useJournal or useJournalSupabase
}

const JournalHistoryView: React.FC<JournalHistoryViewProps> = ({ journalHook }) => {
  const { entries, deleteEntry } = journalHook;
  const { toast } = useToast();

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    toast({
      title: "Entry Deleted",
      description: "Journal entry has been removed.",
    });
  };

  const moodEmojis = {
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
      className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Your Journal History</h3>
        <span className="text-sm text-gray-500">{entries.length} entries</span>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No journal entries yet. Start writing to see your history!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-l-4" style={{ borderLeftColor: 'var(--zenith-primary)' }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Mood: {moodEmojis[entry.mood as keyof typeof moodEmojis]} {entry.mood.replace('-', ' ')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {entry.content}
                  </p>
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
