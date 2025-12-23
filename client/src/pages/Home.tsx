import { useSongs, useToggleFavorite } from "@/hooks/use-songs";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Sidebar } from "@/components/Sidebar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Visualizer } from "@/components/Visualizer";
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal,
  Clock,
  Music2,
  ListMusic
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const { data: songs, isLoading } = useSongs();
  const toggleFavorite = useToggleFavorite();
  
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

  const featuredSong = songs?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar />
      
      <main className="md:pl-64 pb-28 min-h-screen relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                Good Evening
              </h2>
              <p className="text-muted-foreground">Ready for some beats?</p>
            </div>
            <div className="hidden md:block">
               {playing && <Visualizer isPlaying={playing} />}
            </div>
          </header>

          {/* Featured/Hero Section */}
          {!isLoading && featuredSong && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/5 p-6 md:p-10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-0" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {featuredSong.coverUrl ? (
                    <img src={featuredSong.coverUrl} className="w-full h-full object-cover" alt="Album Art" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <Music2 className="w-16 h-16 text-zinc-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2 inline-block">Featured Track</span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2 leading-tight">
                      {featuredSong.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 font-medium">
                      {featuredSong.artist}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                    <Button 
                      size="lg" 
                      className="rounded-full px-8 py-6 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
                      onClick={() => playSong(featuredSong)}
                    >
                      {playing && currentSong?.id === featuredSong.id ? (
                        <>
                          <Pause className="w-5 h-5 mr-2 fill-current" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2 fill-current" /> Play Now
                        </>
                      )}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full px-4 py-6 border-white/10 hover:bg-white/10 text-white"
                      onClick={() => toggleFavorite.mutate({ id: featuredSong.id, isFavorite: !featuredSong.isFavorite })}
                    >
                      <Heart className={cn("w-5 h-5 transition-colors", featuredSong.isFavorite && "fill-primary text-primary")} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Song List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-primary" /> 
                Trending Songs
              </h3>
              <Button variant="link" className="text-muted-foreground hover:text-white">View All</Button>
            </div>

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
                  {songs?.map((song, index) => {
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
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite.mutate({ id: song.id, isFavorite: !song.isFavorite });
                            }}
                          >
                            <Heart className={cn("w-4 h-4", song.isFavorite && "fill-primary text-primary")} />
                          </Button>
                          <span className="text-sm font-mono text-muted-foreground w-10 text-right">
                            {song.duration || "3:45"}
                          </span>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground md:hidden">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
