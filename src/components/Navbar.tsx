import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Sparkles, Send } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { ApexLogo } from './ApexLogo';

interface NavbarProps {
  onWorkTogetherClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onWorkTogetherClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark } = useTheme();

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#about' },
    { name: 'SERVICES', href: '#services' },
    { name: 'PROCESS', href: '#workflow' },
    { name: 'CONTACT', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Update active section based on scroll position
      const sections = ['home', 'about', 'services', 'workflow', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#080808]/92 backdrop-blur-xl border-b border-white/5 py-2 sm:py-2.5 shadow-2xl'
            : 'bg-white/92 backdrop-blur-xl border-b border-[#E5E5E5] py-2 sm:py-2.5 shadow-sm'
          : isDark
            ? 'bg-[#080808]/50 backdrop-blur-md py-3.5 sm:py-4 border-b border-white/5'
            : 'bg-[#F7F7F7]/85 backdrop-blur-md py-3.5 sm:py-4 border-b border-[#E5E5E5]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[46px] sm:min-h-[52px]">
        {/* Official Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="focus:outline-none rounded-lg cursor-pointer select-none flex items-center"
          id="navbar-brand-logo"
          aria-label="Apex Creatives Home"
        >
          <ApexLogo size="md" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-7 lg:space-x-8 text-[11px] font-bold tracking-[0.2em] uppercase font-mono-tech" id="desktop-nav">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? isDark ? 'text-[#FF2B2B] font-extrabold' : 'text-[#E50914] font-extrabold'
                    : isDark ? 'text-[#A8A8A8] hover:text-white' : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF2B2B] rounded-full"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Theme Switcher & CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Minimal Icon Theme Switcher */}
          <ThemeToggle id="navbar-theme-toggle" />

          {/* Desktop Work Together CTA */}
          <button
            onClick={onWorkTogetherClick}
            id="navbar-cta-button"
            className={`hidden sm:inline-flex px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider items-center group transition-all duration-200 cursor-pointer shadow-md active:scale-[0.98] ${
              isDark 
                ? 'bg-white hover:bg-white/90 text-black shadow-black/40' 
                : 'bg-[#111111] hover:bg-black text-white shadow-neutral-300'
            }`}
          >
            <span>Let's Work Together</span>
            <span className="ml-2 text-[#FF2B2B] font-black transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 active:scale-[0.95] focus:outline-none cursor-pointer ${
              isDark 
                ? 'bg-[#111111] border border-white/10 text-white hover:border-[#FF2B2B]/60' 
                : 'bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#E50914]/60 shadow-sm'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF2B2B]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Full Screen / Overlay Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`md:hidden fixed inset-x-0 top-[60px] sm:top-[68px] bottom-0 z-50 overflow-y-auto px-5 py-6 flex flex-col justify-between shadow-2xl backdrop-blur-2xl transition-colors ${
              isDark 
                ? 'bg-[#080808]/98 text-white border-t border-white/10' 
                : 'bg-[#F9F9F9]/98 text-[#111111] border-t border-[#E5E5E5]'
            }`}
            id="mobile-nav-fullscreen-menu"
          >
            <div className="flex flex-col gap-2">
              {/* Menu Header / Info */}
              <div className={`flex items-center justify-between pb-3 mb-2 border-b ${
                isDark ? 'border-white/10' : 'border-[#E5E5E5]'
              }`}>
                <span className={`font-mono-tech text-[11px] tracking-widest uppercase font-bold ${
                  isDark ? 'text-[#A8A8A8]' : 'text-[#666666]'
                }`}>
                  NAVIGATION
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#FF2B2B] bg-[#FF2B2B]/10 px-2.5 py-1 rounded-full border border-[#FF2B2B]/20">
                  <ApexLogo variant="icon" size="xs" />
                  <span>APEX CREATIVES</span>
                </span>
              </div>

              {/* Navigation Items (HOME, ABOUT, SERVICES, WORK, SKILLS, CONTACT) */}
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.replace('#', '');
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`flex items-center justify-between py-3.5 px-4 rounded-xl text-base font-extrabold tracking-wider transition-all duration-150 border ${
                        isActive
                          ? isDark 
                            ? 'text-[#FF2B2B] bg-white/5 border-white/10' 
                            : 'text-[#E50914] bg-white border-[#E5E5E5] shadow-sm'
                          : isDark
                            ? 'text-white hover:text-[#FF2B2B] hover:bg-white/5 border-transparent'
                            : 'text-[#111111] hover:text-[#E50914] hover:bg-white border-transparent'
                      }`}
                    >
                      <span className="font-display">{link.name}</span>
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-[#FF2B2B] translate-x-1' : 'opacity-40'
                      }`} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions inside Mobile Menu */}
            <div className={`pt-6 mt-6 border-t flex flex-col gap-3.5 pb-8 ${
              isDark ? 'border-white/10' : 'border-[#E5E5E5]'
            }`}>
              {/* Theme Toggle inside Menu */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-[#E5E5E5]'
              }`}>
                <span className="font-mono-tech text-xs font-bold uppercase tracking-wider">
                  Appearance Mode
                </span>
                <ThemeToggle id="mobile-menu-theme-toggle" />
              </div>

              {/* LET'S WORK TOGETHER Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onWorkTogetherClick();
                }}
                className="w-full py-4 px-6 rounded-xl text-xs font-black uppercase tracking-widest bg-[#FF2B2B] hover:bg-[#E50914] text-white flex items-center justify-center gap-2.5 shadow-xl apex-glow-sm active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                <span>LET'S WORK TOGETHER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
