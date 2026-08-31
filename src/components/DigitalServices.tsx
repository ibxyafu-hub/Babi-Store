import React from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  Smartphone, 
  Zap, 
  Check, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Share2 
} from 'lucide-react';
import { TOPUP_GAMES_LIST, TOPUP_SOCIAL_LIST } from '../data/portfolioData';

interface DigitalServicesProps {
  onInquireTopUp: (type: 'gaming' | 'social') => void;
}

export const DigitalServices: React.FC<DigitalServicesProps> = ({ onInquireTopUp }) => {
  const pillars = [
    { label: 'FAST', desc: 'Swift processing & quick fulfillment', icon: Zap },
    { label: 'EASY', desc: 'Straightforward order submission', icon: Sparkles },
    { label: 'RELIABLE', desc: 'Direct verification & clear updates', icon: Shield },
  ];

  return (
    <section id="digital-services" className="py-24 bg-[#080808] relative overflow-hidden border-t border-white/5">
      {/* Glow aura */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#FF2B2B]/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
            <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#FF2B2B] font-bold">
              DIGITAL TOP-UP HUB
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-4">
            DIGITAL SERVICES,<br />
            <span className="text-[#FF2B2B]">MADE SIMPLE.</span>
          </h2>

          <p className="text-base text-[#A8A8A8] max-w-xl mx-auto">
            Convenient, transparent in-game currency top-ups and social media engagement solutions designed for creators, players, and digital communities.
          </p>

          {/* 3 Core Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.label} className="flex items-center gap-2 text-xs font-mono-tech text-white bg-[#111111] px-4 py-2 rounded-full border border-white/10">
                  <Icon className="w-3.5 h-3.5 text-[#FF2B2B]" />
                  <span className="font-bold tracking-wider">{pillar.label}:</span>
                  <span className="text-[#A8A8A8]">{pillar.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Large Featured Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Gaming Top-Up */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#111111] rounded-3xl p-7 sm:p-9 border border-white/10 hover:border-[#FF2B2B]/50 transition-all duration-300 relative group flex flex-col justify-between hover:apex-glow-sm"
          >
            {/* Corner ambient glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF2B2B]/10 rounded-tr-3xl rounded-bl-full pointer-events-none group-hover:bg-[#FF2B2B]/15 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/15 flex items-center justify-center text-[#FF2B2B] group-hover:scale-105 transition-transform duration-300">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#FF2B2B] font-bold">
                      IN-GAME CURRENCIES
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                      GAMING TOP-UP
                    </h3>
                  </div>
                </div>

                <span className="font-mono-tech text-xs bg-[#1C1C1C] text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Quick Delivery
                </span>
              </div>

              <p className="text-sm text-[#A8A8A8] mb-6 leading-relaxed">
                Fast and convenient game credits, battle passes, and currency vouchers for leading titles. Send your player ID and package preference for swift processing.
              </p>

              {/* Supported Games Badges */}
              <div className="space-y-2 mb-8">
                <span className="font-mono-tech text-xs text-[#A8A8A8] uppercase tracking-wider block">
                  Supported Games & Packages:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TOPUP_GAMES_LIST.map((game) => (
                    <div
                      key={game.id}
                      className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 hover:border-white/20 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block truncate">{game.name}</span>
                        <span className="text-[10px] text-[#A8A8A8] font-mono-tech">{game.popularItem}</span>
                      </div>
                      <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded bg-[#1A1A1A] text-[#FF2B2B] border border-[#FF2B2B]/20 shrink-0">
                        {game.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inquire Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => onInquireTopUp('gaming')}
                id="gaming-topup-inquire-btn"
                className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#FF2B2B] text-white hover:bg-[#E50914] flex items-center justify-center gap-2 transition-all duration-200 apex-glow-sm active:scale-[0.98] cursor-pointer"
              >
                <span>REQUEST GAMING TOP-UP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Social Media Top-Up */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.38, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#111111] rounded-3xl p-7 sm:p-9 border border-white/10 hover:border-[#FF2B2B]/50 transition-all duration-300 relative group flex flex-col justify-between hover:apex-glow-sm"
          >
            {/* Corner ambient glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#E50914]/10 rounded-tr-3xl rounded-bl-full pointer-events-none group-hover:bg-[#E50914]/15 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/15 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform duration-300">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#FF2B2B] font-bold">
                      CREATOR & COMMUNITY GROWTH
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                      SOCIAL MEDIA TOP-UP
                    </h3>
                  </div>
                </div>

                <span className="font-mono-tech text-xs bg-[#1C1C1C] text-blue-400 font-bold px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5">
                  <Flame className="w-3 h-3" /> Growth Boost
                </span>
              </div>

              <p className="text-sm text-[#A8A8A8] mb-6 leading-relaxed">
                Tailored digital solutions to amplify brand visibility, channel reach, and community engagement across premier social platforms.
              </p>

              {/* Supported Platforms Grid */}
              <div className="space-y-2 mb-8">
                <span className="font-mono-tech text-xs text-[#A8A8A8] uppercase tracking-wider block">
                  Platform Growth Options:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TOPUP_SOCIAL_LIST.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#0A0A0A] p-3 rounded-xl border border-white/5 hover:border-white/20 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{item.platform}</span>
                        <span className="text-[10px] text-[#A8A8A8] font-mono-tech">{item.type}</span>
                      </div>
                      <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded bg-[#1A1A1A] text-white/70 border border-white/10 shrink-0">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inquire Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => onInquireTopUp('social')}
                id="social-topup-inquire-btn"
                className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#222222] text-white border border-white/15 hover:border-[#FF2B2B]/60 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>REQUEST SOCIAL TOP-UP</span>
                <ArrowRight className="w-4 h-4 text-[#FF2B2B]" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
