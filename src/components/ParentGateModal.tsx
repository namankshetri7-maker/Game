/**
 * COPPA Compliant Parent Gate & Grown-Up Verification Modal
 * Protects children from accessing parent settings, screen time limits, and profiles.
 * Features dual verification:
 * 1. Dynamic Adult Challenge (Runtime randomized multi-step arithmetic & spelled numbers)
 * 2. 4-Digit Parent PIN (Salted cryptographic hash with brute-force throttling & lockouts)
 * Full touch keypad + physical keyboard support with tactile audio feedback.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, X, Check, RefreshCw, KeyRound, Calculator, AlertCircle, ArrowLeft, Clock } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { parentSecurityService, DynamicChallenge } from '../services/parentSecurityService';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onCancel
}) => {
  const [mode, setMode] = useState<'challenge' | 'pin'>('challenge');
  const [currentChallenge, setCurrentChallenge] = useState<DynamicChallenge>(() => parentSecurityService.generateDynamicChallenge());
  const [inputVal, setInputVal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [lockoutSec, setLockoutSec] = useState(0);
  const [isPinSetupNeeded, setIsPinSetupNeeded] = useState(false);
  const [confirmPinVal, setConfirmPinVal] = useState('');

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const timer = setInterval(() => {
      setLockoutSec(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSec]);

  // Load state and randomize challenge on open
  useEffect(() => {
    if (isOpen) {
      const remaining = parentSecurityService.getLockoutRemainingSeconds();
      setLockoutSec(remaining);
      const isConfigured = parentSecurityService.isPinConfigured();
      setIsPinSetupNeeded(!isConfigured);
      setCurrentChallenge(parentSecurityService.generateDynamicChallenge());
      setInputVal('');
      setConfirmPinVal('');
      setErrorMessage(remaining > 0 ? `Security lockout active. Please wait ${remaining}s.` : '');
      setIsShaking(false);
    }
  }, [isOpen]);

  const pickNewChallenge = () => {
    soundEngine.playPop();
    setCurrentChallenge(parentSecurityService.generateDynamicChallenge());
    setInputVal('');
    setErrorMessage('');
  };

  const handleVerify = useCallback(async () => {
    if (lockoutSec > 0) return;
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    if (mode === 'challenge') {
      const isCorrect = trimmed === currentChallenge.expectedAnswer;
      if (isCorrect) {
        soundEngine.playSnap();
        setErrorMessage('');
        onSuccess();
      } else {
        soundEngine.playOops();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setErrorMessage('Incorrect answer. Please solve this new question.');
        setCurrentChallenge(parentSecurityService.generateDynamicChallenge());
        setInputVal('');
      }
    } else {
      // PIN Mode
      if (isPinSetupNeeded) {
        // Setup flow
        if (trimmed.length !== 4 || confirmPinVal.length !== 4) {
          setErrorMessage('Please enter and confirm a 4-digit PIN.');
          soundEngine.playOops();
          return;
        }
        const res = await parentSecurityService.setupPin(trimmed, confirmPinVal);
        if (res.success) {
          soundEngine.playSnap();
          setIsPinSetupNeeded(false);
          onSuccess();
        } else {
          soundEngine.playOops();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          setErrorMessage(res.error || 'Failed to set PIN.');
        }
      } else {
        // Verify flow
        const res = await parentSecurityService.verifyPin(trimmed);
        if (res.success) {
          soundEngine.playSnap();
          setErrorMessage('');
          onSuccess();
        } else {
          soundEngine.playOops();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          setErrorMessage(res.error || 'Incorrect PIN.');
          setInputVal('');
          if (res.lockoutSeconds) {
            setLockoutSec(res.lockoutSeconds);
          }
        }
      }
    }
  }, [inputVal, confirmPinVal, mode, currentChallenge, lockoutSec, isPinSetupNeeded, onSuccess]);

  const handleKeypadPress = useCallback((val: string) => {
    if (lockoutSec > 0) return;
    soundEngine.playPop();
    setErrorMessage('');

    if (val === 'clear') {
      setInputVal('');
      setConfirmPinVal('');
    } else if (val === 'back') {
      setInputVal(prev => prev.slice(0, -1));
    } else {
      setInputVal(prev => {
        const maxLen = mode === 'pin' ? 4 : 5;
        if (prev.length >= maxLen) return prev;
        const nextVal = prev + val;
        // Auto verify 4-digit PIN in standard verification mode
        if (mode === 'pin' && !isPinSetupNeeded && nextVal.length === 4) {
          setTimeout(async () => {
            const res = await parentSecurityService.verifyPin(nextVal);
            if (res.success) {
              soundEngine.playSnap();
              onSuccess();
            } else {
              soundEngine.playOops();
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), 500);
              setErrorMessage(res.error || 'Incorrect PIN.');
              setInputVal('');
              if (res.lockoutSeconds) {
                setLockoutSec(res.lockoutSeconds);
              }
            }
          }, 150);
        }
        return nextVal;
      });
    }
  }, [mode, isPinSetupNeeded, lockoutSec, onSuccess]);

  // Physical keyboard support for desktop & laptop parents
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (lockoutSec > 0) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        handleKeypadPress('back');
      } else if (e.key === 'Escape') {
        soundEngine.playPop();
        onCancel();
      } else if (e.key === 'Enter') {
        handleVerify();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lockoutSec, handleKeypadPress, handleVerify, onCancel]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none font-body overflow-y-auto">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-sm sm:max-w-md my-auto max-h-[96vh] sm:max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden text-center ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/* Top Header */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white px-4 py-3 sm:px-6 sm:py-4 relative shrink-0">
            {/* Top-Left Back Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onCancel();
              }}
              className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-2.5 py-1 text-indigo-100 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center gap-1 text-xs font-fun font-bold cursor-pointer"
              title="Return to WonderWorld Games"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                onCancel();
              }}
              className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 p-1.5 text-indigo-200 hover:text-white rounded-xl hover:bg-white/10 active:scale-95 transition cursor-pointer"
              title="Close Parent Verification"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Parent Shield Icon */}
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 shadow-inner mb-1.5">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300/30 text-amber-300" />
            </div>

            <h3 className="text-lg sm:text-xl font-black font-fun tracking-wide text-white leading-tight">
              Parent & Guardian Gate
            </h3>
            <p className="text-[11px] sm:text-xs text-indigo-100/90 mt-0.5 max-w-xs mx-auto font-medium">
              Verify you are an adult to access settings & profiles.
            </p>

            {/* Verification Mode Toggle */}
            <div className="flex bg-indigo-950/60 p-1 rounded-2xl mt-2.5 border border-indigo-400/30 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setMode('challenge');
                  setInputVal('');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold font-fun flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'challenge'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Adult Challenge</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setMode('pin');
                  setInputVal('');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold font-fun flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'pin'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Parent PIN</span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-3 sm:p-5 bg-slate-50 flex-1 overflow-y-auto">
            {/* Lockout Warning Banner */}
            {lockoutSec > 0 && (
              <div className="mb-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-900 text-xs font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Security Throttling: Wait {lockoutSec}s to try again</span>
              </div>
            )}

            {mode === 'challenge' ? (
              /* Adult Challenge Mode */
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-2.5 sm:p-3.5 shadow-sm mb-2.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                    {currentChallenge.subtext}
                  </span>
                  <button
                    type="button"
                    onClick={pickNewChallenge}
                    className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
                    title="Get a different question"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 py-0.5 font-fun">
                  {currentChallenge.prompt}
                </div>
              </div>
            ) : (
              /* PIN Code Mode */
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-2.5 sm:p-3 shadow-sm mb-2.5">
                <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1.5">
                  {isPinSetupNeeded ? 'Create 4-Digit Parent PIN' : 'Enter 4-Digit Parent PIN'}
                </div>
                {/* Visual PIN dots */}
                <div className="flex justify-center items-center gap-3 py-1">
                  {[0, 1, 2, 3].map(idx => (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${
                        inputVal.length > idx
                          ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-sm'
                          : 'border-slate-300 bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
                {isPinSetupNeeded ? (
                  <div className="mt-2 text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">Confirm PIN above:</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={confirmPinVal}
                      onChange={e => setConfirmPinVal(e.target.value.replace(/\D/g, ''))}
                      placeholder="Re-enter 4-digit PIN"
                      className="w-full px-2.5 py-1 text-center font-mono text-sm border rounded-lg"
                    />
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Protected with salted cryptographic derivation
                  </p>
                )}
              </div>
            )}

            {/* Answer Display Box (for Challenge mode) */}
            {mode === 'challenge' && (
              <div className="flex items-center justify-center h-10 sm:h-12 bg-white border-2 border-indigo-200 rounded-2xl text-xl sm:text-2xl font-black tracking-widest text-indigo-950 mb-2.5 shadow-inner">
                {inputVal ? (
                  inputVal
                ) : (
                  <span className="text-slate-300 font-normal text-xs sm:text-sm font-sans tracking-normal">
                    Tap numbers or type on keyboard
                  </span>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl py-1 px-2.5 mb-2.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Responsive Keypad */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(item => (
                <button
                  key={item}
                  type="button"
                  disabled={lockoutSec > 0}
                  onClick={() => {
                    if (item === 'C') handleKeypadPress('clear');
                    else if (item === '⌫') handleKeypadPress('back');
                    else handleKeypadPress(item);
                  }}
                  className={`h-10 sm:h-12 rounded-xl sm:rounded-2xl font-black font-fun text-base sm:text-lg transition shadow-sm active:scale-95 border flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    item === 'C'
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                      : item === '⌫'
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-white hover:bg-indigo-50 text-slate-800 border-slate-200'
                  }`}
                  aria-label={item === 'C' ? 'Clear' : item === '⌫' ? 'Backspace' : item}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onCancel();
                }}
                className="flex-1 py-2.5 sm:py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span>Back to Games</span>
              </button>
              <button
                type="button"
                onClick={() => handleVerify()}
                disabled={!inputVal || lockoutSec > 0}
                className={`flex-1 py-2.5 sm:py-3 rounded-2xl font-bold font-fun text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 ${
                  inputVal && lockoutSec === 0
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-indigo-500/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Verify & Enter</span>
              </button>
            </div>

            {/* Security footer */}
            <div className="mt-2.5 text-[9px] sm:text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>100% Private • Local Storage Encryption • Zero Telemetry</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
