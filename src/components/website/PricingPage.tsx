/**
 * Wonder World Kids Website - Pricing & PayPal Checkout Page
 * $9 USD one-time payment with secure checkout simulation & instant license unlocking.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { Shield, CheckCircle2, Lock, Download, Sparkles } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: string) => void;
  onUnlockSuccess: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onUnlockSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const handlePayPalCheckout = () => {
    soundEngine.playVictory();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('wwk_purchased', 'true');
      localStorage.setItem('wwk_license', `WWK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`);
      onUnlockSuccess();
      onNavigate('success');
    }, 1800);
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
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Offline ZIP package for Windows PC & Mac (.bat/.command)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Up to 4 child profile progress trackers & sticker albums</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> COPPA-compliant parental gate & screen time limits</li>
            </ul>

            <div className="pt-4 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Secure 256-bit SSL encryption powered by PayPal Sandbox & Stripe architecture.</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">One-Time Payment</div>
              <div className="text-5xl font-black font-fun text-amber-300 mb-2">$9 <span className="text-lg text-slate-400">USD</span></div>
              <div className="text-[11px] text-emerald-400 font-bold mb-6">✓ Instant Digital Delivery</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayPalCheckout}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Secure Checkout...</span>
                ) : (
                  <>
                    <span>Pay with PayPal ($9.00)</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePayPalCheckout}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-md transition cursor-pointer"
              >
                Credit / Debit Card (Fast Checkout)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
