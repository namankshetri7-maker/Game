import React, { createContext, useContext, useState, useEffect } from 'react';

export type WorldThemeId = 'world_math' | 'world_phonics' | 'world_geography' | 'world_science' | 'world_logic';

export interface WorldThemeMeta {
  id: WorldThemeId;
  name: string;
  subject: string;
  icon: string;
  themeColor: string;
  accentBg: string;
  badgeBorder: string;
  desc: string;
}

export const WORLD_THEMES: WorldThemeMeta[] = [
  {
    id: 'world_math',
    name: 'Math Magic',
    subject: 'Numbers & Logic',
    icon: '🔢',
    themeColor: '#3B82F6',
    accentBg: 'bg-blue-600',
    badgeBorder: 'border-blue-300',
    desc: 'Electric Blue Theme • Numbers & Equations'
  },
  {
    id: 'world_phonics',
    name: 'Phonics Jungle',
    subject: 'Letters & Rhymes',
    icon: '🦁',
    themeColor: '#10B981',
    accentBg: 'bg-emerald-600',
    badgeBorder: 'border-emerald-300',
    desc: 'Emerald Nature Theme • Phonics Canopy'
  },
  {
    id: 'world_geography',
    name: 'World Cultures',
    subject: 'Continents & Maps',
    icon: '🌍',
    themeColor: '#F59E0B',
    accentBg: 'bg-amber-500',
    badgeBorder: 'border-amber-300',
    desc: 'Solar Amber Theme • Global Expeditions'
  },
  {
    id: 'world_science',
    name: 'Animal Kingdom',
    subject: 'Creatures & Nature',
    icon: '🐾',
    themeColor: '#F43F5E',
    accentBg: 'bg-rose-600',
    badgeBorder: 'border-rose-300',
    desc: 'Rose Flora Theme • Animal Kingdom'
  },
  {
    id: 'world_logic',
    name: 'Logic & Brain',
    subject: 'Puzzles & Mazes',
    icon: '🧩',
    themeColor: '#8B5CF6',
    accentBg: 'bg-purple-600',
    badgeBorder: 'border-purple-300',
    desc: 'Mystic Purple Theme • Spatial Reasoning'
  }
];

interface WorldThemeContextType {
  activeThemeId: WorldThemeId;
  activeTheme: WorldThemeMeta;
  setTheme: (themeId: WorldThemeId) => void;
}

const WorldThemeContext = createContext<WorldThemeContextType | undefined>(undefined);

export const WorldThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState<WorldThemeId>('world_math');

  const activeTheme = WORLD_THEMES.find(t => t.id === activeThemeId) || WORLD_THEMES[0];

  const setTheme = (themeId: WorldThemeId) => {
    setActiveThemeId(themeId);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeThemeId);
    }
  }, [activeThemeId]);

  return (
    <WorldThemeContext.Provider value={{ activeThemeId, activeTheme, setTheme }}>
      <div data-theme={activeThemeId} className="w-full h-full min-h-screen">
        {children}
      </div>
    </WorldThemeContext.Provider>
  );
};

export const useWorldTheme = () => {
  const context = useContext(WorldThemeContext);
  if (!context) {
    throw new Error('useWorldTheme must be used within a WorldThemeProvider');
  }
  return context;
};
