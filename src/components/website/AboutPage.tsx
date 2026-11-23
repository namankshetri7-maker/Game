/**
 * Wonder World Kids Website - Dedicated About & Educational Mission Page (/about)
 */

import React from 'react';
import {
  ChevronRight,
  Compass,
  ShieldCheck,
  Globe,
  BookOpen,
  Play,
  ShoppingBag,
  Sparkles,
  Laptop,
} from 'lucide-react';
import { WORLDS } from '../../data/gameMatrix';
import { WorldEmblem } from './WorldEmblem';
import { getRoutePath } from '../../services/seoManager';
import { soundEngine } from '../../services/soundEngine';

interface AboutPageProps {
  onNavigate: (route: string, worldId?: string) => void;
  onEnterGame?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent, route: string, worldId?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, worldId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">About Wonder World Kids</span>
          </nav>
          <span className="font-semibold text-sky-700">Early Childhood Education · Ages 3–8</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-100 via-[#ECF8FF] to-[#F6FBFF] border-b border-sky-200 py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 font-fun mb-2">
            Our Story &amp; Educational Philosophy
          </p>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mb-4 tracking-tight text-balance">
            Built for Curious Children. Trusted by Families Worldwide.
          </h1>
          <p className="text-sm sm:text-lg text-slate-700 font-medium leading-relaxed max-w-3xl mx-auto mb-8">
            Wonder World Kids Learning brings together calm, joyful digital discovery games and screen-free printable colouring and workbook PDFs—crafted for preschool, kindergarten, homeschool, and early elementary learners aged 3 to 8 across the US, UK, India, Canada, Australia, Singapore, UAE, and Europe.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={getRoutePath('demo')}
              onClick={(e) => handleLink(e, 'demo')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-black text-sm shadow-xs inline-flex items-center gap-2 transition whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Try Free Interactive Demo</span>
            </a>
            <a
              href={getRoutePath('store')}
              onClick={(e) => handleLink(e, 'store')}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-xs inline-flex items-center gap-2 transition whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Learning Marketplace</span>
            </a>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 shadow-xs">
            <ShieldCheck className="w-7 h-7 text-emerald-600 mb-3" />
            <h2 className="text-lg font-black font-fun text-[#0F294A] mb-2">100% Ad-Free &amp; Private</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Zero banner ads, zero behavioural tracking pixels, and local-only child progress profiles designed for COPPA &amp; GDPR-K family peace of mind.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-xs">
            <Laptop className="w-7 h-7 text-sky-600 mb-3" />
            <h2 className="text-lg font-black font-fun text-[#0F294A] mb-2">Plays Offline Everywhere</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Installable as an offline Progressive Web App (PWA) on iPhone, iPad, Android tablets, Mac, and Windows PC for airplane travel or quiet evenings.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-xs">
            <BookOpen className="w-7 h-7 text-amber-600 mb-3" />
            <h2 className="text-lg font-black font-fun text-[#0F294A] mb-2">Digital + Printable Learning</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pair 45 interactive mini-games across 225 progressive levels with instant-download PDF colouring, ABC phonics, and early maths adventure books.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-violet-200 p-6 shadow-xs">
            <Globe className="w-7 h-7 text-violet-600 mb-3" />
            <h2 className="text-lg font-black font-fun text-[#0F294A] mb-2">Global Curriculum Alignment</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Supports Montessori-friendly counting, phonics decoding, world continents &amp; flags, animal habitats, and logic reasoning for international learners.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Curriculum Worlds Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
        <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700 font-fun mb-1">
                5 Discovery Islands · 45 Educational Mini-Games
              </p>
              <h2 className="text-2xl sm:text-3xl font-black font-fun text-[#0F294A]">
                Inside the Wonder World Curriculum
              </h2>
            </div>
            <a
              href={getRoutePath('worlds')}
              onClick={(e) => handleLink(e, 'worlds')}
              className="text-xs sm:text-sm font-black font-fun text-sky-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            >
              <Compass className="w-4 h-4" />
              <span>View Full World Directory →</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {WORLDS.map((world) => (
              <a
                key={world.id}
                href={getRoutePath('world_detail', world.id)}
                onClick={(e) => handleLink(e, 'world_detail', world.id)}
                className="p-4 rounded-2xl bg-[#F8FCFF] hover:bg-sky-50 border border-sky-200 transition flex flex-col justify-between gap-3 group"
              >
                <div>
                  <WorldEmblem worldId={world.id} size="md" className="mb-3" />
                  <h3 className="text-sm font-black font-fun text-[#0F294A] mb-1 group-hover:text-sky-700">
                    {world.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {world.subtitle}
                  </p>
                </div>
                <span className="text-xs font-bold font-fun text-sky-700">
                  {world.gameCount} Games →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-300 rounded-3xl p-8 sm:p-10 border-2 border-amber-200 text-amber-950 text-center shadow-sm">
          <Sparkles className="w-8 h-8 text-amber-900 mx-auto mb-2" />
          <h2 className="text-2xl sm:text-3xl font-black font-fun mb-2">
            Ready to Start Learning Together?
          </h2>
          <p className="text-sm font-semibold text-amber-950/90 max-w-xl mx-auto mb-6">
            Test our interactive games right away in Demo Mode or unlock all 45 games and offline PWA installation for one family payment ($9 USD).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getRoutePath('pricing')}
              onClick={(e) => handleLink(e, 'pricing')}
              className="px-6 py-3 rounded-2xl bg-[#0F294A] hover:bg-sky-900 text-white font-fun font-black text-sm shadow-xs transition whitespace-nowrap"
            >
              Get Lifetime Family Access
            </a>
            <a
              href={getRoutePath('contact')}
              onClick={(e) => handleLink(e, 'contact')}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-[#0F294A] font-fun font-bold text-sm border border-amber-500/40 transition whitespace-nowrap"
            >
              Contact Parent Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
