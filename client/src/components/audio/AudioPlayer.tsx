import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipForward,
  SkipBack
} from "lucide-react";

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  type: 'ambient' | 'meditation' | 'nature';
};

const tracks: Track[] = [
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

interface AudioPlayerProps {
  className?: string;
  variant?: 'minimal' | 'full';
}

export default function AudioPlayer({ className, variant = 'minimal' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(tracks[currentTrackIndex].src);
    audioRef.current.volume = volume / 100;
    
    // Update duration when metadata is loaded
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    
    // Update progress during playback
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };
    
    // Handle track end
    const handleEnded = () => {
      nextTrack();
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrackIndex]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };
  
  // Skip to previous track
  const prevTrack = () => {
    const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };
  
  // Skip to next track
  const nextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };
  
  // Format time (seconds -> mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const currentTrack = tracks[currentTrackIndex];
  
  return (
    <div className={cn(
      "bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-lg p-3 shadow-sm",
      className
    )}>
      {variant === 'full' && (
        <div className="mb-3 text-center">
          <h3 className="text-amber-700 font-medium text-lg">{currentTrack.title}</h3>
          <p className="text-amber-600/70 text-sm">{currentTrack.artist}</p>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {variant === 'full' && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevTrack}
            className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
          >
            <SkipBack size={18} />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={togglePlay}
          className="bg-gradient-to-r from-amber-200 to-amber-100 hover:from-amber-300 hover:to-amber-200 text-amber-700 hover:text-amber-800 border-amber-200"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        {variant === 'full' && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextTrack}
            className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
          >
            <SkipForward size={18} />
          </Button>
        )}
        
        {variant === 'full' && (
          <>
            <span className="text-xs text-amber-700 w-10">{formatTime(progress)}</span>
            <div className="flex-1 mx-2">
              <Slider
                value={[progress]}
                min={0}
                max={duration || 100}
                step={1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
            </div>
            <span className="text-xs text-amber-700 w-10">{formatTime(duration)}</span>
          </>
        )}
        
        <div className="relative ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute}
            onMouseEnter={() => setShowVolumeControl(true)}
            className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          
          {showVolumeControl && (
            <div 
              className="absolute bottom-full right-0 p-3 bg-white shadow-lg rounded-lg mb-2 w-48"
              onMouseEnter={() => setShowVolumeControl(true)}
              onMouseLeave={() => setShowVolumeControl(false)}
            >
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
              />
            </div>
          )}
        </div>
        
        {variant === 'minimal' && (
          <div className="text-xs text-amber-700 max-w-[120px] truncate">
            {currentTrack.title}
          </div>
        )}
      </div>
    </div>
  );
}