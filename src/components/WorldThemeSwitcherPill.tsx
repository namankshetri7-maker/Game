import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, Sparkles, ChevronDown } from 'lucide-react';
import { useWorldTheme, WORLD_THEMES, WorldThemeId } from '../services/WorldThemeContext';
import { soundEngine } from '../services/soundEngine';

interface WorldThemeSwitcherPillProps {
  compact?: boolean;
}

export const WorldThemeSwitcherPill: React.FC<WorldThemeSwitcherPillProps> = ({ compact = false }) => {
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
        className={
          compact
            ? "h-9 px-2 sm:px-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-800 text-xs font-fun font-bold border border-slate-200/80 transition cursor-pointer flex items-center gap-1 shadow-2xs"
            : "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-slate-800 text-xs font-fun font-bold shadow-md border-2 border-slate-200 transition cursor-pointer"
        }
        title={`World Theme: ${activeTheme.name}`}
      >
        <span className="text-sm sm:text-base">{activeTheme.icon}</span>
        {!compact && <span className="hidden sm:inline font-black text-slate-900">{activeTheme.name}</span>}
        <span
          className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs shrink-0"
          style={{ backgroundColor: activeTheme.themeColor }}
        />
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
