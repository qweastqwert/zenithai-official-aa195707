import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/utils/cookieUtils';
import { MoodEntry } from '@/types/mood';

export const useMoodData = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const savedMoods = getCookie('zenith-mood-data');
    if (savedMoods) {
      try {
        const parsed = JSON.parse(savedMoods);
        // Ensure entries have all required fields for backward compatibility
        const validatedEntries = parsed.map((entry: any) => ({
          ...entry,
          formattedDate: entry.formattedDate || new Date(entry.timestamp).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          dayOfWeek: entry.dayOfWeek || new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long' })
        }));
        setMoodEntries(validatedEntries);
      } catch (error) {
        console.error('Error parsing mood data:', error);
        // Clear corrupted data
        setCookie('zenith-mood-data', JSON.stringify([]), 8760);
      }
    }
  }, []);

  const saveMoodEntry = (mood: string, reason: string) => {
    const now = new Date();
    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      mood,
      reason,
      timestamp: Date.now(),
      formattedDate: now.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
    };

    const updatedEntries = [newEntry, ...moodEntries].slice(0, 100); // Keep only last 100 entries
    setMoodEntries(updatedEntries);
    
    // Save to cookies with proper JSON formatting and force persistence
    try {
      const jsonData = JSON.stringify(updatedEntries);
      setCookie('zenith-mood-data', jsonData, 8760); // 1 year expiry
      
      // Force a second write to ensure persistence
      setTimeout(() => {
        setCookie('zenith-mood-data', jsonData, 8760);
      }, 100);
      
      console.log('Mood entry saved:', newEntry);
      console.log('Total entries:', updatedEntries.length);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  };

  const addEntry = async (mood: string, reason: string = '') => {
    saveMoodEntry(mood, reason);
  };

  const addMoodEntry = (entry: { mood: string; date: string; notes: string }) => {
    saveMoodEntry(entry.mood, entry.notes);
  };

  const deleteEntry = async (id: string) => {
    const updatedEntries = moodEntries.filter(entry => entry.id !== id);
    setMoodEntries(updatedEntries);
    setCookie('zenith-mood-data', JSON.stringify(updatedEntries), 8760);
  };

  const getEntriesForDate = (date: string) => {
    return moodEntries.filter(entry => entry.date === date);
  };

  const getEntriesForDateRange = (startDate: string, endDate: string) => {
    return moodEntries.filter(entry => entry.date >= startDate && entry.date <= endDate);
  };

  const getMoodStats = () => {
    const last7Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const moodCounts = last7Days.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEntries: moodEntries.length,
      last7DaysCount: last7Days.length,
      mostCommonMood: Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b, Object.keys(moodCounts)[0]
      ),
      moodCounts
    };
  };

  return { 
    entries: moodEntries,
    moodEntries, 
    addEntry,
    saveMoodEntry, 
    addMoodEntry, 
    deleteEntry,
    getEntriesForDate,
    getEntriesForDateRange,
    getMoodStats,
    loading: false,
    refetch: () => Promise.resolve()
  };
};
