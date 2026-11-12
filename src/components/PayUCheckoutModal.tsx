/**
 * PayU Global Checkout Modal for Wonder World Kids Learning
 * Features:
 * 1. Collects Parent Email for license dispatch
 * 2. Connects to /api/payu/create-order (PayU Global REST API)
 * 3. Handles live PayU redirect or instant developer sandbox simulation
 * 4. Automatically activates the lifetime license and enables full 45 games access
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Globe,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { licenseService } from '../services/licenseService';

interface PayUCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (licenseKey: string) => void;
}

export const PayUCheckoutModal: React.FC<PayUCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSimulatedFlow, setIsSimulatedFlow] = useState(false);
  const [simulatedOrderId, setSimulatedOrderId] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleStartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive your license key.');
      return;
    }

    setIsLoading(true);
    soundEngine.playPop();

    try {
      const res = await fetch('/api/payu/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: email.trim(),
          customerName: parentName.trim() || 'Valued Parent'
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to initialize PayU Global checkout.');
      }

      // If live credentials returned a PayU hosted page, redirect
      if (data.isLive && data.redirectUri) {
        window.location.href = data.redirectUri;
        return;
      }

      // If developer sandbox / simulation flow:
      setSimulatedOrderId(data.orderId);
      setIsSimulatedFlow(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error('PayU Checkout Error:', err);
      setErrorMessage(err.message || 'Unable to connect to PayU Global server.');
      setIsLoading(false);
    }
  };

  const handleCompleteSimulation = async () => {
    setIsConfirming(true);
    soundEngine.playPop();

    try {
      const res = await fetch('/api/payu/confirm-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: simulatedOrderId,
          customerEmail: email.trim()
        })
      });

      const data = await res.json();

      if (data.success && data.licenseKey) {
        licenseService.saveLicense(data.licenseKey, email.trim(), new Date().toISOString());
        soundEngine.playVictory();
        onSuccess(data.licenseKey);
      } else {
        throw new Error(data.message || 'Payment confirmation failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to verify simulated PayU payment.');
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-body">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={() => { soundEngine.playPop(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Globe className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold font-fun border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>PayU Global Gateway</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-fun text-white mt-0.5">
              PayU Secure Checkout
            </h2>
          </div>
        </div>

        {/* Order Summary Pill */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Item Details</div>
            <div className="text-sm font-bold text-white font-fun">Wonder World Kids (45 Games)</div>
            <div className="text-xs text-emerald-400 font-medium">✓ Lifetime Family License • No Subscriptions</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</div>
            <div className="text-2xl font-black font-fun text-amber-300">$9.00 <span className="text-xs text-slate-400">USD</span></div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {!isSimulatedFlow ? (
          /* Step 1: Parent Details & Continue to PayU */
          <form onSubmit={handleStartCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm font-medium transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your license key and purchase receipt will be linked to this email.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent / Guardian Name (Optional)
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm font-medium transition"
              />
            </div>

            {/* Payment Methods Supported Badges */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                Cards, Wallets &amp; Bank Transfer
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-Bit SSL
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition border border-emerald-400 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to PayU Global...</span>
                </>
              ) : (
                <>
                  <span>Pay $9.00 via PayU Global</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: PayU Sandbox Simulation Testing View */
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-fun mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>PayU Global Sandbox Session Initialized</span>
              </div>
              <p className="text-xs text-slate-300">
                Order ID: <span className="font-mono text-amber-300 font-bold">{simulatedOrderId}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                PayU Global is running in developer sandbox mode. You can test and confirm the payment flow right now to receive your verified license key!
              </p>
            </div>

            <button
              onClick={handleCompleteSimulation}
              disabled={isConfirming}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition border border-emerald-400 disabled:opacity-60"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying &amp; Unlocking License...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Test Payment &amp; Unlock Games</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PayU Global PCI-DSS Level 1 Encrypted Payment Security</span>
        </div>
      </div>
    </div>
  );
};
