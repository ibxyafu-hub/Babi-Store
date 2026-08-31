import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Sparkles, Film, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ShowreelProps {
  onStartProject?: () => void;
  onInquire?: () => void;
}

export const Showreel: React.FC<ShowreelProps> = ({ onStartProject, onInquire }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isDark } = useTheme();

  const handleInquire = () => {
    if (onInquire) onInquire();
    else if (onStartProject) onStartProject();
  };

  return (
    <section 
      id="showreel" 
      className={`py-16 sm:py-20 md:py-24 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] bg-[#FF2B2B]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className={`font-mono-tech text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold ${
                isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
              }`}>
                MOTION & VIDEO EDITING
              </span>
            </div>

            <h2 className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              CREATIVE <span className="text-gradient-red">SHOWREEL</span>
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md leading-relaxed transition-colors ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
          }`}>
            High-retention editing, kinetic typography, dynamic sound design, and promotional motion graphics.
          </p>
        </motion.div>

        {/* Cinematic Video Container (100% width on mobile, 16:9 aspect ratio) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto"
        >
          <div className={`relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 group ${
            isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-[#E5E5E5]'
          }`}>
            
            {!isPlaying ? (
              /* Poster & Play Trigger State */
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop"
                  alt="Apex Creatives Video Showreel"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono-tech font-extrabold tracking-widest uppercase bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-[#FF2B2B]" /> 2026 REEL
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono-tech font-bold uppercase bg-[#FF2B2B]/90 text-white shadow-sm">
                    4K 60FPS
                  </span>
                </div>

                {/* Big Center Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <button
                    onClick={() => setIsPlaying(true)}
                    id="watch-showreel-btn"
                    aria-label="Play showreel video"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF2B2B] hover:bg-[#E50914] text-white flex items-center justify-center shadow-[0_0_40px_rgba(255,43,43,0.6)] active:scale-95 transition-all duration-200 cursor-pointer group/play mb-3"
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5 group-hover/play:scale-110 transition-transform" />
                  </button>

                  <span className="font-display font-black text-sm sm:text-lg text-white uppercase tracking-wider drop-shadow-md">
                    WATCH SHOWREEL
                  </span>
                  <span className="font-mono-tech text-[10px] sm:text-xs text-white/80 mt-1">
                    0:45 SEC • MOTION & EDITING COMPILATION
                  </span>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between text-[10px] sm:text-xs font-mono-tech text-white/80 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                  <span className="truncate">Premiere Pro • After Effects • Sound Mix</span>
                  <span className="text-[#FF2B2B] font-bold shrink-0 ml-2">TAP TO PLAY</span>
                </div>
              </div>
            ) : (
              /* Active Video State */
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                {/* HTML5 sample video with fallback */}
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />

                {/* Close Overlay Button */}
                <button
                  onClick={() => setIsPlaying(false)}
                  aria-label="Close showreel video"
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center border border-white/20 hover:border-[#FF2B2B] active:scale-90 transition-all z-20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
