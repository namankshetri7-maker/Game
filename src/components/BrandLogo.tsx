import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true
}) => {
  const sizeMap = {
    sm: { icon: 'w-10 h-10', text: 'text-base sm:text-lg', subText: 'text-[9px]' },
    md: { icon: 'w-12 h-12 sm:w-14 sm:h-14', text: 'text-lg sm:text-xl', subText: 'text-[10px]' },
    lg: { icon: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-2xl', subText: 'text-xs' },
    hero: { icon: 'w-32 h-32 sm:w-44 sm:h-44', text: 'text-3xl', subText: 'text-sm' }
  };

  const imageSrc = '/assets/aistudio/Wonder_World_Kids_Adventure_Badge_ba215e1b.png';
  const sizeConfig = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Game Logo Image Asset - In Circular Badge Frame */}
      <div className={`relative ${sizeConfig.icon || 'w-12 h-12'} aspect-square shrink-0 rounded-full overflow-hidden shadow-lg transition-transform hover:scale-105 active:scale-95 group flex items-center justify-center ring-2 ring-amber-400 bg-amber-100`}>
        <img
          src={imageSrc}
          alt="Wonder World Kids Learning Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Brand Title Text (Optional) */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`${sizeConfig.text} font-black font-fun tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]`}>
              WonderWorld
            </span>
            <span className="text-xs text-amber-500 font-bold">KIDS</span>
          </div>
          <span className={`${sizeConfig.subText} font-black text-amber-800 tracking-wider font-body uppercase flex items-center gap-1 mt-0.5`}>
            <span>Kids Learning</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </span>
        </div>
      )}
    </div>
  );
};
