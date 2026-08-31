import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  ArrowRight, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Gauge, 
  Code2, 
  Layers 
} from 'lucide-react';

interface FeaturedWebsiteProps {
  onViewWebProjects: () => void;
}

export const FeaturedWebsite: React.FC<FeaturedWebsiteProps> = ({ onViewWebProjects }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const floatingLabels = [
    { label: 'RESPONSIVE', desc: 'Flawless across all devices', icon: Laptop },
    { label: 'FAST', desc: '99+ PageSpeed score', icon: Zap },
    { label: 'MODERN', desc: 'Dark tech & motion UI', icon: Sparkles },
    { label: 'CUSTOM', desc: 'Bespoke code architecture', icon: Code2 },
  ];

  return (
    <section id="featured-web" className="py-24 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF2B2B]/8 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF2B2B]"></span>
            <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#FF2B2B] font-bold">
              FEATURED CAPABILITY
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-4">
            WEBSITES THAT<br />
            <span className="text-[#FF2B2B] drop-shadow-[0_0_20px_rgba(255,43,43,0.3)]">MAKE AN IMPACT.</span>
          </h2>

          <p className="text-base text-[#A8A8A8] max-w-xl mx-auto">
            Engineered with modern frontend technology, lightning-fast loading speeds, and immersive dark aesthetics that elevate brand authority.
          </p>
        </div>

        {/* Browser Mockup Area */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Device Switcher Toolbar */}
          <div className="flex items-center justify-between bg-[#111111] border border-white/10 rounded-t-2xl px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-3">
                <span className="w-3 h-3 rounded-full bg-[#FF2B2B]/80"></span>
                <span className="w-3 h-3 rounded-full bg-[#333333]"></span>
                <span className="w-3 h-3 rounded-full bg-[#222222]"></span>
              </div>
              <span className="hidden sm:inline-block font-mono-tech text-xs text-[#A8A8A8] bg-[#0A0A0A] px-3 py-1 rounded border border-white/5 truncate max-w-xs">
                https://apex-showcase.agency/vanguard
              </span>
            </div>

            {/* Device Toggle Buttons */}
            <div className="flex items-center bg-[#080808] p-1 rounded-xl border border-white/10 gap-1">
              <button
                onClick={() => setDeviceMode('desktop')}
                aria-label="Desktop preview mode"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-[#FF2B2B] text-white shadow-sm'
                    : 'text-[#A8A8A8] hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Desktop</span>
              </button>

              <button
                onClick={() => setDeviceMode('tablet')}
                aria-label="Tablet preview mode"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'tablet'
                    ? 'bg-[#FF2B2B] text-white shadow-sm'
                    : 'text-[#A8A8A8] hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Tablet</span>
              </button>

              <button
                onClick={() => setDeviceMode('mobile')}
                aria-label="Mobile preview mode"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-[#FF2B2B] text-white shadow-sm'
                    : 'text-[#A8A8A8] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Mobile</span>
              </button>
            </div>
          </div>

          {/* Browser Window Body */}
          <div className="bg-[#0D0D0D] border-x border-b border-white/10 rounded-b-2xl p-4 sm:p-8 shadow-2xl transition-all duration-500 overflow-hidden">
            
            {/* Viewport Frame with Responsive Resizing */}
            <div
              className={`mx-auto transition-all duration-500 bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl ${
                deviceMode === 'desktop'
                  ? 'w-full'
                  : deviceMode === 'tablet'
                  ? 'max-w-xl'
                  : 'max-w-xs'
              }`}
            >
              {/* Fictional Website Content Mockup */}
              <div className="p-5 sm:p-7 space-y-6">
                
                {/* Mock Nav */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#FF2B2B] flex items-center justify-center font-bold text-white text-[10px]">
                      V
                    </div>
                    <span className="font-display font-extrabold text-sm text-white">VANGUARD CYBER</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#A8A8A8] font-mono-tech">
                    <span>Products</span>
                    <span>Solutions</span>
                    <span className="text-white bg-white/10 px-2 py-0.5 rounded">Launch App</span>
                  </div>
                </div>

                {/* Mock Hero Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono-tech text-[#FF2B2B] uppercase tracking-wider block font-bold">
                      Enterprise Next-Gen UI
                    </span>
                    <h4 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                      Architecting High-Speed Platforms.
                    </h4>
                    <p className="text-[11px] text-[#A8A8A8] leading-relaxed">
                      Zero compromise between bespoke aesthetic design and sub-second load times.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-3 py-1 rounded text-[10px] font-extrabold bg-[#FF2B2B] text-white">
                        Explore Deck
                      </span>
                      <span className="px-3 py-1 rounded text-[10px] font-semibold bg-white/5 text-[#A8A8A8] border border-white/10">
                        Docs
                      </span>
                    </div>
                  </div>

                  {/* Visual UI Box in Mockup */}
                  <div className="bg-[#090909] rounded-lg p-3.5 border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#A8A8A8]">
                      <span>Live Metrics</span>
                      <span className="text-emerald-400 font-bold">● 99.98% Uptime</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF2B2B] w-4/5"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[9px] font-mono-tech">
                      <div className="bg-[#141414] p-2 rounded border border-white/5">
                        <span className="text-[#A8A8A8] block">Latency</span>
                        <span className="text-white font-bold">14ms</span>
                      </div>
                      <div className="bg-[#141414] p-2 rounded border border-white/5">
                        <span className="text-[#A8A8A8] block">Performance</span>
                        <span className="text-[#FF2B2B] font-bold">100 / 100</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Floating Feature Badges around mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {floatingLabels.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-[#111111] p-3.5 rounded-xl border border-white/10 flex items-center gap-3 hover:border-[#FF2B2B]/40 transition-colors shadow-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#181818] border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#FF2B2B]" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-xs text-white block tracking-wider">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#A8A8A8] block leading-tight font-mono-tech">
                      {item.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="text-center mt-10">
            <button
              onClick={onViewWebProjects}
              id="view-web-projects-btn"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#FF2B2B] text-white hover:bg-[#E50914] transition-all duration-300 apex-glow-sm hover:apex-glow hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>VIEW WEB PROJECTS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
