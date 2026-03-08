
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJournal } from '@/hooks/useJournal';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useAuth } from '@/hooks/useAuth';
import JournalWriteView from '@/components/journal/JournalWriteView';
import JournalHistoryView from '@/components/journal/JournalHistoryView';

interface JournalProps {
  onClose: () => void;
}

const Journal: React.FC<JournalProps> = ({ onClose }) => {
  const [view, setView] = useState<'write' | 'history'>('write');
  const { user } = useAuth();
  
  // Use appropriate hook based on authentication status
  const cookieJournal = useJournal();
  const supabaseJournal = useJournalSupabase();
  
  const journalHook = user ? supabaseJournal : cookieJournal;
  const { getTodaysEntry } = journalHook;

  const todaysEntry = getTodaysEntry();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-secondary/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6" style={{ color: 'var(--zenith-primary)' }} />
              <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                Daily Journal {user && <span className="text-sm font-normal text-gray-500">(Synced)</span>}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={view === 'write' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('write')}
                  style={view === 'write' ? { backgroundColor: 'var(--zenith-primary)' } : {}}
                >
                  Write
                </Button>
                <Button
                  variant={view === 'history' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('history')}
                  style={view === 'history' ? { backgroundColor: 'var(--zenith-primary)' } : {}}
                >
                  History
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {view === 'write' ? (
                <JournalWriteView key="write" todaysEntry={todaysEntry} journalHook={journalHook} />
              ) : (
                <JournalHistoryView key="history" journalHook={journalHook} />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Journal;
