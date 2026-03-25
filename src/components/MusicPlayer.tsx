import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON_DREAMS.WAV',
    artist: 'SYNTH_AI_01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'CYBER_RUN.MP3',
    artist: 'GHOST_OS',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
  },
  {
    id: '3',
    title: 'ELEC_PULSE.RAW',
    artist: 'NEURAL_NET',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("LINK_FAILURE", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-black glitch-border p-6 crt-flicker">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 flex-shrink-0 border-2 border-magenta grayscale contrast-150">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="h-full w-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-cyan/10 mix-blend-overlay" />
          </div>

          <div className="flex-grow overflow-hidden">
            <h3 className="pixel-text truncate text-sm jarring-cyan">{currentTrack.title}</h3>
            <p className="pixel-text mt-1 text-[8px] text-magenta">SRC: {currentTrack.artist}</p>
            
            <div className="mt-6 flex items-center gap-6">
              <button 
                onClick={prevTrack} 
                className="text-cyan hover:text-magenta transition-colors"
              >
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center border-2 border-cyan bg-black text-cyan hover:bg-cyan hover:text-black transition-all"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={nextTrack} 
                className="text-cyan hover:text-magenta transition-colors"
              >
                <SkipForward size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-4 w-full border border-cyan/30 bg-black">
          <motion.div 
            className="h-full bg-magenta shadow-[0_0_10px_#ff00ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] pixel-text text-cyan mix-blend-difference">
            BUFFERING_{Math.floor(progress)}%
          </div>
        </div>

        <div className="flex items-center justify-between text-[8px] pixel-text text-cyan/40 uppercase tracking-widest">
          <span>STREAM_ACTIVE</span>
          <div className="flex items-center gap-2">
            <Volume2 size={10} />
            <span>BITRATE: 128KBPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
