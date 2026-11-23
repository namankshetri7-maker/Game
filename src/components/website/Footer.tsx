/**
 * Wonder World Kids Learning Website Footer
 * Compact, evenly aligned 12-column grid layout for desktop, tablet, and mobile.
 */

import React from 'react';
import { BrandLogo } from '../BrandLogo';
import { soundEngine } from '../../services/soundEngine';
import { Heart, Globe, HelpCircle, Lock, Youtube, Instagram, Facebook } from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/socialLinks';
import { getRoutePath } from '../../services/seoManager';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerColumns = [
    {
      title: 'Explore',
      icon: Globe,
      links: [
        { label: 'Store & Printables', route: 'store' },
        { label: '5 Learning Worlds', route: 'worlds' },
        { label: 'Try Free Demo', route: 'demo' },
        { label: 'Download App', route: 'downloads' },
      ],
    },
    {
      title: 'Families',
      icon: Lock,
      links: [
        { label: 'Parents & Safety', route: 'parents' },
        { label: 'Activate Key', route: 'my_games' },
        { label: 'Lifetime Access ($9)', route: 'pricing' },
        { label: 'Our Story', route: 'about' },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      links: [
        { label: 'FAQ', route: 'faq' },
        { label: 'Privacy Policy', route: 'privacy' },
        { label: 'Terms of Use', route: 'privacy' },
        { label: 'Contact Support', route: 'contact' },
      ],
    },
  ];

  const handleLinkClick = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route);
    }
  };

  return (
    <footer className="bg-[#0F294A] text-sky-100 pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 border-t-4 border-amber-400 font-body select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Brand, Support & Channels Block (5/12) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" showText={false} themeSurface="dark" />
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-base sm:text-lg font-black font-fun tracking-tight text-white">
                  <span className="text-amber-300">Wonder</span>{' '}
                  <span className="text-rose-300">World</span>{' '}
                  <span className="text-sky-300">Kids Learning</span>
                </span>
                <span className="text-[11px] font-semibold tracking-wide font-body text-sky-200/90 mt-0.5">
                  Early Learning Games · Printable Books
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-sky-100/85 leading-relaxed max-w-md">
              100% offline early learning games and printable colouring books for kids aged 3–8.
            </p>
            <div className="text-xs text-sky-100">
              <span className="text-sky-200/80">Support: </span>
              <a
                href="mailto:wonderworldkidslearning@gmail.com"
                className="text-amber-300 hover:underline font-bold break-all"
              >
                wonderworldkidslearning@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              {SOCIAL_LINKS.map((s) => {
                const Icon =
                  s.id === 'youtube' ? Youtube : s.id === 'instagram' ? Instagram : Facebook;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playPop()}
                    className={`h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-fun font-bold transition-colors active:scale-95 cursor-pointer whitespace-nowrap ${
                      s.id === 'youtube'
                        ? 'bg-red-500/15 border-red-400/30 text-red-200 hover:bg-red-600 hover:text-white'
                        : s.id === 'instagram'
                        ? 'bg-pink-500/15 border-pink-400/30 text-pink-200 hover:bg-pink-600 hover:text-white'
                        : 'bg-sky-500/15 border-sky-400/30 text-sky-200 hover:bg-sky-600 hover:text-white'
                    }`}
                    title={`${s.label}: ${s.handle}`}
                    aria-label={`Visit our ${s.label} page`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{s.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Symmetrical 3-Column Navigation Grid (7/12) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-2.5">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-fun">
                  <column.icon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{column.title}</span>
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={getRoutePath(link.route)}
                        onClick={(e) => handleLinkClick(e, link.route)}
                        className="text-xs text-sky-100/85 hover:text-amber-300 transition-colors cursor-pointer inline-block py-0.5 whitespace-nowrap"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Bottom Legal & Brand Line */}
        <div className="mt-7 pt-5 border-t border-sky-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sky-200/75 font-medium text-center sm:text-left">
          <span>© 2026 Wonder World Kids Learning. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5 font-fun text-sky-100/90">
            <span>Games, Colouring Books &amp; Offline Learning</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
          </span>
        </div>
      </div>
    </footer>
  );
};
