import React from 'react';
import { motion } from 'motion/react';
import { SERVICES_DATA } from '../data/portfolioData';
import { 
  Code, 
  Gamepad2, 
  TrendingUp, 
  Palette, 
  Film, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const { isDark } = useTheme();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return Code;
      case 'Gamepad2':
        return Gamepad2;
      case 'TrendingUp':
        return TrendingUp;
      case 'Palette':
        return Palette;
      case 'Film':
        return Film;
      default:
        return Sparkles;
    }
  };

  const handleServiceClick = (serviceTitle: string) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
  };

  return (
    <section 
      id="services" 
      className={`py-12 sm:py-16 md:py-20 relative overflow-hidden scroll-mt-16 transition-colors duration-300 border-t ${
        isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Background glow dots */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#FF2B2B]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className={`font-mono-tech text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold ${
                isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
              }`}>
                OUR EXPERTISE
              </span>
            </div>

            <h2 className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              SPECIALIZED <span className="text-gradient-red">SERVICES</span>
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md leading-relaxed transition-colors ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
          }`}>
            High-performance web applications, fast gaming & social media solutions, dynamic graphic design, and cinematic video editing.
          </p>
        </motion.div>

        {/* Services Grid (Single Stack on Mobile, Multi-col on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES_DATA.map((service, index) => {
            const Icon = getIcon(service.iconName);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleServiceClick(service.title)}
                className={`group relative rounded-2xl p-5 sm:p-7 md:p-8 border transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.99] active:border-[#FF2B2B] hover:-translate-y-1 ${
                  index === 0 ? 'lg:col-span-2' : ''
                } ${
                  isDark
                    ? 'bg-[#111111] hover:bg-[#141414] border-white/10 hover:border-[#FF2B2B]/40 shadow-lg'
                    : 'bg-white hover:bg-neutral-50 border-[#E5E5E5] hover:border-[#E50914]/40 shadow-sm'
                }`}
                id={`service-card-${service.id}`}
              >
                <div>
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <span className={`font-mono-tech text-xs sm:text-sm font-black tracking-widest ${
                      isDark ? 'text-[#A8A8A8]' : 'text-[#888888]'
                    }`}>
                      {service.number}
                    </span>
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${
                      isDark 
                        ? 'bg-[#181818] border-white/10 text-[#FF2B2B] group-hover:border-[#FF2B2B]/40' 
                        : 'bg-neutral-100 border-[#E5E5E5] text-[#E50914] group-hover:border-[#E50914]/40'
                    }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Tagline */}
                  <span className={`text-[9px] sm:text-[10px] font-mono-tech uppercase tracking-[0.2em] block mb-1.5 sm:mb-2 font-bold ${
                    isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
                  }`}>
                    {service.tagline}
                  </span>

                  {/* Title */}
                  <h3 className={`font-display font-extrabold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 tracking-tight transition-colors ${
                    isDark ? 'text-white' : 'text-[#111111]'
                  }`}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed font-light mb-4 sm:mb-6 transition-colors line-clamp-3 sm:line-clamp-none ${
                    isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                  }`}>
                    {service.description}
                  </p>

                  {/* Deliverables Mini List */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t ${
                    isDark ? 'border-white/5' : 'border-[#E5E5E5]'
                  }`}>
                    {service.deliverables.map((item) => (
                      <div key={item} className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-mono-tech ${
                        isDark ? 'text-[#C0C0C0]' : 'text-[#444444]'
                      }`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                          isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
                        }`} />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle corner accent on hover */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF2B2B]/0 group-hover:bg-[#FF2B2B]/5 rounded-tr-2xl rounded-bl-full transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
