import React from 'react';
import { useWorldTheme, WorldThemeId } from '../services/WorldThemeContext';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'header';
  showText?: boolean;
  themeSurface?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  themeSurface = 'light',
}) => {
  let activeThemeId: WorldThemeId = 'world_math';
  try {
    const themeContext = useWorldTheme();
    activeThemeId = themeContext.activeThemeId;
  } catch {
    activeThemeId = 'world_math';
  }

  // Retain activeThemeId reference so theme transitions remain reactive if needed
  void activeThemeId;

  const isDarkSurface = themeSurface === 'dark';

  const sizeMap = {
    sm: {
      icon: 'w-9 h-9',
      text: 'text-base sm:text-lg',
      subText: 'text-[11px]',
    },
    header: {
      icon: 'w-10 h-10 sm:w-11 sm:h-11',
      text: 'text-base sm:text-xl',
      subText: 'text-[11px]',
    },
    md: {
      icon: 'w-12 h-12 sm:w-14 sm:h-14',
      text: 'text-lg sm:text-xl',
      subText: 'text-xs',
    },
    lg: {
      icon: 'w-16 h-16 sm:w-20 sm:h-20',
      text: 'text-2xl sm:text-3xl',
      subText: 'text-xs',
    },
    hero: {
      icon: 'w-32 h-32 sm:w-44 sm:h-44',
      text: 'text-3xl sm:text-4xl',
      subText: 'text-sm',
    },
  };

  const imageSrc = '/assets/aistudio/pwa-512x512_ba215e1b.png';
  const sizeConfig = sizeMap[size] || sizeMap.md;

  // High-contrast, solid storybook colors sampled from the Wonder World Kids logo
  const wonderColor = isDarkSurface ? 'text-amber-300' : 'text-amber-600';
  const worldColor = isDarkSurface ? 'text-rose-300' : 'text-rose-600';
  const kidsBadgeClass = isDarkSurface
    ? 'bg-sky-400 text-[#0F294A] border-sky-200'
    : 'bg-sky-600 text-white border-sky-700';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official Wonder World Kids Circular Explorer Badge */}
      <div
        className={`relative ${sizeConfig.icon} aspect-square shrink-0 rounded-full overflow-hidden shadow-sm transition-transform duration-200 hover:scale-105 flex items-center justify-center ring-2 ring-amber-400 bg-sky-100 ${
          isDarkSurface ? 'ring-offset-2 ring-offset-[#0F294A]' : 'ring-offset-2 ring-offset-white'
        }`}
      >
        <img
          src={imageSrc}
          alt="Wonder World Kids Learning Logo"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            e.currentTarget.src = '/logo.png';
          }}
        />
      </div>

      {/* Crisp Single-Line Storybook Wordmark Matching Logo Palette */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5 flex-nowrap">
            <span className={`${sizeConfig.text} font-black font-fun tracking-tight leading-none whitespace-nowrap ${wonderColor}`}>
              Wonder
            </span>
            <span className={`${sizeConfig.text} font-black font-fun tracking-tight leading-none whitespace-nowrap ${worldColor}`}>
              World
            </span>
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md font-fun font-black text-[11px] leading-none tracking-wide uppercase border whitespace-nowrap ${kidsBadgeClass}`}
            >
              Kids
            </span>
          </div>

          {size !== 'header' && (
            <span
              className={`${sizeConfig.subText} hidden sm:block font-semibold tracking-wide font-body mt-1.5 ${
                isDarkSurface ? 'text-sky-200/90' : 'text-slate-600'
              }`}
            >
              Early Learning Games · Printable Books
            </span>
          )}
        </div>
      )}
    </div>
  );
};
