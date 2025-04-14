import React, { createContext, useContext, useEffect, useState } from 'react';
import { Track } from './AudioPlayer';

interface AudioContextType {
  audioEnabled: boolean;
  toggleAudio: () => void;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

const defaultAudioContext: AudioContextType = {
  audioEnabled: false,
  toggleAudio: () => {},
  currentTrack: null,
  setCurrentTrack: () => {},
  volume: 70,
  setVolume: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
};

const AudioContext = createContext<AudioContextType>(defaultAudioContext);

export const tracks: Track[] = [
  {
    id: 'ethereal-harmony',
    title: 'Ethereal Harmony',
    artist: 'The Sephirots',
    src: 'https://assets.mixkit.co/music/preview/mixkit-spirit-of-the-past-127.mp3',
    type: 'ambient'
  },
  {
    id: 'celestial-whispers',
    title: 'Celestial Whispers',
    artist: 'The Sephirots',
    src: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
    type: 'meditation'
  },
  {
    id: 'woodland-serenity',
    title: 'Woodland Serenity',
    artist: 'The Sephirots',
    src: 'https://assets.mixkit.co/music/preview/mixkit-forest-treasure-138.mp3',
    type: 'nature'
  }
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(70);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize with default track
  useEffect(() => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    }
  }, [currentTrack]);

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
    if (audioEnabled) {
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{
      audioEnabled,
      toggleAudio,
      currentTrack,
      setCurrentTrack,
      volume,
      setVolume,
      isPlaying,
      setIsPlaying
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}