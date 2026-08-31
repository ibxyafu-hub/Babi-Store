import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Compass, Wand2, CheckCircle, ArrowDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HowIWorkProps {
  onStartProject?: () => void;
}

export const HowIWork: React.FC<HowIWorkProps> = ({ onStartProject }) => {
  const { isDark } = useTheme();

  const steps = [
    {
      number: '01',
      title: 'DISCOVER',
      subtitle: 'Tell me your idea.',
      description: 'Share your vision, brand objectives, or reference links. We align on scope and expectations upfront.',
      icon: MessageSquare,
    },
    {
      number: '02',
      title: 'PLAN',
      subtitle: 'Plan the best solution.',
      description: 'Strategy, wireframing, moodboards, and structural roadmap designed for maximum visual retention.',
      icon: Compass,
    },
    {
      number: '03',
      title: 'CREATE',
      subtitle: 'Build / design / edit.',
      description: 'Hands-on production — bespoke web code, precision graphic design, or dynamic short-form video editing.',
      icon: Wand2,
    },
    {
      number: '04',
      title: 'DELIVER',
      subtitle: 'Receive the finished project.',
      description: 'Final quality check, responsive testing, production-ready source files, and launch support.',
      icon: CheckCircle,
    },
  ];

  return (
    <section 
      id="workflow" 
      className={`py-12 sm:py-16 md:py-20 relative overflow-hidden scroll-mt-16 transition-colors duration-300 border-t ${
        isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[#FF2B2B]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
              <span className={`font-mono-tech text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold ${
                isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
              }`}>
                WORKFLOW & PROCESS
              </span>
            </div>

            <h2 className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              HOW I <span className="text-gradient-red">WORK</span>
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md leading-relaxed transition-colors ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
          }`}>
            A simple, transparent 4-step workflow designed to deliver fast results without unnecessary friction.
          </p>
        </motion.div>

        {/* 1. Mobile Vertical Timeline (< 768px) */}
        <div className="block md:hidden space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.number}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className={`rounded-2xl p-5 border transition-all duration-200 ${
                    isDark
                      ? 'bg-[#111111] border-white/10 text-white'
                      : 'bg-white border-[#E5E5E5] text-[#111111] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tech font-black text-xs px-2.5 py-1 rounded bg-[#FF2B2B] text-white">
                        {step.number}
                      </span>
                      <h3 className="font-display font-black text-lg tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-[#181818] text-[#FF2B2B]' : 'bg-neutral-100 text-[#E50914]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-[#FF2B2B] mb-1.5 font-mono-tech">
                    {step.subtitle}
                  </p>

                  <p className={`text-xs leading-relaxed font-light ${
                    isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                  }`}>
                    {step.description}
                  </p>
                </motion.div>

                {!isLast && (
                  <div className="flex justify-center py-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                      isDark ? 'bg-[#111111] border-white/10 text-[#FF2B2B]' : 'bg-white border-[#E5E5E5] text-[#E50914]'
                    }`}>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 2. Desktop 4-Column Timeline Grid (>= 768px) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#111111] hover:bg-[#141414] border-white/10 hover:border-[#FF2B2B]/40 shadow-xl'
                    : 'bg-white hover:bg-neutral-50 border-[#E5E5E5] hover:border-[#E50914]/40 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono-tech font-extrabold text-xs px-3 py-1 rounded-md bg-[#FF2B2B] text-white">
                      {step.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                      isDark 
                        ? 'bg-[#181818] border-white/10 text-[#FF2B2B]' 
                        : 'bg-neutral-100 border-[#E5E5E5] text-[#E50914]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className={`font-display font-black text-xl mb-1 tracking-tight ${
                    isDark ? 'text-white' : 'text-[#111111]'
                  }`}>
                    {step.title}
                  </h3>

                  <p className="text-xs font-semibold text-[#FF2B2B] mb-3 font-mono-tech">
                    {step.subtitle}
                  </p>

                  <p className={`text-xs leading-relaxed font-light ${
                    isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                  }`}>
                    {step.description}
                  </p>
                </div>

                <div className={`pt-4 mt-6 border-t font-mono-tech text-[10px] uppercase tracking-widest ${
                  isDark ? 'border-white/5 text-[#888888]' : 'border-[#E5E5E5] text-[#999999]'
                }`}>
                  Phase {step.number}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
