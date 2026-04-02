import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, AlertTriangle } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative static-noise overflow-hidden">
      {/* Glitch Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 mix-blend-screen bg-cyan/5" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12 z-10 screen-tear"
      >
        <h1 
          className="text-4xl md:text-6xl font-pixel tracking-tighter text-cyan mb-4 glitch-box"
          data-text="SYSTEM_FAILURE_01"
        >
          SYSTEM_FAILURE_01
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm font-terminal tracking-[0.5em] text-magenta uppercase">
          <span className="flex items-center gap-2"><Terminal size={16} /> KERNEL_ACTIVE</span>
          <span className="w-2 h-2 bg-cyan animate-pulse" />
          <span className="flex items-center gap-2"><Cpu size={16} /> NEURAL_SYNC</span>
        </div>
      </motion.header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        
        {/* Left Data Stream */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="bg-black border-2 border-cyan p-6 shadow-[4px_4px_0_var(--color-magenta)]">
            <div className="flex items-center gap-3 text-cyan mb-6 font-pixel text-[10px]">
              <AlertTriangle size={14} />
              <span>DATA_LOG</span>
            </div>
            <div className="space-y-6 font-terminal">
              <div className="flex flex-col border-b border-cyan/20 pb-4">
                <span className="text-xs text-magenta mb-1">RAW_INPUT_STREAM</span>
                <span className="text-4xl font-pixel text-cyan">{score.toString().padStart(4, '0')}</span>
              </div>
              <div className="flex flex-col border-b border-cyan/20 pb-4">
                <span className="text-xs text-magenta mb-1">PEAK_EFFICIENCY</span>
                <span className="text-4xl font-pixel text-magenta">{highScore.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black border-2 border-magenta p-6 shadow-[4px_4px_0_var(--color-cyan)] font-terminal">
            <h4 className="text-xs font-pixel text-magenta mb-4">PROTOCOLS</h4>
            <ul className="text-sm space-y-3 text-cyan uppercase">
              <li className="flex justify-between"><span>DIR_UP</span> <span>[↑]</span></li>
              <li className="flex justify-between"><span>DIR_DOWN</span> <span>[↓]</span></li>
              <li className="flex justify-between"><span>DIR_LEFT</span> <span>[←]</span></li>
              <li className="flex justify-between"><span>DIR_RIGHT</span> <span>[→]</span></li>
              <li className="flex justify-between"><span>EXECUTE</span> <span>[SPACE]</span></li>
            </ul>
          </div>
        </div>

        {/* Center Void */}
        <div className="lg:col-span-6 flex flex-col items-center gap-8">
          {/* Mobile HUD */}
          <div className="lg:hidden w-full flex justify-between items-center bg-black border-2 border-cyan p-4 shadow-[4px_4px_0_var(--color-magenta)] font-pixel text-[10px]">
            <div className="flex flex-col gap-1">
              <span className="text-magenta">SCORE</span>
              <span className="text-xl text-cyan">{score}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-magenta">PEAK</span>
              <span className="text-xl text-cyan">{highScore}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 border-2 border-cyan/30 animate-pulse pointer-events-none" />
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>
          
          <div className="w-full lg:hidden">
            <MusicPlayer />
          </div>
        </div>

        {/* Right Frequency */}
        <div className="hidden lg:block lg:col-span-3">
          <MusicPlayer />
          
          <div className="mt-8 p-6 border-2 border-cyan/20 bg-black text-xs text-magenta font-terminal leading-relaxed uppercase tracking-widest">
            "THE_GHOST_IN_THE_MACHINE_IS_HUNGRY. FEED_THE_VOID_WITH_INPUT. DO_NOT_STOP_THE_STREAM."
          </div>
        </div>

      </main>

      <footer className="mt-16 text-[10px] text-cyan/40 font-pixel tracking-[0.5em] uppercase z-10">
        [!] CONNECTION_STABLE // NODE_0X4F2
      </footer>
    </div>
  );
}
