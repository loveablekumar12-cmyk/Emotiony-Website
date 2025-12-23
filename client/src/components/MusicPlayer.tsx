import { useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Song } from "@shared/schema";
import { useToggleFavorite } from "@/hooks/use-songs";

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (val: number) => void;
  onVolumeChange: (val: number) => void;
}

export function MusicPlayer({
  currentSong,
  isPlaying,
  duration,
  currentTime,
  volume,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange
}: MusicPlayerProps) {
  const toggleFavorite = useToggleFavorite();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/10 px-4 py-3 md:px-8 md:py-4 md:pl-72">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-[140px]">
          <div className="relative group w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            {currentSong.coverUrl ? (
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700",
                  isPlaying ? "scale-110" : "scale-100"
                )}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white/20">ET</span>
              </div>
            )}
            {/* Play overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
          
          <div className="overflow-hidden">
            <motion.h4 
              key={currentSong.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm md:text-base font-bold text-white truncate"
            >
              {currentSong.title}
            </motion.h4>
            <motion.p 
              key={currentSong.artist}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs md:text-sm text-muted-foreground truncate hover:text-white transition-colors cursor-pointer"
            >
              {currentSong.artist}
            </motion.p>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors"
            onClick={() => toggleFavorite.mutate({ id: currentSong.id, isFavorite: !currentSong.isFavorite })}
          >
            <Heart className={cn("w-4 h-4", currentSong.isFavorite && "fill-primary text-primary")} />
          </Button>
        </div>

        {/* Controls & Progress */}
        <div className="flex flex-col items-center flex-1 max-w-2xl gap-2">
          <div className="flex items-center gap-4 md:gap-6">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hidden sm:flex h-8 w-8">
              <Shuffle className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-primary transition-colors"
              onClick={onPrev}
            >
              <SkipBack className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            </Button>
            
            <Button 
              size="icon" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 hover:bg-primary/90 transition-all"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              ) : (
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-primary transition-colors"
              onClick={onNext}
            >
              <SkipForward className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            </Button>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hidden sm:flex h-8 w-8">
              <Repeat className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="w-full flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 relative group h-2 flex items-center cursor-pointer">
              {/* Custom Range Slider using basic HTML for speed/simplicity, tailored via CSS in index.css */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full h-1 z-10 opacity-0 cursor-pointer absolute inset-0"
              />
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent relative"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>
              <div 
                className="w-3 h-3 bg-white rounded-full shadow-lg absolute opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `${(currentTime / (duration || 1)) * 100}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-end gap-2 w-1/3 min-w-[100px] hidden md:flex">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-white"
            onClick={() => onVolumeChange(volume === 0 ? 0.5 : 0)}
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <div className="w-24 relative group">
             <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-full"
              />
          </div>
        </div>
      </div>
    </div>
  );
}
