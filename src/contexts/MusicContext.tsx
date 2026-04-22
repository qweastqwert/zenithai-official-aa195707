
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface Song {
  id: number;
  title: string;
  url: string;
  category: string;
  mood: string[];
  cover: string;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  stopAndClose: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create global audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      
      // Audio event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        nextSong();
      });
      
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playSong = (song: Song) => {
    if (!audioRef.current) return;
    
    console.log('Playing song:', song.title);
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);
    
    audioRef.current.src = song.url;
    audioRef.current.volume = volume / 100;
    audioRef.current.load(); // Ensure the audio is loaded
    
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current && !isNaN(time)) {
      audioRef.current.currentTime = time;
    }
  };

  const nextSong = () => {
    if (!currentSong || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex]);
  };

  const previousSong = () => {
    if (!currentSong || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playSong(playlist[prevIndex]);
  };

  const stopAndClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
    }
    setIsPlaying(false);
    setCurrentSong(null);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      volume,
      currentTime,
      duration,
      playSong,
      togglePlayPause,
      setVolume,
      seekTo,
      nextSong,
      previousSong,
      playlist,
      setPlaylist,
      stopAndClose
    }}>
      {children}
    </MusicContext.Provider>
  );
};
