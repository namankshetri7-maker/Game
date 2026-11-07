/**
 * Wonder World Kids Learning Website Footer
 * Simple, trustworthy footer highlighting offline gameplay and one-time payment.
 */

import React from 'react';
import { BrandLogo } from '../BrandLogo';
import { soundEngine } from '../../services/soundEngine';
import { Heart, Globe, HelpCircle, Lock, Shield, Youtube, Instagram, Facebook } from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/socialLinks';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerSections = [
    {
      title: 'About',
      icon: HelpCircle,
      links: [
        { label: 'Wonder World Story', route: 'about' },
        { label: 'Activate License Key', route: 'my_games' },
        { label: 'FAQ', route: 'faq' },
        { label: 'Support Email', route: 'contact' },
        { label: 'Download App', route: 'downloads' }
      ]
    },
    {
      title: 'Privacy',
      icon: Lock,
      links: [
        { label: 'Privacy Policy', route: 'privacy' },
        { label: 'No Data Collected', route: 'privacy' },
        { label: 'Ad-Free Experience', route: 'home' }
      ]
    },
    {
      title: 'Compliance',
      icon: Globe,
      links: [
        { label: 'Offline-Only App', route: 'home' },
        { label: 'One-Time Payment', route: 'pricing' }
      ]
    },
    {
      title: 'Legal',
      icon: Shield,
      links: [
        { label: 'Terms of Use', route: 'privacy' },
        { label: 'Regional Info', route: 'home' }
      ]
    }
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 px-4 sm:px-6 border-t-4 border-amber-500 font-body select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
        
        {/* Brand Column */}
        <div className="col-span-2 space-y-4">
          <BrandLogo size="md" showText={true} />
          <p className="text-xs text-slate-400 leading-relaxed font-body max-w-sm">
            Wonder World Kids Learning is a 100% offline educational game suite. No ads, no data storage, simple one-time payment of $9.
          </p>

          {/* Social Media Channels */}
          <div className="pt-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block mb-2 font-fun">
              Follow Our Channels
            </span>
            <div className="flex items-center gap-2.5 flex-wrap">
              {SOCIAL_LINKS.map((s) => {
                const Icon = s.id === 'youtube' ? Youtube : s.id === 'instagram' ? Instagram : Facebook;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playPop()}
                    className={`h-10 px-3 rounded-xl border flex items-center gap-2 text-xs font-fun font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
                      s.id === 'youtube'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500'
                        : s.id === 'instagram'
                        ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-gradient-to-r hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-pink-400'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-500'
                    }`}
                    title={`${s.label}: ${s.handle}`}
                    aria-label={`Visit our ${s.label} page`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{s.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Nav Sections */}
        {footerSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 font-fun">
              <section.icon className="w-4 h-4 text-amber-400" />
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => { soundEngine.playPop(); onNavigate(link.route); }}
                    className="text-xs text-slate-300 hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <div>
          © 2026 Wonder World Kids Learning. All rights reserved.
        </div>
        <div className="flex items-center gap-1.5 font-fun text-slate-400">
          <span>Ad-Free, Offline, Trusted Learning</span>
          <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        </div>
      </div>
    </footer>
  );
};
