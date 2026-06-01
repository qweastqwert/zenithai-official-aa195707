import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, BookOpen, ArrowLeft, Lock, LockOpen } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import JournalWriteView from '@/components/journal/JournalWriteView';
import JournalHistoryView from '@/components/journal/JournalHistoryView';
import PrivateSpaceGate from '@/components/journal/PrivateSpaceGate';
import { useJournalPin } from '@/hooks/useJournalPin';

interface JournalProps {
  onClose: () => void;
}

const Journal: React.FC<JournalProps> = ({ onClose }) => {
  const [view, setView] = useState<'write' | 'history' | 'private'>('write');
  const { user } = useAuth();
  const { isMobile } = useDeviceDetection();
  const { isUnlocked, lock } = useJournalPin();
  
  // Use appropriate hook based on authentication status
  const cookieJournal = useJournal();
  const supabaseJournal = useJournalSupabase();
  
  const journalHook = user ? supabaseJournal : cookieJournal;
  const { getTodaysEntry } = journalHook;

  const todaysEntry = getTodaysEntry(false);
  const todaysPrivateEntry = view === 'private' && isUnlocked ? getTodaysEntry(true) : undefined;

  const tabs: Array<{ id: 'write' | 'history' | 'private'; label: string }> = [
    { id: 'write', label: 'Write' },
    { id: 'history', label: 'History' },
    { id: 'private', label: 'Private' },
  ];

  const renderContent = (mobile: boolean) => (
    <AnimatePresence mode="wait">
      {view === 'write' && (
        <JournalWriteView key="write" todaysEntry={todaysEntry} journalHook={journalHook} isMobile={mobile} />
      )}
      {view === 'history' && (
        <JournalHistoryView key="history" journalHook={journalHook} isMobile={mobile} />
      )}
      {view === 'private' && (
        user ? (
          isUnlocked ? (
            <motion.div
              key="private-unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={mobile ? 'h-full overflow-y-auto' : 'max-h-[calc(90vh-120px)] overflow-y-auto'}
            >
              <div className="flex items-center justify-between px-4 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <Lock className="h-3.5 w-3.5" /> Private Space — only visible to you
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={lock}>
                  <LockOpen className="h-3.5 w-3.5 mr-1" /> Lock
                </Button>
              </div>
              <JournalWriteView todaysEntry={todaysPrivateEntry} journalHook={journalHook} isMobile={mobile} privateMode />
              <JournalHistoryView journalHook={journalHook} isMobile={mobile} privateOnly />
            </motion.div>
          ) : (
            <PrivateSpaceGate key="private-gate" onUnlocked={() => { /* re-render via hook state */ }} />
          )
        ) : (
          <div key="private-no-auth" className="p-6 text-center text-sm text-muted-foreground">
            Sign in to use the Private Space.
          </div>
        )
      )}
    </AnimatePresence>
  );

  // Mobile fullscreen view
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 bg-background flex flex-col"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5 -ml-1.5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-base font-semibold">Daily Journal</h1>
            {user && <span className="text-xs text-muted-foreground">(Synced)</span>}
          </div>
          <div className="w-8" />
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 px-4 py-3 border-b border-border/20 flex-shrink-0">
          {tabs.map(t => (
            <Button
              key={t.id}
              variant={view === t.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView(t.id)}
              className="flex-1 gap-1.5"
            >
              {t.id === 'private' && <Lock className="h-3.5 w-3.5" />}
              {t.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">{renderContent(true)}</div>
      </motion.div>
    );
  }

  // Desktop/Tablet view - transparent backdrop showing dashboard gradient buttons
  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl"
      >
        <Card className="max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-xl border-border shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl text-foreground">
                Daily Journal {user && <span className="text-sm font-normal text-muted-foreground">(Synced)</span>}
              </CardTitle>
              <div className="flex space-x-2">
                {tabs.map(t => (
                  <Button
                    key={t.id}
                    variant={view === t.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView(t.id)}
                    className="gap-1.5"
                  >
                    {t.id === 'private' && <Lock className="h-3.5 w-3.5" />}
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">{renderContent(false)}</CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Journal;
