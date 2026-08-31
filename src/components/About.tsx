import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BRAND_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface AboutProps {
  onStartCollaboration?: () => void;
}

export const About: React.FC<AboutProps> = ({ onStartCollaboration }) => {
  const { isDark } = useTheme();

  return (
    <section 
      id="about" 
      className={`py-12 sm:py-16 md:py-20 relative overflow-hidden scroll-mt-16 transition-colors duration-300 border-t ${
        isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F7F7F7] border-[#E5E5E5]'
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FF2B2B]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col mb-10 sm:mb-14"
        >
          <p className={`text-[11px] sm:text-[12px] font-bold tracking-[0.3em] uppercase mb-2 sm:mb-3 font-mono-tech ${
            isDark ? 'text-[#FF2B2B]' : 'text-[#E50914]'
          }`}>
            ABOUT APEX CREATIVES
          </p>

          <h2 className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] transition-colors ${
            isDark ? 'text-white' : 'text-[#111111]'
          }`}>
            CRAFTED WITH PRECISION <br />
            <span className="text-gradient-red">& DIGITAL POWER.</span>
          </h2>
        </motion.div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-4 sm:space-y-6"
          >
            <p className={`text-base sm:text-lg md:text-xl font-medium leading-relaxed transition-colors ${
              isDark ? 'text-white/90' : 'text-[#222222]'
            }`}>
              Apex Creatives is a modern digital solutions and creative studio founded by <span className={isDark ? 'text-[#FF2B2B] font-bold' : 'text-[#E50914] font-bold'}>Babi</span>, built to help brands, creators, gamers, and businesses thrive in high-paced digital spaces.
            </p>

            <p className={`text-xs sm:text-sm md:text-base leading-relaxed font-light transition-colors ${
              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
            }`}>
              From custom modern website development and high-converting graphic design to fast, dependable gaming top-ups and social media growth kits, every service is executed with maximum speed, aesthetic perfection, and dependable communication.
            </p>

            {/* Credibility Checklist */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className={`flex items-center gap-2.5 text-xs font-mono-tech transition-colors ${
                isDark ? 'text-[#C0C0C0]' : 'text-[#444444]'
              }`}>
                <CheckCircle className="w-4 h-4 text-[#FF2B2B] shrink-0" />
                <span>Fast Turnaround & Delivery</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs font-mono-tech transition-colors ${
                isDark ? 'text-[#C0C0C0]' : 'text-[#444444]'
              }`}>
                <CheckCircle className="w-4 h-4 text-[#FF2B2B] shrink-0" />
                <span>Clean Modern Aesthetics</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs font-mono-tech transition-colors ${
                isDark ? 'text-[#C0C0C0]' : 'text-[#444444]'
              }`}>
                <CheckCircle className="w-4 h-4 text-[#FF2B2B] shrink-0" />
                <span>100% Reliable Transactions</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs font-mono-tech transition-colors ${
                isDark ? 'text-[#C0C0C0]' : 'text-[#444444]'
              }`}>
                <ShieldCheck className="w-4 h-4 text-[#FF2B2B] shrink-0" />
                <span>Direct Personal Service</span>
              </div>
            </div>
          </motion.div>

          {/* Right Brand & Creator Signature Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 border ${
                isDark 
                  ? 'bg-[#111111] border-white/10 shadow-2xl hover:border-[#FF2B2B]/40' 
                  : 'bg-white border-[#E5E5E5] shadow-lg hover:border-[#E50914]/40'
              }`}
            >
              {/* Corner tech accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF2B2B]/5 rounded-bl-full pointer-events-none"></div>

              {/* Creator Bio Block */}
              <div className="space-y-3 mb-6 sm:mb-8">
                <div className={`text-[10px] font-mono-tech uppercase tracking-[0.25em] font-bold ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>
                  IDENTITY & LEAD CREATOR
                </div>
                <div>
                  <a
                    href={BRAND_INFO.socials.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-xl sm:text-2xl font-display font-extrabold transition-colors inline-flex items-center gap-2 group cursor-pointer ${
                      isDark ? 'text-white hover:text-[#FF2B2B]' : 'text-[#111111] hover:text-[#E50914]'
                    }`}
                  >
                    <span>Built by Babi.</span>
                    <span className={`text-xs font-mono-tech font-normal transition-colors inline-flex items-center gap-0.5 ${
                      isDark ? 'text-[#A8A8A8] group-hover:text-[#229ED9]' : 'text-[#666666] group-hover:text-[#229ED9]'
                    }`}>
                      (@Raf_babi)
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </a>
                </div>
                <p className={`text-xs leading-relaxed font-light transition-colors ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>
                  Dedicated to turning vision into modern digital assets with high attention to performance, typography, and seamless client experience.
                </p>
              </div>

              {/* Signature Box */}
              <div className={`rounded-2xl p-4 border flex items-center justify-between transition-colors ${
                isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-neutral-50 border-[#E5E5E5]'
              }`}>
                <div>
                  <span className={`text-[10px] font-mono-tech uppercase block ${
                    isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                  }`}>
                    Signature
                  </span>
                  {/* Stylized handwritten signature linking to Telegram */}
                  <a
                    href={BRAND_INFO.socials.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="font-serif italic font-bold text-2xl sm:text-3xl text-gradient-red tracking-wider hover:opacity-80 transition-opacity cursor-pointer block"
                  >
                    ~ Babi
                  </a>
                </div>
                <div className="text-right">
                  <a
                    href={BRAND_INFO.socials.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono-tech text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Available for Work
                  </a>
                </div>
              </div>

              {/* Bottom Tagline */}
              <div className={`mt-5 sm:mt-6 pt-4 border-t flex items-center justify-between text-[11px] font-mono-tech transition-colors ${
                isDark ? 'border-white/5 text-[#A8A8A8]' : 'border-[#E5E5E5] text-[#666666]'
              }`}>
                <span>Web • Top-Up • Design • Video</span>
                <button
                  onClick={onStartCollaboration}
                  className={`font-bold transition-colors cursor-pointer ${
                    isDark ? 'text-[#FF2B2B] hover:text-white' : 'text-[#E50914] hover:text-black'
                  }`}
                >
                  START COLLAB →
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
