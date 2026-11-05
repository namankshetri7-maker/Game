/**
 * Wonder World Kids Learning Website Header / Navigation Bar
 * Clean, responsive, translucent glass design for parents and kids.
 */

import React, { useState } from 'react';
import { BrandLogo } from '../BrandLogo';
import { soundEngine } from '../../services/soundEngine';
import { Play, ShoppingBag, Menu, X, Shield, Sparkles } from 'lucide-react';

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
    { label: 'Pricing ($9)', route: 'pricing' },
    { label: 'Install PWA', route: 'downloads' },
    { label: 'Parents & Safety', route: 'parents' }
  ];

  return (
    <header className="sticky top-0 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 z-50 px-4 sm:px-8 py-3 font-body shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button
          onClick={() => {
            soundEngine.playPop();
            setIsMobileMenuOpen(false);
            onNavigate('home');
          }}
          className="flex items-center cursor-pointer group text-left shrink-0 active:scale-95 transition"
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
                className={`px-4 py-2.5 rounded-2xl transition cursor-pointer active:scale-95 ${
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsMobileMenuOpen(false);
              onNavigate('demo');
            }}
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-fun font-black text-xs shadow-lg border-2 border-emerald-400/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Try Free Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsMobileMenuOpen(false);
              onNavigate('pricing');
            }}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-lg transition active:scale-95 cursor-pointer border-2 border-white flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Unlock ($9)</span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden pt-3 pb-2 mt-3 border-t border-slate-800 flex flex-col gap-1.5 font-fun animate-fadeIn">
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
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
