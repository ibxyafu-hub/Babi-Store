import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Sparkles, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface StickyMobileCtaProps {
  onStartProject: () => void;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({ onStartProject }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDismissed) return null;

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none"
          >
            <div className={`max-w-md mx-auto rounded-2xl p-2.5 sm:p-3 border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2.5 pointer-events-auto transition-all ${
              isDark
                ? 'bg-[#0D0D0D]/92 border-white/15 text-white shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
                : 'bg-white/95 border-[#E5E5E5] text-[#111111] shadow-[0_10px_30px_rgba(0,0,0,0.15)]'
            }`}>
              
              {/* Left Brand Badge */}
              <div className="flex items-center gap-2 pl-2">
                <span className="w-2 h-2 rounded-full bg-[#FF2B2B] animate-pulse"></span>
                <span className="font-mono-tech text-[10px] font-extrabold uppercase tracking-wider truncate max-w-[100px] sm:max-w-[130px]">
                  Apex Creatives
                </span>
              </div>

              {/* Main Action Button */}
              <button
                onClick={onStartProject}
                id="sticky-mobile-cta-btn"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FF2B2B] hover:bg-[#E50914] text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
              >
                <span>LET'S WORK TOGETHER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Dismiss Button */}
              <button
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss sticky CTA"
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors active:scale-90 ${
                  isDark ? 'text-[#888888] hover:text-white bg-white/5' : 'text-[#666666] hover:text-black bg-neutral-100'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
