import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import type { Song } from '@shared/schema';

interface AudioPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentSong: Song | null;
  isLoading: boolean;
}

export function useAudioPlayer(songs: Song[] = []) {
  const [state, setState] = useState<AudioPlayerState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    currentSong: null,
    isLoading: false,
  });

  const soundRef = useRef<Howl | null>(null);
  const rafRef = useRef<number>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const playSong = (song: Song) => {
    if (state.currentSong?.id === song.id) {
      // Toggle play/pause if same song
      if (state.playing) {
        soundRef.current?.pause();
      } else {
        soundRef.current?.play();
      }
      return;
    }

    // New song
    if (soundRef.current) {
      soundRef.current.unload();
    }

    setState(prev => ({ ...prev, isLoading: true, currentSong: song }));

    const sound = new Howl({
      src: [song.url],
      html5: true, // Force HTML5 Audio for large files/streams
      volume: state.volume,
      onload: () => {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          duration: sound.duration() 
        }));
      },
      onplay: () => {
        setState(prev => ({ ...prev, playing: true }));
        requestAnimationFrame(updateProgress);
      },
      onpause: () => {
        setState(prev => ({ ...prev, playing: false }));
      },
      onend: () => {
        setState(prev => ({ ...prev, playing: false }));
        playNext();
      },
      onseek: () => {
        requestAnimationFrame(updateProgress);
      }
    });

    soundRef.current = sound;
    sound.play();
  };

  const updateProgress = () => {
    if (soundRef.current && soundRef.current.playing()) {
      setState(prev => ({ ...prev, currentTime: soundRef.current!.seek() }));
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const playNext = () => {
    if (!state.currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === state.currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const playPrev = () => {
    if (!state.currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === state.currentSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  const seek = (value: number) => {
    if (soundRef.current) {
      soundRef.current.seek(value);
      setState(prev => ({ ...prev, currentTime: value }));
    }
  };

  const setVolume = (value: number) => {
    if (soundRef.current) {
      soundRef.current.volume(value);
    }
    setState(prev => ({ ...prev, volume: value }));
  };

  const togglePlay = () => {
    if (state.currentSong) {
      if (state.playing) {
        soundRef.current?.pause();
      } else {
        soundRef.current?.play();
      }
    } else if (songs.length > 0) {
      playSong(songs[0]);
    }
  };

  return {
    ...state,
    playSong,
    playNext,
    playPrev,
    seek,
    setVolume,
    togglePlay
  };
}
