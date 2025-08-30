
export interface MoodEntry {
  id: string;
  date: string;
  time: string;
  mood: string;
  reason: string;
  timestamp: number;
  user_id?: string;
  formattedDate: string;
  dayOfWeek: string;
}
