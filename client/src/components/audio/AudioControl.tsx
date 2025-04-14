import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Music,
  SkipForward,
  SkipBack,
  X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAudio, tracks } from './AudioContext';

interface AudioControlProps {
  className?: string;
}

export default function AudioControl({ className }: AudioControlProps) {
  const { 
    audioEnabled, 
    toggleAudio, 
    currentTrack, 
    setCurrentTrack, 
    volume, 
    setVolume,
    isPlaying,
    setIsPlaying
  } = useAudio();
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create or update audio element
  useEffect(() => {
    if (!currentTrack) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.src);
    } else {
      audioRef.current.src = currentTrack.src;
    }
    
    audioRef.current.volume = volume / 100;
    
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    
    return () => {
      audioRef.current?.pause();
    };
  }, [currentTrack, isPlaying]);
  
  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  // Setup audio event listeners
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentTrack(tracks[nextIndex]);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, setCurrentTrack]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Skip to previous track
  const prevTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(tracks[prevIndex]);
  };
  
  // Skip to next track
  const nextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume / 100 : 0;
    }
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
  
  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Format time (seconds -> mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // If audio is not enabled, just show the enable button
  if (!audioEnabled) {
    return (
      <div className={cn(
        "fixed bottom-20 right-4 md:bottom-4 z-50 flex items-center gap-2 p-2 rounded-full bg-gradient-to-r from-amber-500/90 to-amber-400/90 shadow-lg backdrop-blur-sm text-white",
        className
      )}>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleAudio}
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <Music size={16} />
        </Button>
        <span className="text-sm font-medium hidden md:inline">Enable Ethereal Music</span>
      </div>
    );
  }
  
  // Desktop: Full player that shows in corner of screen
  // Mobile: Simplified player that moves above nav bar
  return (
    <>
      <div className={cn(
        "fixed bottom-20 right-4 md:bottom-4 z-50 flex items-center gap-2 p-1.5 rounded-full bg-gradient-to-r from-amber-100/90 to-amber-50/90 shadow-lg backdrop-blur-sm border border-amber-200/50",
        className
      )}>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={togglePlay}
          className="h-8 w-8 text-amber-700 hover:text-amber-800 hover:bg-amber-200/50"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMute}
          className="h-8 w-8 text-amber-700 hover:text-amber-800 hover:bg-amber-200/50 hidden md:flex"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-amber-700 hover:text-amber-800 hover:bg-amber-200/50"
            >
              <Music size={14} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:max-w-none bg-gradient-to-br from-amber-50 to-white">
            <SheetHeader>
              <SheetTitle className="text-amber-800">Ethereal Ambient Music</SheetTitle>
              <SheetDescription className="text-amber-700/70">
                Immerse yourself in the divine sounds of The Sephirots
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-8 space-y-6">
              {/* Current Track Info */}
              <div className="text-center space-y-1">
                <h3 className="text-lg font-medium text-amber-800">
                  {currentTrack?.title || 'Select a track'}
                </h3>
                <p className="text-sm text-amber-600">
                  {currentTrack?.artist || ''}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-700 w-10">{formatTime(progress)}</span>
                <Slider
                  value={[progress]}
                  min={0}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="cursor-pointer"
                />
                <span className="text-xs text-amber-700 w-10">{formatTime(duration)}</span>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={prevTrack}
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                >
                  <SkipBack size={20} />
                </Button>
                
                <Button 
                  size="icon" 
                  onClick={togglePlay}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white h-12 w-12 rounded-full"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={nextTrack}
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                >
                  <SkipForward size={20} />
                </Button>
              </div>
              
              {/* Volume Control */}
              <div className="flex items-center gap-3 px-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
              
              {/* Track List */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Available Tracks</h4>
                <div className="space-y-1">
                  {tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => {
                        setCurrentTrack(track);
                        setIsPlaying(true);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg transition-colors",
                        currentTrack?.id === track.id
                          ? "bg-amber-100 text-amber-800"
                          : "hover:bg-amber-50 text-amber-700"
                      )}
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="font-medium">{track.title}</p>
                          <p className="text-xs text-amber-600/70">{track.artist}</p>
                        </div>
                        {currentTrack?.id === track.id && isPlaying && (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Disable Audio Button */}
              <div className="pt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={toggleAudio}
                  className="text-amber-700 border-amber-300"
                >
                  <X size={14} className="mr-1" />
                  Disable Audio
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {currentTrack && (
          <span className="text-xs text-amber-700 mr-1 max-w-[100px] truncate hidden sm:inline-block">
            {currentTrack.title}
          </span>
        )}
      </div>
    </>
  );
}