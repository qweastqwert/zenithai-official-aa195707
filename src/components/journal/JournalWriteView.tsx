import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { JournalEntry } from '@/hooks/useJournal';
import { useToast } from '@/hooks/use-toast';

interface JournalWriteViewProps {
  todaysEntry: JournalEntry | undefined;
  journalHook: any; // Hook from either useJournal or useJournalSupabase
}

const JournalWriteView: React.FC<JournalWriteViewProps> = ({ todaysEntry, journalHook }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const { saveEntry } = journalHook;
  const { toast } = useToast();

  useEffect(() => {
    if (todaysEntry) {
      setContent(todaysEntry.content);
      setMood(todaysEntry.mood);
    }
  }, [todaysEntry]);

  const handleSaveEntry = async () => {
    if (!content.trim() || !mood) {
      toast({
        title: "Incomplete Entry",
        description: "Please write something and select your mood.",
        variant: "destructive",
      });
      return;
    }

    await saveEntry(content, mood);
    toast({
      title: "Journal Saved! 📝",
      description: "Your daily reflection has been recorded.",
    });
    
    if (!todaysEntry) {
      setContent('');
      setMood('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">
          {todaysEntry ? "Update Today's Entry" : "How was your day?"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {todaysEntry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500"
        >
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            You've already written an entry today! You can update it below.
          </p>
          <div className="text-sm">
            <strong>Previous mood:</strong> {todaysEntry.mood.replace('-', ' ')}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mood" className="text-gray-700 dark:text-gray-300">How are you feeling today?</Label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger>
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amazing">🤩 Amazing</SelectItem>
              <SelectItem value="great">😊 Great</SelectItem>
              <SelectItem value="good">🙂 Good</SelectItem>
              <SelectItem value="okay">😐 Okay</SelectItem>
              <SelectItem value="not-great">😕 Not Great</SelectItem>
              <SelectItem value="bad">😢 Bad</SelectItem>
              <SelectItem value="terrible">😭 Terrible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">Write your thoughts...</Label>
          <Textarea
            id="content"
            placeholder="What happened today? How did you feel? What are you grateful for?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>

        <Button 
          onClick={handleSaveEntry}
          className="w-full"
          style={{ backgroundColor: 'var(--zenith-primary)' }}
        >
          {todaysEntry ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </motion.div>
  );
};

export default JournalWriteView;
