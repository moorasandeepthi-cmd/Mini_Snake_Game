import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black selection:bg-magenta selection:text-black">
      {/* Retro Overlays */}
      <div className="static-overlay" />
      <div className="noise-bg" />
      
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-12 p-4 md:p-8 crt-flicker">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center screen-tear"
        >
          <h1 className="pixel-text text-4xl font-black tracking-tighter md:text-6xl jarring-cyan">
            NEON_SNAKE.EXE
          </h1>
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="pixel-text text-[10px] tracking-[0.2em] text-magenta">
              CORE_OS_VERSION: 1.0.4_BETA
            </p>
            <div className="h-1 w-48 bg-cyan/20">
              <motion.div 
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-full bg-cyan"
              />
            </div>
          </div>
        </motion.header>

        <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-16 lg:flex-row lg:items-start">
          {/* Left: Music Module */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-auto"
          >
            <div className="mb-4 flex items-center justify-between border-l-4 border-magenta pl-4">
              <span className="pixel-text text-[10px] text-cyan">AUDIO_DECODER_M01</span>
              <span className="pixel-text text-[8px] text-magenta animate-pulse">LINK_STABLE</span>
            </div>
            <MusicPlayer />
            
            <div className="mt-8 hidden lg:block">
              <div className="glitch-border bg-black p-4">
                <h4 className="pixel-text mb-4 text-[10px] text-cyan">SYSTEM_LOGS</h4>
                <div className="space-y-2 font-mono text-[10px] text-cyan/60">
                  <p className="flex gap-2"><span>[04:07:07]</span> <span>BOOT_SEQUENCE_COMPLETE</span></p>
                  <p className="flex gap-2"><span>[04:07:08]</span> <span>NEURAL_LINK_ESTABLISHED</span></p>
                  <p className="flex gap-2 text-magenta"><span>[04:07:09]</span> <span>WARNING: BUFFER_OVERFLOW_DETECTED</span></p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center: Game Module */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 pixel-text text-[10px] text-magenta">
              {'>'} RUNNING_SIMULATION_042
            </div>
            <SnakeGame />
          </motion.div>

          {/* Right: Hardware Status */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden w-64 flex-col gap-8 lg:flex"
          >
            <div className="glitch-border bg-black p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="pixel-text text-[10px] text-cyan">HW_MONITOR</span>
                <div className="h-2 w-2 bg-cyan animate-ping" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between pixel-text text-[8px] mb-1">
                    <span>CPU_LOAD</span>
                    <span>84%</span>
                  </div>
                  <div className="h-1 w-full bg-cyan/10"><div className="h-full w-[84%] bg-cyan" /></div>
                </div>
                <div>
                  <div className="flex justify-between pixel-text text-[8px] mb-1">
                    <span>MEM_USAGE</span>
                    <span>12.4GB</span>
                  </div>
                  <div className="h-1 w-full bg-magenta/10"><div className="h-full w-[65%] bg-magenta" /></div>
                </div>
              </div>
            </div>

            <div className="glitch-border bg-black p-6">
               <h3 className="pixel-text mb-6 text-[10px] text-magenta">TOP_OPERATORS</h3>
               <div className="space-y-4">
                 {[
                   { name: 'X_PUNK_01', score: '2450' },
                   { name: 'TRON_V2', score: '1820' },
                   { name: 'SHELL_X', score: '1540' }
                 ].map((entry, i) => (
                   <div key={i} className="flex items-center justify-between font-mono text-xs">
                     <span className="text-cyan">{entry.name}</span>
                     <span className="text-magenta">{entry.score}</span>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        </div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-auto py-8 pixel-text text-[8px] text-cyan/20"
        >
          TERMINAL_ID: AIS-764423185769 | ACCESS_GRANTED
        </motion.footer>
      </main>
    </div>
  );
}
