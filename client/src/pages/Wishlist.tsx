import { useSongs, useToggleFavorite } from "@/hooks/use-songs";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Sidebar } from "@/components/Sidebar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Visualizer } from "@/components/Visualizer";
import { 
  Play, 
  Pause, 
  Heart, 
  Clock,
  Music2,
  Heart as HeartIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Wishlist() {
  const { data: songs, isLoading } = useSongs();
  const toggleFavorite = useToggleFavorite();

  const favoriteSongs = songs?.filter((song) => song.isFavorite) || [];

  const { 
    currentSong, 
    playing, 
    duration, 
    currentTime, 
    volume, 
    playSong, 
    playNext, 
    playPrev, 
    seek, 
    setVolume, 
    togglePlay 
  } = useAudioPlayer(songs || []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar />
      
      <main className="md:pl-64 pb-28 min-h-screen relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <HeartIcon className="w-8 h-8 text-primary fill-primary" />
                <span className="text-gradient">My Wishlist</span>
              </h2>
              <p className="text-muted-foreground">{favoriteSongs.length} saved tracks</p>
            </div>
            <div className="hidden md:block">
               {playing && <Visualizer isPlaying={playing} />}
            </div>
          </header>

          {/* Empty State */}
          {!isLoading && favoriteSongs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <HeartIcon className="w-20 h-20 text-muted-foreground mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-2">No favorite songs yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Add songs to your wishlist by clicking the heart icon to save your favorite tracks here.
              </p>
            </motion.div>
          )}

          {/* Songs List */}
          {favoriteSongs.length > 0 && (
            <div className="space-y-8">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-card/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                  <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3 text-xs font-mono font-medium text-muted-foreground border-b border-white/5 uppercase tracking-wider">
                    <span className="w-8 text-center">#</span>
                    <span>Title</span>
                    <span className="hidden md:block">Album</span>
                    <span className="w-24 text-right"><Clock className="w-4 h-4 ml-auto" /></span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {favoriteSongs.map((song, index) => {
                      const isCurrent = currentSong?.id === song.id;
                      return (
                        <motion.div
                          key={song.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => playSong(song)}
                          className={cn(
                            "group grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3 items-center hover:bg-white/5 transition-colors cursor-pointer relative",
                            isCurrent && "bg-white/5"
                          )}
                        >
                          {/* Play Indicator / Number */}
                          <div className="w-8 flex justify-center text-sm font-mono text-muted-foreground">
                            {isCurrent && playing ? (
                              <Visualizer isPlaying={true} />
                            ) : (
                              <span className="group-hover:hidden">{index + 1}</span>
                            )}
                            <Play className={cn(
                              "w-4 h-4 fill-white text-white hidden group-hover:block absolute",
                              isCurrent && playing && "hidden"
                            )} />
                          </div>

                          {/* Title & Artist */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded bg-zinc-800 flex-shrink-0 overflow-hidden relative">
                              {song.coverUrl ? (
                                <img src={song.coverUrl} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <Music2 className="w-5 h-5 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div className="truncate">
                              <p className={cn(
                                "font-medium truncate",
                                isCurrent ? "text-primary" : "text-white group-hover:text-primary transition-colors"
                              )}>
                                {song.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                            </div>
                          </div>

                          {/* Album (Hidden on mobile) */}
                          <div className="hidden md:block text-sm text-muted-foreground truncate">
                            Single
                          </div>

                          {/* Duration & Actions */}
                          <div className="w-24 flex items-center justify-end gap-3">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite.mutate({ id: song.id, isFavorite: false });
                              }}
                            >
                              <Heart className="w-4 h-4 fill-primary text-primary" />
                            </Button>
                            <span className="text-sm font-mono text-muted-foreground w-10 text-right">
                              {song.duration || "3:45"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Global Player */}
      <MusicPlayer 
        currentSong={currentSong}
        isPlaying={playing}
        duration={duration}
        currentTime={currentTime}
        volume={volume}
        onPlayPause={togglePlay}
        onNext={playNext}
        onPrev={playPrev}
        onSeek={seek}
        onVolumeChange={setVolume}
      />
    </div>
  );
}
