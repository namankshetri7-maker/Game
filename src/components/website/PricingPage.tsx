/**
 * Wonder World Kids Website - Pricing & Activation Page
 * Lifetime Family License with Activation Key on bright storybook marketplace palette.
 */

import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import {
  CheckCircle2,
  Lock,
  KeyRound,
  ShoppingBag,
  Download,
  ChevronRight,
  Laptop,
  ShieldCheck,
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: string) => void;
  onUnlockSuccess: () => void;
  onOpenLicenseModal?: () => void;
}

const GUMROAD_CHECKOUT_URL = 'https://namank3.gumroad.com/l/wvpisb';

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onUnlockSuccess: _onUnlockSuccess,
  onOpenLicenseModal,
}) => {
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
            <span className="text-[#0F294A] font-bold">Lifetime Family License</span>
          </nav>
          <span className="font-semibold text-emerald-700">Zero Subscriptions · Play 100% Offline</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 font-fun mb-2">
            One-Time Lifetime Family License · Ages 3–8
          </p>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mb-3 tracking-tight text-balance">
            Unlock 45 Kids Learning Games
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            One-time purchase ($9.00) or activate directly with your license key. Play all 45 educational games offline across Mac, iPhone, iPad, Windows, and Android forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-10 shadow-md">
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-fun text-[#0F294A] mb-4">
                What&apos;s Included in Your Lifetime License:
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Full access to all 45 educational mini-games (225 progressive levels)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>All 5 magical world islands (Math, Phonics, Geography, Science, Logic)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>100% Offline App (Installable PWA on iPhone, iPad, Android, Mac &amp; PC)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Up to 4 child profile progress trackers &amp; sticker reward albums</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>COPPA-compliant parental gate, zero ads &amp; screen time limits</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-sky-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Instant lifetime activation via your Activation Key or Gumroad receipt.</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-b from-amber-50 via-[#FFFDF7] to-sky-50 p-6 sm:p-8 rounded-2xl border-2 border-amber-200 text-center flex flex-col justify-between gap-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-800 font-fun mb-1">
                Lifetime Family Access
              </div>
              <div className="text-4xl sm:text-5xl font-black font-fun text-[#0F294A] mb-1 tabular-nums">
                $9.00
              </div>
              <div className="text-xs text-emerald-700 font-bold">
                One-Time USD · Zero Recurring Fees
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  if (onOpenLicenseModal) onOpenLicenseModal();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-black text-sm shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enter Activation Key</span>
              </button>

              <a
                href={GUMROAD_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playPop()}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border border-amber-500/40 whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4 text-amber-950" />
                <span>Buy on Gumroad ($9)</span>
              </a>

              <a
                href={getRoutePath('downloads')}
                onClick={(e) => handleLink(e, 'downloads')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-sky-50 text-[#0F294A] font-fun font-bold text-xs flex items-center justify-center gap-1.5 transition border border-sky-200 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Install Offline App (PWA) Guide</span>
              </a>
            </div>
          </div>
        </div>

        {/* Supporting Highlights Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-sky-200 p-5 flex items-start gap-3">
            <Laptop className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black font-fun text-[#0F294A] mb-1">
                Multi-Device Family Compatibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Install and play seamlessly on Apple Mac, iPhone, iPad, Windows PC, and Android tablets—at home, on flights, or offline during holidays.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 p-5 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black font-fun text-[#0F294A] mb-1">
                Already Purchased Printable Books?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visit our{' '}
                <a
                  href={getRoutePath('store')}
                  onClick={(e) => handleLink(e, 'store')}
                  className="text-sky-700 font-bold hover:underline"
                >
                  Wonder World Kids Store
                </a>{' '}
                to browse Dinosaur Colouring, ABC Alphabet, Christmas Wonderland, and My First Maths Adventure printable PDFs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
