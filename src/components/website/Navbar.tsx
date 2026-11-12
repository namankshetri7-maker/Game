/**
 * Wonder World Kids Learning Website Header / Navigation Bar
 * Clean, responsive, translucent glass design for parents and kids.
 */
import React, { useState } from 'react';
import { BrandLogo } from '../BrandLogo';
import { soundEngine } from '../../services/soundEngine';
import { Play, ShoppingBag, Menu, X, Sparkles, Youtube, Instagram, Facebook, KeyRound } from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/socialLinks';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onEnterGame }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', route: 'home' },
    { label: 'Explore Worlds', route: 'worlds' },
    { label: 'Demo Simulator', route: 'demo' },
    { label: 'Unlock Full Game', route: 'pricing' },
    { label: 'Install PWA', route: 'downloads' },
    { label: 'Parents & Safety', route: 'parents' }
  ];

  return (
    <header className="sticky top-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 z-[100] px-3 sm:px-6 py-2.5 sm:py-3 font-body shadow-xl transition-all relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 relative">
        
        {/* Brand Logo */}
        <button
          onClick={() => {
            soundEngine.playPop();
            setIsMobileMenuOpen(false);
            onNavigate('home');
          }}
          className="flex items-center cursor-pointer group text-left shrink min-w-0 active:scale-95 transition"
          title="Wonder World Kids Learning Home"
        >
          <BrandLogo size="header" showText={true} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-300 font-fun">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  soundEngine.playPop();
                  onNavigate(item.route);
                }}
                className={`px-3.5 py-2.5 rounded-2xl transition cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40'
                    : 'hover:text-white hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons & Hamburger Menu Container */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative z-10">
          
          {/* Desktop Social Quick Links */}
          <div className="hidden xl:flex items-center gap-1.5 pr-2 border-r border-slate-800">
            {SOCIAL_LINKS.map((s) => {
              const Icon = s.id === 'youtube' ? Youtube : s.id === 'instagram' ? Instagram : Facebook;
              const hoverStyle = 
                s.id === 'youtube' 
                  ? 'hover:text-red-500 hover:bg-red-500/10' 
                  : s.id === 'instagram' 
                  ? 'hover:text-pink-400 hover:bg-pink-500/10' 
                  : 'hover:text-blue-400 hover:bg-blue-500/10';
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playPop()}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800 transition active:scale-95 ${hoverStyle}`}
                  title={`${s.label}: ${s.handle}`}
                  aria-label={s.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsMobileMenuOpen(false);
              onNavigate('demo');
            }}
            className="px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-fun font-black text-xs shadow-lg border sm:border-2 border-emerald-400/40 transition active:scale-95 cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            <span className="hidden sm:inline">Try Free Demo</span>
            <span className="sm:hidden text-[11px]">Demo</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsMobileMenuOpen(false);
              onNavigate('pricing');
            }}
            className="px-2.5 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-lg transition active:scale-95 cursor-pointer border sm:border-2 border-white flex items-center gap-1 sm:gap-1.5 shrink-0"
          >
            <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Unlock Game</span>
            <span className="sm:hidden text-[11px]">Unlock</span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer shrink-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-amber-400" />
            ) : (
              <Menu className="w-5 h-5 text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Menu with High Z-Index, clear background and overflow protection */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 shadow-2xl px-4 py-3 z-[110] flex flex-col gap-1.5 font-fun animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  soundEngine.playPop();
                  setIsMobileMenuOpen(false);
                  onNavigate(item.route);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-300 hover:bg-slate-900 active:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}

          {/* Mobile Social Links Bar in Menu */}
          <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-fun">
              Follow Us:
            </span>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => {
                const Icon = s.id === 'youtube' ? Youtube : s.id === 'instagram' ? Instagram : Facebook;
                const activeColor = 
                  s.id === 'youtube' ? 'text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white' : s.id === 'instagram' ? 'text-pink-400 bg-pink-500/10 hover:bg-pink-500 hover:text-white' : 'text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white';
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playPop()}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs font-bold active:scale-95 transition ${activeColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{s.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
