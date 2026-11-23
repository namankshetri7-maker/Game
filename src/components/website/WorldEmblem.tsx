/**
 * Crisp, platform-consistent vector emblems for Wonder World Kids Learning Worlds
 * and Printable Studio. Renders identically across Mac, iPhone, and Android without
 * cropped screenshots or inconsistent OS emoji rendering.
 */

import React from 'react';
import {
  Calculator,
  BookOpen,
  Compass,
  Sprout,
  Puzzle,
  Palette,
} from 'lucide-react';

export type WorldEmblemId =
  | 'world_math'
  | 'world_phonics'
  | 'world_geography'
  | 'world_science'
  | 'world_logic'
  | 'printables';

interface WorldEmblemProps {
  worldId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EMBLEM_CONFIG: Record<
  WorldEmblemId,
  {
    Icon: React.ComponentType<{ className?: string }>;
    bgClass: string;
    ringClass: string;
    badgeLabel: string;
  }
> = {
  world_math: {
    Icon: Calculator,
    bgClass: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white',
    ringClass: 'ring-2 ring-sky-200',
    badgeLabel: '123',
  },
  world_phonics: {
    Icon: BookOpen,
    bgClass: 'bg-gradient-to-br from-emerald-400 to-green-600 text-white',
    ringClass: 'ring-2 ring-emerald-200',
    badgeLabel: 'ABC',
  },
  world_geography: {
    Icon: Compass,
    bgClass: 'bg-gradient-to-br from-amber-300 to-orange-500 text-amber-950',
    ringClass: 'ring-2 ring-amber-200',
    badgeLabel: 'MAP',
  },
  world_science: {
    Icon: Sprout,
    bgClass: 'bg-gradient-to-br from-rose-400 to-pink-600 text-white',
    ringClass: 'ring-2 ring-rose-200',
    badgeLabel: 'LAB',
  },
  world_logic: {
    Icon: Puzzle,
    bgClass: 'bg-gradient-to-br from-violet-400 to-purple-600 text-white',
    ringClass: 'ring-2 ring-violet-200',
    badgeLabel: 'IQ',
  },
  printables: {
    Icon: Palette,
    bgClass: 'bg-gradient-to-br from-teal-400 to-cyan-600 text-white',
    ringClass: 'ring-2 ring-teal-200',
    badgeLabel: 'PDF',
  },
};

export const WorldEmblem: React.FC<WorldEmblemProps> = ({
  worldId,
  size = 'md',
  className = '',
}) => {
  const config = EMBLEM_CONFIG[worldId as WorldEmblemId] || EMBLEM_CONFIG.world_math;
  const { Icon, bgClass, ringClass } = config;

  const sizeClasses =
    size === 'sm'
      ? 'w-11 h-11 rounded-xl'
      : size === 'lg'
      ? 'w-16 h-16 rounded-2xl'
      : 'w-14 h-14 rounded-2xl';

  const iconClasses =
    size === 'sm'
      ? 'w-5 h-5'
      : size === 'lg'
      ? 'w-8 h-8'
      : 'w-7 h-7';

  return (
    <div
      aria-hidden="true"
      className={`${sizeClasses} ${bgClass} ${ringClass} shadow-sm flex items-center justify-center shrink-0 ${className}`}
    >
      <Icon className={iconClasses} />
    </div>
  );
};
