import { useState } from "react";
import { Link } from "wouter";
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
  ListMusic,
  Search as SearchIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: songs, isLoading } = useSongs();
  const toggleFavorite = useToggleFavorite();

  const filteredSongs = songs?.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
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
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                <span className="text-gradient">Welcome Back</span>
              </h2>
              <p className="text-muted-foreground">Your daily mix is ready.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search songs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 rounded-full border-white/10 bg-card/40 text-white placeholder:text-muted-foreground focus:border-primary/50"
                />
              </div>
              <Link href="/wishlist">
                <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-primary hover:bg-white/5">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <div className="hidden md:block">
                 {playing && <Visualizer isPlaying={playing} />}
              </div>
            </div>
          </header>

          {/* Featured/Hero Section */}
          {!isLoading && featuredSong && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[2rem] overflow-hidden glass-panel p-8 md:p-12 group neon-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 z-0" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 rotate-3 group-hover:rotate-0 transition-transform duration-500 border-2 border-white/5">
                  {featuredSong.coverUrl ? (
                    <img src={featuredSong.coverUrl} className="w-full h-full object-cover" alt="Album Art" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <Music2 className="w-20 h-20 text-zinc-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-5">
                  <div>
                    <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4 inline-block border border-primary/20">Featured Track</span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-3 leading-tight tracking-tight">
                      {featuredSong.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-medium">
                      {featuredSong.artist}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-5 pt-4">
                    <Button 
                      size="lg" 
                      className="rounded-full px-10 py-7 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
                      onClick={() => playSong(featuredSong)}
                    >
                      {playing && currentSong?.id === featuredSong.id ? (
                        <>
                          <Pause className="w-6 h-6 mr-3 fill-current" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6 mr-3 fill-current" /> Play Now
                        </>
                      )}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full h-14 w-14 p-0 border-white/10 hover:bg-white/10 text-white hover:text-primary hover:border-primary/50"
                      onClick={() => toggleFavorite.mutate({ id: featuredSong.id, isFavorite: !featuredSong.isFavorite })}
                    >
                      <Heart className={cn("w-6 h-6 transition-colors", featuredSong.isFavorite && "fill-primary text-primary")} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Song List */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <ListMusic className="w-6 h-6 text-secondary" /> 
                {searchQuery ? "Search Results" : "Trending Songs"}
              </h3>
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
                  {filteredSongs.map((song, index) => {
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
