import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CtaSectionProps {
  onStartProject: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartProject }) => {
  const { isDark } = useTheme();

  return (
    <section className={`py-10 sm:py-14 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#080808]' : 'bg-[#F7F7F7]'
    }`}>
      {/* Background Subtle Red Ambient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-[#FF2B2B]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`border rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-b from-[#141414] to-[#0D0D0D] border-white/15 shadow-2xl hover:border-[#FF2B2B]/40'
              : 'bg-gradient-to-b from-white to-neutral-50 border-[#E5E5E5] shadow-xl hover:border-[#E50914]/40'
          }`}
        >
          
          {/* Subtle decorative grid lines */}
          <div className={`absolute inset-0 bg-grid-pattern pointer-events-none transition-opacity duration-300 ${
            isDark ? 'opacity-30' : 'opacity-40'
          }`}></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Pill Eyebrow */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-6 border ${
              isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-neutral-100 border-[#E5E5E5]'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#FF2B2B]" />
              <span className={`font-mono-tech text-xs uppercase tracking-[0.2em] font-bold ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}>
                LET'S TALK BUSINESS
              </span>
            </div>

            {/* Main CTA Headings */}
            <h2 className={`font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-3 transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              HAVE A PROJECT<br />
              <span className="text-[#FF2B2B] drop-shadow-[0_0_25px_rgba(255,43,43,0.3)]">IN MIND?</span>
            </h2>

            <h3 className={`font-display font-extrabold text-xl sm:text-2xl tracking-wide uppercase mb-6 transition-colors ${
              isDark ? 'text-white/90' : 'text-[#222222]'
            }`}>
              LET'S BUILD SOMETHING GREAT TOGETHER.
            </h3>

            {/* Supporting Text */}
            <p className={`text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed transition-colors ${
              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
            }`}>
              Whether you need a website, creative design, video editing or digital services, let's turn your idea into something real.
            </p>

            {/* Action Button with Tactile Feedback */}
            <div>
              <button
                onClick={onStartProject}
                id="cta-start-project-btn"
                className="inline-flex items-center gap-3 px-8 py-4 sm:px-9 sm:py-4 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-[#FF2B2B] text-white hover:bg-[#E50914] transition-all duration-200 apex-glow active:scale-[0.98] cursor-pointer shadow-xl group"
              >
                <span>START A PROJECT</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Brand Signature Footnote */}
            <div className={`mt-10 pt-6 border-t flex items-center justify-center gap-2 font-mono-tech text-xs ${
              isDark ? 'border-white/10 text-[#A8A8A8]' : 'border-[#E5E5E5] text-[#666666]'
            }`}>
              <span>Apex Creatives</span>
              <span className="text-[#FF2B2B]">•</span>
              <span>By Babi</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
