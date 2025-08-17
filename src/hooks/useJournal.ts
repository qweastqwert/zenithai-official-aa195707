
import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  timestamp: number;
}

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('zenith-journal-entries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed);
        console.log('Loaded journal entries:', parsed.length);
      } catch (error) {
        console.error('Error parsing journal entries:', error);
        // Reset corrupted data
        localStorage.removeItem('zenith-journal-entries');
      }
    }
  }, []);

  const saveEntriesToStorage = (entriesToSave: JournalEntry[]) => {
    try {
      localStorage.setItem('zenith-journal-entries', JSON.stringify(entriesToSave));
      console.log('Journal entries saved:', entriesToSave.length);
    } catch (error) {
      console.error('Error saving journal entries to localStorage:', error);
    }
  };

  const saveEntry = (content: string, mood: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntryIndex = entries.findIndex(entry => entry.date === today);
    
    let updatedEntries: JournalEntry[];

    if (existingEntryIndex >= 0) {
      // Update existing entry for today
      updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content,
        mood,
        timestamp: Date.now()
      };
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: today,
        content,
        mood,
        timestamp: Date.now()
      };
      updatedEntries = [newEntry, ...entries];
    }

    setEntries(updatedEntries);
    saveEntriesToStorage(updatedEntries);
  };

  const getTodaysEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    saveEntriesToStorage(updatedEntries);
  };

  return { entries, saveEntry, getTodaysEntry, deleteEntry };
};
