import React from 'react';
import { motion } from 'motion/react';
import { BRAND_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface HeroProps {
  onContactClick: () => void;
  onServicesClick: () => void;
  onWorkClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactClick, onServicesClick, onWorkClick }) => {
  const { isDark } = useTheme();

  const handleWorkClick = () => {
    if (onWorkClick) {
      onWorkClick();
    } else {
      const el = document.getElementById('work') || document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className={`relative min-h-[90vh] md:min-h-[92vh] lg:min-h-[95vh] flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#080808]' : 'bg-[#F7F7F7]'
      }`}
    >
      {/* Background Ambient Glows & Grid */}
      <div className={`absolute inset-0 bg-grid-pattern pointer-events-none transition-opacity duration-500 ${
        isDark ? 'opacity-30' : 'opacity-40'
      }`}></div>
      <div className="absolute -top-20 -right-20 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#FF2B2B]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-[#E50914]/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col items-start">
          
          {/* Hero Content Block */}
          <div className="w-full max-w-3xl flex flex-col text-left space-y-4 sm:space-y-6">
            
            {/* 1. Main Heading with Responsive Clamp Typography */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className={`text-[clamp(2rem,7.5vw,2.75rem)] sm:text-6xl lg:text-7xl font-black leading-[1.02] sm:leading-[0.96] tracking-tighter uppercase font-display transition-colors break-words ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}>
                {BRAND_INFO.heroHeading.line1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B2B] to-[#E50914]">
                  {BRAND_INFO.heroHeading.line2}
                </span>
                <br />
                {BRAND_INFO.heroHeading.line3}
              </h1>
            </motion.div>

            {/* 2. Short Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`text-sm sm:text-lg max-w-lg leading-relaxed font-light transition-colors ${
                isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
              }`}
            >
              {BRAND_INFO.heroDescription}
            </motion.p>

            {/* 3. CTA Buttons with Mobile Touch Optimization */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2"
            >
              <button
                onClick={onContactClick}
                id="hero-contact-btn"
                className="w-full sm:w-auto bg-[#FF2B2B] hover:bg-[#E50914] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-[0_10px_25px_rgba(255,43,43,0.22)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>LET'S WORK TOGETHER</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onServicesClick}
                id="hero-view-services-btn"
                className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide backdrop-blur-sm transition-all duration-200 active:scale-[0.98] cursor-pointer border flex items-center justify-center ${
                  isDark
                    ? 'border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-[#E5E5E5] hover:border-[#CCCCCC] bg-white hover:bg-neutral-50 text-[#111111] shadow-sm'
                }`}
              >
                EXPLORE SERVICES
              </button>
            </motion.div>

            {/* 5. Mobile-Optimized Compact Centered Visual Placed Below Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="pt-4 sm:pt-6 w-full"
            >
              <div className={`w-full rounded-2xl p-4 sm:p-5 border transition-all ${
                isDark
                  ? 'bg-[#111111]/90 border-white/10 text-white'
                  : 'bg-white border-[#E5E5E5] text-[#111111] shadow-sm'
              }`}>
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-[10px] sm:text-xs font-mono-tech">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-emerald-400">OPEN FOR PROJECTS</span>
                  </div>
                  <span className="text-[#888888]">EST. 2026</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-[#181818]' : 'bg-neutral-100'}`}>
                    <div className="font-display font-black text-sm sm:text-base text-[#FF2B2B]">100%</div>
                    <div className="text-[9px] sm:text-[10px] font-mono-tech text-[#888888] uppercase">Custom Code</div>
                  </div>
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-[#181818]' : 'bg-neutral-100'}`}>
                    <div className="font-display font-black text-sm sm:text-base text-[#FF2B2B]">4K</div>
                    <div className="text-[9px] sm:text-[10px] font-mono-tech text-[#888888] uppercase">Motion/Video</div>
                  </div>
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-[#181818]' : 'bg-neutral-100'}`}>
                    <div className="font-display font-black text-sm sm:text-base text-[#FF2B2B]">FAST</div>
                    <div className="text-[9px] sm:text-[10px] font-mono-tech text-[#888888] uppercase">Top-Up Hub</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 6. Explore Services Trigger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.38 }}
              className="hidden sm:block"
            >
              <div 
                onClick={onServicesClick}
                id="hero-explore-services-btn"
                className={`flex items-center space-x-2.5 pt-2 text-[11px] font-bold uppercase tracking-widest cursor-pointer group w-fit font-mono-tech select-none ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}
              >
                <span className={`transition-colors duration-200 ${
                  isDark ? 'group-hover:text-white' : 'group-hover:text-[#111111]'
                }`}>
                  Explore Services
                </span>
                <div className="w-6 h-[1.5px] bg-[#FF2B2B]/60 group-hover:w-9 group-hover:bg-[#FF2B2B] transition-all duration-300"></div>
                <ArrowDown className="w-3.5 h-3.5 text-[#FF2B2B] transition-transform duration-200 group-hover:translate-y-1" />
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

