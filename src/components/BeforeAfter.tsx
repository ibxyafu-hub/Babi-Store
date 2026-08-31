import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sliders, ArrowLeftRight, MoveHorizontal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BeforeAfterProps {
  onInquire?: () => void;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ onInquire }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section 
      id="before-after" 
      className={`py-16 sm:py-20 md:py-24 relative overflow-hidden transition-colors duration-300 border-t ${
        isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
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
                TRANSFORMATION SHOWCASE
              </span>
            </div>

            <h2 className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              BEFORE & <span className="text-gradient-red">AFTER</span>
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md leading-relaxed transition-colors ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
          }`}>
            Slide to see the difference professional grading, typography, and aesthetic direction make for brand assets.
          </p>
        </motion.div>

        {/* Comparison Slider Container (Full Width on Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Quick preset buttons for mobile tap access */}
          <div className="flex items-center justify-between gap-2 mb-3 px-1 sm:hidden">
            <button
              onClick={() => setSliderPosition(15)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono-tech font-bold uppercase bg-black/60 text-white/90 border border-white/10 active:scale-95 transition-all"
            >
              See Before
            </button>
            <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#A8A8A8]">
              <MoveHorizontal className="w-3.5 h-3.5 text-[#FF2B2B]" /> Drag slider
            </div>
            <button
              onClick={() => setSliderPosition(85)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono-tech font-bold uppercase bg-[#FF2B2B] text-white active:scale-95 transition-all"
            >
              See After
            </button>
          </div>

          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={(e) => handleMove(e.clientX)}
            className={`relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl select-none cursor-ew-resize touch-none ${
              isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-[#E5E5E5]'
            }`}
          >
            {/* 1. After Image (Background layer - Full Refined Apex Visual) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                alt="Apex Creatives Refined Visual After"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* After Badge */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
                <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono-tech font-extrabold tracking-wider uppercase bg-[#FF2B2B] text-white shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> AFTER (APEX)
                </span>
              </div>
            </div>

            {/* 2. Before Image (Foreground Clipped layer - Raw Concept / Flat Visual) */}
            <div
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="relative w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
                  alt="Raw Concept Visual Before"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-75 contrast-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Before Badge */}
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10">
                  <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono-tech font-bold tracking-wider uppercase bg-black/80 text-white/90 border border-white/20 backdrop-blur-md">
                    BEFORE (RAW)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Divider Line & Tactile Drag Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FF2B2B] border-2 border-white shadow-2xl flex items-center justify-center text-white">
                <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

          </div>

          {/* Bottom Hint */}
          <div className="flex items-center justify-between mt-3 px-2 text-[11px] font-mono-tech text-[#888888]">
            <span>Raw Concept vs Final Production</span>
            <span className="text-[#FF2B2B] font-bold">100% Polish</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
