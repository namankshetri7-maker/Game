/**
 * Wonder World Kids Learning Website Footer
 * Simple, trustworthy footer highlighting offline gameplay and one-time payment.
 */

import React from 'react';
import { BrandLogo } from '../BrandLogo';
import { soundEngine } from '../../services/soundEngine';
import { Heart, Globe, HelpCircle, Lock, Shield } from 'lucide-react';

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
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 px-6 border-t-4 border-amber-500 font-body select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Column */}
        <div className="col-span-2 lg:col-span-1 space-y-4">
          <BrandLogo size="md" showText={true} />
          <p className="text-xs text-slate-400 leading-relaxed font-body">
            Wonder World Kids Learning is a 100% offline educational game suite. No ads, no data storage, simple one-time payment of $9.
          </p>
        </div>

        {/* Dynamic Sections */}
        {footerSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <section.icon className="w-4 h-4 text-amber-400" />
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => { soundEngine.playPop(); onNavigate(link.route); }}
                    className="text-xs text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
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
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
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
