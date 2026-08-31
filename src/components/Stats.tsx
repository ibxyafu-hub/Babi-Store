import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Code2, Palette, Film, Layers } from 'lucide-react';
import { BRAND_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const Stats: React.FC = () => {
  const { isDark } = useTheme();
  const statIcons = [Layers, Code2, Palette, Film];

  return (
    <section 
      id="stats-section"
      className={`py-14 sm:py-18 md:py-20 relative overflow-hidden transition-colors duration-300 border-t border-b ${
        isDark ? 'bg-[#0B0B0B] border-white/5' : 'bg-[#F0F0F0] border-[#E5E5E5]'
      }`}
    >
      {/* Background Grid Pattern */}
      <div className={`absolute inset-0 bg-grid-pattern pointer-events-none transition-opacity duration-300 ${
        isDark ? 'opacity-20' : 'opacity-30'
      }`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {BRAND_INFO.stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl p-4 sm:p-6 md:p-8 border transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#111111] hover:bg-[#141414] border-white/10 hover:border-[#FF2B2B]/40 shadow-lg'
                    : 'bg-white hover:bg-neutral-50 border-[#E5E5E5] hover:border-[#E50914]/40 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors ${
                    isDark 
                      ? 'bg-[#181818] border-white/10 group-hover:border-[#FF2B2B]/40' 
                      : 'bg-neutral-100 border-[#E5E5E5] group-hover:border-[#E50914]/40'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF2B2B] group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#FF2B2B]/40 group-hover:bg-[#FF2B2B] transition-colors"></span>
                </div>

                <div>
                  <div className="font-display font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-none mb-1 sm:mb-2 text-gradient-red">
                    {stat.value}
                  </div>
                  <div className={`font-display font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase mb-0.5 sm:mb-1 transition-colors ${
                    isDark ? 'text-white' : 'text-[#111111]'
                  }`}>
                    {stat.label}
                  </div>
                  <div className={`text-[10px] sm:text-xs font-mono-tech transition-colors line-clamp-1 sm:line-clamp-none ${
                    isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                  }`}>
                    {stat.detail}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
