import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, Sparkles, ChevronDown } from 'lucide-react';
import { useWorldTheme, WORLD_THEMES, WorldThemeId } from '../services/WorldThemeContext';
import { soundEngine } from '../services/soundEngine';

export const WorldThemeSwitcherPill: React.FC = () => {
  const { activeThemeId, activeTheme, setTheme } = useWorldTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTheme = (id: WorldThemeId) => {
    soundEngine.playPop();
    setTheme(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left select-none">
      {/* Active Theme Selector Pill Button */}
      <button
        onClick={() => {
          soundEngine.playPop();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-slate-800 text-xs font-fun font-bold shadow-md border-2 border-slate-200 transition cursor-pointer"
        title="Switch World Theme Palette"
      >
        <span className="text-base">{activeTheme.icon}</span>
        <span className="hidden sm:inline font-black text-slate-900">{activeTheme.name}</span>
        <span
          className="w-3 h-3 rounded-full border border-white shadow-sm"
          style={{ backgroundColor: activeTheme.themeColor }}
        />
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Theme Dropdown Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 6 }}
            className="absolute top-full right-0 mt-2 w-56 sm:w-64 p-2 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-indigo-200 shadow-2xl z-50 flex flex-col gap-1.5"
          >
            <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100">
              <span className="text-[11px] font-black uppercase text-indigo-900 font-fun flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                Thematic World Styles
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            {WORLD_THEMES.map(theme => {
              const isSelected = activeThemeId === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-indigo-50 border-2 border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">{theme.icon}</span>
                    <div>
                      <span className="text-xs font-black text-slate-900 font-fun block leading-tight">
                        {theme.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {theme.subject}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: theme.themeColor }}
                    />
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
