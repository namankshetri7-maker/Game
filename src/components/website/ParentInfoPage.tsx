/**
 * Wonder World Kids Website - Parents, Milestones & Safety Guide (/parents)
 */

import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import { Shield, Lock, CheckCircle2, ChevronRight, Users, BookOpen, Clock } from 'lucide-react';

interface ParentInfoPageProps {
  onNavigate: (route: string) => void;
}

const AGE_CURRICULUM = [
  {
    age: 'Ages 3–4 · Preschool Readiness',
    focus: 'Counting 1–10, letter recognition, basic colours & shapes, animal sounds, and beginner tracing.',
    tone: 'bg-sky-50 border-sky-200',
  },
  {
    age: 'Ages 5–6 · Kindergarten Core',
    focus: 'Single-digit addition & subtraction, CVC phonics blending, rhyming, sight words, and continents.',
    tone: 'bg-emerald-50 border-emerald-200',
  },
  {
    age: 'Ages 7–8 · Early Primary Mastery',
    focus: 'Multiplication blitz, analog clock reading, solar system STEM, food chains, and logic mazes.',
    tone: 'bg-amber-50 border-amber-200',
  },
];

export const ParentInfoPage: React.FC<ParentInfoPageProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">Parents &amp; Safety</span>
          </nav>
          <span className="font-semibold text-emerald-700">COPPA &amp; GDPR-K Compliant · Ad-Free</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 font-fun mb-2">
            Parent Info &amp; Child Safety Architecture
          </p>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mb-3 tracking-tight">
            Parental Controls &amp; Privacy
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            Simple, offline-first educational games and printable activity workbooks designed for family safety, calm screen time, and measurable milestones.
          </p>
        </div>

        {/* Core Safety Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-3xl border-2 border-amber-200 p-7 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F294A] font-black font-fun text-lg">
              <Shield className="w-6 h-6 text-amber-600 shrink-0" />
              <span>Secure Parental Gate</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All parent settings, daily time limit controls, and child profile management are protected behind an adult math verification gate so children stay focused inside safe gameplay.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-emerald-200 p-7 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F294A] font-black font-fun text-lg">
              <Lock className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>100% Offline &amp; Zero Telemetry</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Wonder World Kids runs completely offline. Zero personal user data, game progress, or child profile information is sent to third-party servers—everything stays strictly local on your device.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-sky-200 p-7 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F294A] font-black font-fun text-lg">
              <CheckCircle2 className="w-6 h-6 text-sky-600 shrink-0" />
              <span>Ad-Free Distraction-Free Play</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We provide a calm, purposeful learning environment with zero pop-up ads, zero social feeds, and zero surprise in-app microtransactions during children&apos;s sessions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-violet-200 p-7 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F294A] font-black font-fun text-lg">
              <Clock className="w-6 h-6 text-violet-600 shrink-0" />
              <span>Progress Profiles &amp; Screen Limits</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Track up to 4 children independently across Math, Phonics, Geography, Science, and Logic—ideal for siblings, homeschool portfolios, and parent-teacher milestone check-ins.
            </p>
          </div>
        </div>

        {/* Age-Staged Learning Progression */}
        <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-8 shadow-xs mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <Users className="w-5 h-5 text-sky-700" />
            <h2 className="text-xl sm:text-2xl font-black font-fun text-[#0F294A]">
              Age-Staged Early Learning Roadmap (Ages 3–8)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGE_CURRICULUM.map((item) => (
              <div key={item.age} className={`rounded-2xl border p-5 ${item.tone}`}>
                <h3 className="text-sm font-black font-fun text-[#0F294A] mb-2">{item.age}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={getRoutePath('privacy')}
            onClick={(e) => handleLink(e, 'privacy')}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-sky-50 text-[#0F294A] font-fun font-bold text-xs border border-sky-200 transition whitespace-nowrap"
          >
            Read Privacy &amp; COPPA Policy
          </a>
          <a
            href={getRoutePath('store')}
            onClick={(e) => handleLink(e, 'store')}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs transition inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Printable Books &amp; App</span>
          </a>
          <a
            href={getRoutePath('demo')}
            onClick={(e) => handleLink(e, 'demo')}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-black text-xs transition whitespace-nowrap"
          >
            Try Free Demo
          </a>
        </div>
      </div>
    </div>
  );
};
