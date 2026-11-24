/**
 * Wonder World Kids Learning Website Header / Navigation Bar
 * Cross-device aligned (Mac, iPhone with notch safe-area, Android narrow viewports).
 * Clean 3-zone top bar: Circular Home emblem | Centered Nav Links | Uniform Action Cluster.
 */
import React, { useState } from 'react';
import { BrandLogo } from '../BrandLogo';
import { soundEngine } from '../../services/soundEngine';
import { Play, Menu, X, KeyRound, ShoppingBag, ChevronRight } from 'lucide-react';
import { getRoutePath } from '../../services/seoManager';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
  bagCount?: number;
  onOpenBag?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  bagCount = 0,
  onOpenBag,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', route: 'home' },
    { label: '5 Worlds', route: 'worlds' },
    { label: 'Store', route: 'store' },
    { label: 'Blog', route: 'blog' },
    { label: 'Download', route: 'downloads' },
    { label: 'Parents', route: 'parents' },
  ];

  const handleLinkClick = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      setIsMobileMenuOpen(false);
      onNavigate(route);
    }
  };

  return (
    <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b-2 border-sky-200 font-body shadow-xs pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto h-16 pl-[max(0.875rem,env(safe-area-inset-left))] pr-[max(0.875rem,env(safe-area-inset-right))] sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Zone 1: Circular Explorer Home Emblem (text removed cleanly from header) */}
        <a
          href={getRoutePath('home')}
          onClick={(e) => handleLinkClick(e, 'home')}
          className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] shrink-0 active:scale-95 transition cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          aria-label="Home"
          title="Back to Home"
        >
          <BrandLogo size="header" showText={false} themeSurface="light" />
        </a>

        {/* Zone 2: Centered Navigation Links (visible on Mac, iPad landscape & Desktop) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center justify-center gap-5 lg:gap-7 text-sm font-bold font-fun flex-1"
        >
          {navItems.map((item) => {
            const isActive =
              currentRoute === item.route ||
              (item.route === 'store' && currentRoute === 'store_product') ||
              (item.route === 'worlds' && currentRoute === 'world_detail');
            return (
              <a
                key={item.route}
                href={getRoutePath(item.route)}
                onClick={(e) => handleLinkClick(e, item.route)}
                className={`py-1.5 transition cursor-pointer whitespace-nowrap shrink-0 border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 ${
                  isActive
                    ? 'text-sky-700 border-amber-400'
                    : 'text-[#0F294A] border-transparent hover:text-sky-700 hover:border-sky-300'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Cross-Device Action Cluster */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
          {onOpenBag && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onOpenBag();
              }}
              className="h-10 min-w-[40px] px-2.5 sm:px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0F294A] font-fun font-bold text-xs border border-sky-200 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-sky-600"
              aria-label={`Open Saved Bag (${bagCount} items)`}
              title="Saved Collection Bag"
            >
              <ShoppingBag className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="tabular-nums text-xs">{bagCount}</span>
            </button>
          )}

          {/* Primary Play Action: Meadow-Green Try Free Demo */}
          <a
            href={getRoutePath('demo')}
            onClick={(e) => handleLinkClick(e, 'demo')}
            className="h-10 px-3 sm:px-4 rounded-xl bg-gradient-to-b from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-fun font-black text-xs shadow-[0_2px_0_#15803d] active:translate-y-0.5 active:shadow-none transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap border border-emerald-400/50 focus-visible:outline-2 focus-visible:outline-emerald-700"
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="hidden sm:inline">Try Free Demo</span>
            <span className="sm:hidden">Demo</span>
          </a>

          {/* Primary Family Unlock CTA */}
          <a
            href={getRoutePath('pricing')}
            onClick={(e) => handleLinkClick(e, 'pricing')}
            className="h-10 px-3 sm:px-4 rounded-xl bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-amber-950 font-fun font-black text-xs shadow-[0_2px_0_#d97706] active:translate-y-0.5 active:shadow-none transition cursor-pointer border border-amber-300 flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-amber-700"
          >
            <KeyRound className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Unlock Game</span>
            <span className="sm:hidden">Unlock</span>
          </a>

          {/* Mobile Menu Toggle (iPhone & Android) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="md:hidden w-10 h-10 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0F294A] border border-sky-200 transition active:scale-95 cursor-pointer shrink-0 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-sky-600"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-sky-700" />
            ) : (
              <Menu className="w-5 h-5 text-[#0F294A]" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (iPhone & Android) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-sky-200 shadow-lg px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] z-[110] flex flex-col gap-1.5 font-fun">
          {navItems.map((item) => {
            const isActive =
              currentRoute === item.route ||
              (item.route === 'store' && currentRoute === 'store_product') ||
              (item.route === 'worlds' && currentRoute === 'world_detail');
            return (
              <a
                key={item.route}
                href={getRoutePath(item.route)}
                onClick={(e) => handleLinkClick(e, item.route)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-800 border border-sky-200'
                    : 'text-[#0F294A] hover:bg-sky-50/70'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-sky-600" />
              </a>
            );
          })}
          <a
            href={getRoutePath('demo')}
            onClick={(e) => handleLinkClick(e, 'demo')}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between cursor-pointer mt-1"
          >
            <span>Try Free Interactive Demo</span>
            <Play className="w-4 h-4 fill-current text-emerald-600" />
          </a>
        </div>
      )}
    </header>
  );
};
