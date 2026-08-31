import React from 'react';
import { ArrowUp } from 'lucide-react';
import { BRAND_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { ApexLogo } from './ApexLogo';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer 
      className={`border-t pt-16 pb-12 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#050505] border-white/5' : 'bg-white border-[#E5E5E5]'
      }`} 
      id="main-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Footer Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b ${
          isDark ? 'border-white/5' : 'border-[#E5E5E5]'
        }`}>
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-block focus:outline-none"
              id="footer-brand-logo"
              aria-label="Apex Creatives Home"
            >
              <ApexLogo size="sm" showSubtitle={true} />
            </a>

            <p className={`text-sm max-w-sm leading-relaxed font-light transition-colors ${
              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
            }`}>
              Creative digital solutions for modern brands and creators.
            </p>

            <div className={`flex items-center gap-2 pt-2 text-xs font-mono-tech ${
              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Online & accepting new projects</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-4">
            <span className={`font-mono-tech text-[10px] uppercase tracking-[0.25em] font-bold block mb-4 ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              PORTFOLIO SECTIONS
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-xs transition-colors py-1 flex items-center gap-1.5 font-mono-tech ${
                    isDark 
                      ? 'text-[#A8A8A8] hover:text-[#FF2B2B]' 
                      : 'text-[#666666] hover:text-[#E50914]'
                  }`}
                >
                  <span className="text-[#FF2B2B]/50">/</span> {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Creative Stack Column */}
          <div className="md:col-span-3 space-y-3">
            <span className={`font-mono-tech text-[10px] uppercase tracking-[0.25em] font-bold block mb-2 ${
              isDark ? 'text-white' : 'text-[#111111]'
            }`}>
              SERVICES
            </span>
            <ul className={`text-xs space-y-1.5 font-mono-tech ${
              isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
            }`}>
              <li>• Website Development</li>
              <li>• Gaming Top-Up</li>
              <li>• Social Media Services</li>
              <li>• Graphic Design & Video Editing</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-xs font-mono-tech text-center sm:text-left ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
          }`}>
            © 2026 APEX CREATIVES. All Rights Reserved.
          </p>

          <a
            href={BRAND_INFO.socials.telegram}
            target="_blank"
            rel="noreferrer"
            className={`text-xs font-mono-tech transition-colors cursor-pointer ${
              isDark ? 'text-[#A8A8A8] hover:text-[#FF2B2B]' : 'text-[#666666] hover:text-[#E50914]'
            }`}
          >
            Built by Babi.
          </a>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            id="back-to-top-btn"
            className={`flex items-center gap-2 text-xs font-mono-tech font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-[#111111] hover:bg-[#181818] text-[#A8A8A8] hover:text-white border-white/10 hover:border-[#FF2B2B]/40'
                : 'bg-neutral-100 hover:bg-neutral-200 text-[#666666] hover:text-[#111111] border-[#E5E5E5] hover:border-[#E50914]/40 shadow-sm'
            }`}
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
