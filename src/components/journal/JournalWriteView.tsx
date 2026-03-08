import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { JournalEntry } from '@/hooks/useJournal';
import { useToast } from '@/hooks/use-toast';
import { useJournalAutosave } from '@/hooks/useJournalAutosave';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Save, RotateCcw, Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalWriteViewProps {
  todaysEntry: JournalEntry | undefined;
  journalHook: any;
  isMobile?: boolean;
}

const JournalWriteView: React.FC<JournalWriteViewProps> = ({ todaysEntry, journalHook, isMobile }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { saveEntry } = journalHook;
  const { toast } = useToast();
  const { loadDraft, clearDraft } = useJournalAutosave(content, mood);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    isSupported: isSpeechSupported 
  } = useSpeechRecognition();

  // Append transcript to content when speech recognition produces results
  useEffect(() => {
    if (transcript) {
      setContent(prev => {
        const separator = prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '';
        return prev + separator + transcript;
      });
    }
  }, [transcript]);

  useEffect(() => {
    if (todaysEntry) {
      setContent(todaysEntry.content);
      setMood(todaysEntry.mood);
    } else {
      const draft = loadDraft();
      if (draft.content?.trim() || draft.mood) {
        setContent(draft.content);
        setMood(draft.mood);
        setHasUnsavedChanges(true);
        toast({
          title: "Draft Restored 📝",
          description: "We found a saved draft and restored it for you.",
          duration: 3000,
        });
      }
    }
  }, [todaysEntry]);

  useEffect(() => {
    if (todaysEntry) {
      setHasUnsavedChanges(
        content !== todaysEntry.content || mood !== todaysEntry.mood
      );
    } else {
      setHasUnsavedChanges(content.trim() !== '' || mood !== '');
    }
  }, [content, mood, todaysEntry]);

  const handleSaveEntry = async () => {
    if (!content.trim() || !mood) {
      toast({
        title: "Incomplete Entry",
        description: "Please write something and select your mood.",
        variant: "destructive",
      });
      return;
    }

    // Stop listening if recording
    if (isListening) {
      stopListening();
    }

    await saveEntry(content, mood);
    clearDraft();
    setHasUnsavedChanges(false);
    
    toast({
      title: "Journal Saved! 📝",
      description: "Your daily reflection has been recorded.",
    });
    
    if (!todaysEntry) {
      setContent('');
      setMood('');
    }
  };

  const handleDiscardDraft = () => {
    if (isListening) {
      stopListening();
    }
    
    if (todaysEntry) {
      setContent(todaysEntry.content);
      setMood(todaysEntry.mood);
    } else {
      setContent('');
      setMood('');
    }
    clearDraft();
    setHasUnsavedChanges(false);
    toast({
      title: "Draft Discarded",
      description: "Changes have been reverted.",
    });
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast({
        title: "Listening... 🎤",
        description: "Speak your thoughts and they'll appear in the text box.",
        duration: 2000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "space-y-4 overflow-y-auto",
        isMobile ? "p-4 h-full" : "p-6 max-h-[calc(90vh-120px)]"
      )}
    >
      <div className="text-center">
        <h3 className={cn("font-semibold mb-1", isMobile ? "text-lg" : "text-xl")}>
          {todaysEntry ? "Update Today's Entry" : "How was your day?"}
          {hasUnsavedChanges && (
            <span className="ml-2 text-sm text-orange-500">• Unsaved</span>
          )}
        </h3>
        <p className="text-muted-foreground text-sm">
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
          className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary"
        >
          <p className="text-sm text-primary mb-1">
            You've already written an entry today! You can update it below.
          </p>
          <div className="text-xs text-muted-foreground">
            <strong>Previous mood:</strong> {todaysEntry.mood.replace('-', ' ')}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mood" className="text-foreground">How are you feeling today?</Label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger className={isMobile ? "h-12" : ""}>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="content" className="text-foreground">Write your thoughts...</Label>
            {isSpeechSupported && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={toggleSpeechRecognition}
                className={cn(
                  "gap-1.5 transition-all",
                  isListening && "animate-pulse"
                )}
              >
                {isListening ? (
                  <>
                    <Square className="h-3.5 w-3.5" />
                    <span className="text-xs">Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5" />
                    <span className="text-xs">Speak</span>
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="relative">
            <Textarea
              id="content"
              placeholder="What happened today? How did you feel? What are you grateful for?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "resize-none",
                isMobile ? "min-h-[180px]" : "min-h-[200px]",
                isListening && "ring-2 ring-primary/50"
              )}
            />
            {isListening && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Listening...
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleSaveEntry}
            className="flex-1"
            size={isMobile ? "lg" : "default"}
          >
            <Save className="h-4 w-4 mr-2" />
            {todaysEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
          
          {hasUnsavedChanges && (
            <Button 
              onClick={handleDiscardDraft}
              variant="outline"
              size={isMobile ? "lg" : "default"}
              className="px-4"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JournalWriteView;
