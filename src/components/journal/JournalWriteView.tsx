
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Calendar, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import JournalPrompts from './JournalPrompts';

interface JournalWriteViewProps {
  todaysEntry?: any;
  journalHook: any;
}

const JournalWriteView: React.FC<JournalWriteViewProps> = ({ todaysEntry, journalHook }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  useEffect(() => {
    if (todaysEntry) {
      setContent(todaysEntry.content || '');
      setMood(todaysEntry.mood || '');
    }
  }, [todaysEntry]);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    try {
      await journalHook.saveEntry(content, mood);
      // Show success feedback could be added here
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUsePrompt = (prompt: string) => {
    const newContent = content ? `${content}\n\n${prompt}\n\n` : `${prompt}\n\n`;
    setContent(newContent);
    setShowPrompts(false);
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <ScrollArea className="h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Today's Journal Entry
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            {today}
          </div>
        </div>

        {/* Journal Prompts Toggle */}
        {!showPrompts ? (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Need inspiration? Try our guided prompts to spark meaningful reflection.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPrompts(true)}
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Heart className="h-4 w-4 mr-2" />
                Get Writing Inspiration
              </Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <JournalPrompts onUsePrompt={handleUsePrompt} />
            <div className="mt-3 text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPrompts(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Hide Prompts
              </Button>
            </div>
          </motion.div>
        )}

        {/* Mood Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            How are you feeling today?
          </label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your mood..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ecstatic">🤩 Ecstatic</SelectItem>
              <SelectItem value="joyful">😊 Joyful</SelectItem>
              <SelectItem value="content">🙂 Content</SelectItem>
              <SelectItem value="neutral">😐 Neutral</SelectItem>
              <SelectItem value="melancholy">😕 Melancholy</SelectItem>
              <SelectItem value="troubled">😢 Troubled</SelectItem>
              <SelectItem value="distressed">😭 Distressed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Writing Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your thoughts for today
            </label>
            <span className="text-xs text-gray-500">
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything that matters to you..."
            className="min-h-[300px] resize-none text-base leading-relaxed"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
            className="px-8"
            style={{ backgroundColor: 'var(--zenith-primary)' }}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : todaysEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </div>

        {/* Writing Tips */}
        <Card className="bg-gray-50 dark:bg-gray-800/50 border-0">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ✨ Writing Tips
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Write freely without worrying about grammar or structure</li>
              <li>• Focus on your feelings and experiences, not just events</li>
              <li>• Be honest and authentic with yourself</li>
              <li>• Try to write for at least 5-10 minutes for the best benefits</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </ScrollArea>
  );
};

export default JournalWriteView;
