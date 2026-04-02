import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/200/200",
    color: "#00f2ff"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/200/200",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "Digital Echo",
    artist: "Glitch Core",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/200/200",
    color: "#bc13fe"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-[400px] bg-black border-2 border-cyan p-6 shadow-[6px_6px_0_var(--color-magenta)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-24 h-24 border-2 border-magenta flex-shrink-0 overflow-hidden"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyan/20">
              <div className="flex gap-1 items-end h-12">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 32, 8, 24, 4] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                    className="w-1.5 bg-magenta"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0 font-pixel">
          <h3 className="text-[10px] font-bold truncate text-cyan mb-2 tracking-tighter">{currentTrack.title}</h3>
          <p className="text-[8px] text-magenta truncate tracking-widest uppercase">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-magenta/10 border border-magenta/30 mb-8 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between font-pixel">
        <button 
          onClick={skipBackward} 
          className="p-2 text-cyan hover:text-magenta transition-all hover:scale-110"
        >
          <SkipBack size={20} />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6 py-3 bg-cyan text-black hover:bg-magenta transition-all font-bold text-[10px] tracking-tighter shadow-[4px_4px_0_var(--color-magenta)]"
        >
          {isPlaying ? "HALT" : "INIT"}
        </button>

        <button 
          onClick={skipForward} 
          className="p-2 text-cyan hover:text-magenta transition-all hover:scale-110"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between text-[8px] uppercase tracking-[0.2em] text-magenta/60 font-terminal">
        <div className="flex items-center gap-2">
          <Volume2 size={10} />
          <span>AUDIO_FEED: ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <Music size={10} />
          <span>FREQ: {currentTrackIndex + 1}/03</span>
        </div>
      </div>
    </div>
  );
}
