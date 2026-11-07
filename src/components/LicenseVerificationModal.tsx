/**
 * License Key Verification Modal for Gumroad & Etsy Customers
 * Connects directly to Gumroad API to authenticate paying buyers and unlock all 45 games.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, CheckCircle2, AlertCircle, Loader2, X, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { licenseService, LicenseVerificationResult } from '../services/licenseService';
import { soundEngine } from '../services/soundEngine';

interface LicenseVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LicenseVerificationModal: React.FC<LicenseVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LicenseVerificationResult | null>(null);

  const stored = licenseService.getStoredLicense();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim() || isLoading) return;

    soundEngine.playPop();
    setIsLoading(true);
    setResult(null);

    try {
      const res = await licenseService.verifyGumroadLicense(licenseKeyInput);
      setResult(res);
      if (res.success) {
        soundEngine.playVictory();
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        soundEngine.playPop();
      }
    } catch {
      setResult({
        success: false,
        message: 'Could not connect to license server. Please verify your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 font-body"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-fun">
                Gumroad Customer Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-fun text-white">
                Enter License Key
              </h2>
            </div>
          </div>

          {stored.isUnlocked && !result ? (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-fun font-bold text-sm text-emerald-300">License Already Active</span>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                This device is already fully unlocked! All 45 games and 5 worlds are active offline.
              </p>
              {stored.licenseKey && (
                <div className="text-[11px] font-mono text-emerald-300 bg-emerald-900/40 px-2 py-1 rounded-lg">
                  Key: {stored.licenseKey}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              If you purchased on <strong className="text-white">Gumroad</strong> or <strong className="text-white">Etsy</strong>, paste the unique license key from your receipt below to permanently unlock all 45 games on this device.
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 font-fun mb-1.5">
                License Key (from your Gumroad receipt)
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. 8F7A2B1C-4D5E6F-7G8H9I"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition uppercase tracking-wider"
              />
            </div>

            {/* Status Messages */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  result.success
                    ? 'bg-emerald-950/60 border border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/60 border border-rose-500/50 text-rose-200'
                }`}
              >
                {result.success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-fun font-bold text-white text-xs flex items-center gap-1.5">
                        <span>License Verified Successfully!</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <p className="text-[11px] text-emerald-300 mt-0.5">
                        Welcome {result.buyerEmail ? `(${result.buyerEmail})` : ''}! Unlocking all 45 games now...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-fun font-bold text-white text-xs">Verification Failed</div>
                      <p className="text-[11px] text-rose-300 mt-0.5">{result.message}</p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !licenseKeyInput.trim()}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-amber-950 font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border-2 border-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying with Gumroad...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Unlock Full Access</span>
                </>
              )}
            </button>
          </form>

          {/* Help Links Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <a
              href="https://namank3.gumroad.com/l/wvpisb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Don't have a license? Buy for $9</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <span className="text-slate-500">Need help? wonderworldkidslearning@gmail.com</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
