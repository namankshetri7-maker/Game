import React from 'react';
import { useWorldTheme, WORLD_THEMES, WorldThemeId } from '../services/WorldThemeContext';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'header';
  showText?: boolean;
}

// Theme-specific color palettes and icons matching the active World Theme
const THEME_LETTER_PALETTES: Record<
  WorldThemeId,
  {
    wonderGradient: string;
    worldGradient: string;
    kidsBg: string;
    kidsText: string;
    kidsBorder: string;
    kidsRing: string;
    starIcon: string;
    badgeRing: string;
    badgeGlow: string;
    subtitleText: string;
    subtitleColor: string;
    subtitleDot: string;
  }
> = {
  world_math: {
    wonderGradient: 'from-blue-600 via-sky-500 to-indigo-600',
    worldGradient: 'from-indigo-600 via-blue-500 to-cyan-500',
    kidsBg: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500',
    kidsText: 'text-amber-950',
    kidsBorder: 'border-amber-300',
    kidsRing: 'ring-yellow-300/60',
    starIcon: '⭐',
    badgeRing: 'ring-blue-400',
    badgeGlow: 'from-blue-100 via-sky-100 to-indigo-100',
    subtitleText: 'Math Magic • Offline Suite',
    subtitleColor: 'text-blue-800/80',
    subtitleDot: 'bg-blue-500'
  },
  world_phonics: {
    wonderGradient: 'from-emerald-600 via-teal-500 to-green-600',
    worldGradient: 'from-green-600 via-emerald-500 to-lime-600',
    kidsBg: 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500',
    kidsText: 'text-orange-950',
    kidsBorder: 'border-amber-300',
    kidsRing: 'ring-amber-300/60',
    starIcon: '🍃',
    badgeRing: 'ring-emerald-400',
    badgeGlow: 'from-emerald-100 via-lime-100 to-teal-100',
    subtitleText: 'Phonics Jungle • Offline Suite',
    subtitleColor: 'text-emerald-800/80',
    subtitleDot: 'bg-emerald-500'
  },
  world_geography: {
    wonderGradient: 'from-amber-600 via-orange-500 to-yellow-500',
    worldGradient: 'from-orange-600 via-amber-500 to-rose-600',
    kidsBg: 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500',
    kidsText: 'text-white',
    kidsBorder: 'border-sky-300',
    kidsRing: 'ring-sky-300/60',
    starIcon: '🌍',
    badgeRing: 'ring-amber-400',
    badgeGlow: 'from-amber-100 via-yellow-100 to-orange-100',
    subtitleText: 'World Expeditions • Offline Suite',
    subtitleColor: 'text-amber-900/80',
    subtitleDot: 'bg-amber-500'
  },
  world_science: {
    wonderGradient: 'from-rose-600 via-pink-500 to-rose-600',
    worldGradient: 'from-pink-600 via-rose-500 to-purple-500',
    kidsBg: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-400',
    kidsText: 'text-amber-950',
    kidsBorder: 'border-yellow-200',
    kidsRing: 'ring-yellow-300/60',
    starIcon: '🐾',
    badgeRing: 'ring-rose-400',
    badgeGlow: 'from-rose-100 via-pink-100 to-purple-100',
    subtitleText: 'Animal Kingdom • Offline Suite',
    subtitleColor: 'text-rose-900/80',
    subtitleDot: 'bg-rose-500'
  },
  world_logic: {
    wonderGradient: 'from-purple-600 via-violet-500 to-indigo-600',
    worldGradient: 'from-indigo-600 via-purple-500 to-fuchsia-600',
    kidsBg: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400',
    kidsText: 'text-teal-950',
    kidsBorder: 'border-teal-200',
    kidsRing: 'ring-teal-300/60',
    starIcon: '✨',
    badgeRing: 'ring-purple-400',
    badgeGlow: 'from-purple-100 via-violet-100 to-fuchsia-100',
    subtitleText: 'Brain & Logic Gym • Offline Suite',
    subtitleColor: 'text-purple-900/80',
    subtitleDot: 'bg-purple-500'
  }
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true
}) => {
  // Safely access current active theme
  let activeThemeId: WorldThemeId = 'world_math';
  try {
    const themeContext = useWorldTheme();
    activeThemeId = themeContext.activeThemeId;
  } catch {
    activeThemeId = 'world_math';
  }

  const palette = THEME_LETTER_PALETTES[activeThemeId] || THEME_LETTER_PALETTES.world_math;

  const sizeMap = {
    sm: {
      icon: 'w-10 h-10',
      text: 'text-base sm:text-lg',
      subText: 'text-[9px]',
      badgePadding: 'px-1.5 py-0.5 text-[9px]'
    },
    header: {
      icon: 'w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13',
      text: 'text-sm sm:text-xl md:text-2xl',
      subText: 'text-[9px] sm:text-[11px]',
      badgePadding: 'px-1.5 py-0.5 text-[9px] sm:text-[11px]'
    },
    md: {
      icon: 'w-12 h-12 sm:w-14 sm:h-14',
      text: 'text-lg sm:text-xl',
      subText: 'text-[10px]',
      badgePadding: 'px-1.5 py-0.5 text-[10px]'
    },
    lg: {
      icon: 'w-16 h-16 sm:w-20 sm:h-20',
      text: 'text-2xl sm:text-3xl',
      subText: 'text-xs',
      badgePadding: 'px-2.5 py-1 text-xs'
    },
    hero: {
      icon: 'w-32 h-32 sm:w-44 sm:h-44',
      text: 'text-3xl sm:text-4xl',
      subText: 'text-sm',
      badgePadding: 'px-3 py-1 text-sm'
    }
  };

  const imageSrc = '/assets/aistudio/Wonder_World_Kids_Adventure_Badge_ba215e1b.png';
  const sizeConfig = sizeMap[size] || sizeMap.md;

  // Helper to render letter-by-letter with playful wave bounce and styling
  const renderPlayfulLetters = (word: string, gradientClass: string, offsetShift: number = 0) => {
    return (
      <span className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClass} inline-flex items-baseline drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-all duration-500`}>
        {word.split('').map((char, i) => {
          // Playful baseline offsets (-1px, +1px, 0)
          const offsetClass =
            (i + offsetShift) % 3 === 0
              ? 'hover:-translate-y-1'
              : (i + offsetShift) % 3 === 1
              ? '-translate-y-[1px] hover:-translate-y-1.5'
              : 'translate-y-[1px] hover:-translate-y-1';

          return (
            <span
              key={i}
              className={`inline-block font-black font-fun tracking-tight ${offsetClass} transition-transform duration-200 select-none`}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Official Game Logo Image Asset - In Circular Badge Frame with Theme-Aware Ring */}
      <div
        className={`relative ${sizeConfig.icon} aspect-square shrink-0 rounded-full overflow-hidden shadow-md transition-all duration-500 hover:scale-105 active:scale-95 group flex items-center justify-center ring-3 ${palette.badgeRing} bg-gradient-to-tr ${palette.badgeGlow} ring-offset-2 ring-offset-white`}
      >
        <img
          src={imageSrc}
          alt="Wonder World Kids Learning Logo"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Graceful fallback to app icon
            e.currentTarget.src = '/logo.png';
          }}
        />
        {/* Subtle glass gloss highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/45 pointer-events-none rounded-full" />
      </div>

      {/* Brand Title Text: Joyfully Designed Letterforms Matched to Active Theme */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Word 1: Wonder */}
            <div className={`${sizeConfig.text} leading-none`}>
              {renderPlayfulLetters('Wonder', palette.wonderGradient, 0)}
            </div>

            {/* Word 2: World */}
            <div className={`${sizeConfig.text} leading-none`}>
              {renderPlayfulLetters('World', palette.worldGradient, 1)}
            </div>

            {/* Word 3: Kids Badge */}
            <span
              className={`hidden sm:inline-flex items-center gap-1 font-fun font-black ${sizeConfig.badgePadding} rounded-xl shadow-xs tracking-wider uppercase border ${palette.kidsBg} ${palette.kidsText} ${palette.kidsBorder} ring-2 ${palette.kidsRing} transform hover:rotate-3 active:scale-95 transition-all duration-300 drop-shadow-xs`}
            >
              <span>Kids Learning</span>
              <span className="text-[10px] sm:text-xs leading-none">{palette.starIcon}</span>
            </span>
          </div>

          {/* Subtitle: Theme-specific subject & offline indicator */}
          <span className={`${sizeConfig.subText} hidden sm:flex font-black ${palette.subtitleColor} tracking-wider font-fun uppercase items-center gap-1.5 mt-1 transition-colors duration-500`}>
            <span>Wonder World Kids Learning • 100% Offline</span>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${palette.subtitleDot} animate-pulse`} />
          </span>
        </div>
      )}
    </div>
  );
};
