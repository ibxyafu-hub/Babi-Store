import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  id?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  id = 'theme-toggle-btn',
  size = 'md'
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const isSmall = size === 'sm';

  return (
    <button
      id={id}
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2B2B] select-none ${
        isDark 
          ? 'bg-[#151515] hover:bg-[#1f1f1f] text-white/90 hover:text-white border border-white/10 hover:border-[#FF2B2B]/50 shadow-md' 
          : 'bg-white hover:bg-neutral-100 text-[#111111] hover:text-black border border-[#E5E5E5] hover:border-[#E50914]/50 shadow-sm'
      } ${
        isSmall ? 'w-8 h-8 p-1.5' : 'w-9 h-9 sm:w-10 sm:h-10 p-2'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="dark-moon"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Moon className={isSmall ? 'w-4 h-4 text-white' : 'w-4 h-4 sm:w-4.5 sm:h-4.5 text-white'} />
          </motion.div>
        ) : (
          <motion.div
            key="light-sun"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Sun className={isSmall ? 'w-4 h-4 text-[#E50914]' : 'w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E50914]'} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
