/**
 * Wonder World Kids Website - Pricing & PayPal Checkout Page
 * $9 USD one-time payment with secure checkout simulation & instant license unlocking.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { Shield, CheckCircle2, Lock, Download, Sparkles, ArrowRight, KeyRound } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: string) => void;
  onUnlockSuccess: () => void;
  onOpenLicenseModal?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onUnlockSuccess, onOpenLicenseModal }) => {
  const GUMROAD_LINK = 'https://namank3.gumroad.com/l/wvpisb?_gl=1*ikkar4*_ga*ODc0MjIxOC4xNzkzMTY5MzA5*_ga_6LJN6D94N6*czE3OTQwMTk2MDYkbzExJGcxJHQxNzk0MDE5NjI1JGo0MSRsMCRoMA..';

  const handleGumroadCheckout = () => {
    soundEngine.playPop();
    window.open(GUMROAD_LINK, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-fun mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lifetime Family License</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mb-3">
            Unlock Full Game Access
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            One simple payment of $9 USD. No subscriptions. No recurring charges. Lifetime updates included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-800/90 rounded-3xl border-3 border-amber-400 p-8 sm:p-10 shadow-2xl">
          
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-black font-fun text-white">What's Included in Your $9 License:</h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Full access to all 45 educational mini-games</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> All 5 magical world islands (Math, Phonics, Geo, Science, Logic)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> 100% Offline App (Installable on iOS, Android, Mac & PC)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Up to 4 child profile progress trackers & sticker albums</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> COPPA-compliant parental gate & screen time limits</li>
            </ul>

            <div className="pt-4 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Secure 256-bit SSL encryption powered by Gumroad & Stripe architecture.</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">One-Time Payment</div>
              <div className="text-5xl font-black font-fun text-amber-300 mb-2">$9 <span className="text-lg text-slate-400">USD</span></div>
              <div className="text-[11px] text-emerald-400 font-bold mb-6">✓ Instant Digital Delivery & License Key</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGumroadCheckout}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>Buy Lifetime License ($9.00)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400 mb-2 font-medium">Already bought on Gumroad or Etsy?</p>
                <button
                  onClick={() => onOpenLicenseModal ? onOpenLicenseModal() : onNavigate('my_games')}
                  className="w-full py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 text-xs font-fun font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Enter License Key to Unlock</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
