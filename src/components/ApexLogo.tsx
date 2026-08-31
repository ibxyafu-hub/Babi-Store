import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ApexLogoProps {
  variant?: 'full' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
  id?: string;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({
  variant = 'full',
  size = 'md',
  showSubtitle = true,
  className = '',
  id,
}) => {
  const { isDark } = useTheme();

  // Dimension scaling for the emblem icon
  const iconDimensions = {
    xs: 'h-6 w-6', // ~24px
    sm: 'h-7 w-7 sm:h-8 sm:w-8', // ~28px - 32px
    md: 'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10', // ~32px - 40px
    lg: 'h-10 w-10 sm:h-11 sm:w-11', // ~40px - 44px
    hero: 'h-10 w-10 sm:h-12 sm:w-12', // ~40px - 48px
  }[size];

  // Text sizing
  const titleClasses = {
    xs: 'text-sm font-black',
    sm: 'text-base sm:text-lg font-black',
    md: 'text-lg sm:text-xl md:text-2xl font-black',
    lg: 'text-xl sm:text-2xl font-black',
    hero: 'text-xl sm:text-2xl md:text-3xl font-black',
  }[size];

  const subtitleClasses = {
    xs: 'text-[8px] font-bold tracking-[0.2em]',
    sm: 'text-[9px] sm:text-[10px] font-bold tracking-[0.25em]',
    md: 'text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.25em]',
    lg: 'text-[10px] sm:text-[11px] font-bold tracking-[0.25em]',
    hero: 'text-[10px] sm:text-[11px] font-bold tracking-[0.3em]',
  }[size];

  const Emblem = (
    <div className={`relative flex items-center justify-center shrink-0 rounded-full overflow-hidden border border-white/10 shadow-sm ${iconDimensions}`}>
      <img
        src="/apexcreativelogo.jpg"
        alt="Apex Creatives Logo"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div id={id} className={`inline-flex items-center ${className}`}>
        {Emblem}
      </div>
    );
  }

  return (
    <div id={id} className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {Emblem}

      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span
            className={`font-display tracking-tight transition-colors duration-200 ${titleClasses} ${
              isDark ? 'text-white group-hover:text-white/95' : 'text-[#111111] group-hover:text-black'
            }`}
          >
            APEX CREATIVES
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-mono-tech uppercase transition-colors duration-200 mt-0.5 sm:mt-1 ${subtitleClasses} ${
              isDark ? 'text-[#A8A8A8] group-hover:text-[#FF2B2B]' : 'text-[#666666] group-hover:text-[#E50914]'
            }`}
          >
            BY BABI
          </span>
        )}
      </div>
    </div>
  );
};
