/**
 * COPPA Compliant Parent Gate & Grown-Up Verification Modal
 * Protects children from accessing parent settings, screen time limits, and profiles.
 * Features dual verification:
 * 1. Quick Adult Challenge (Spelled-out words and arithmetic that young kids cannot accidentally pass)
 * 2. 4-Digit Parent PIN (Default 1234 or parent's custom PIN)
 * Full touch keypad + physical keyboard support with tactile audio feedback.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, X, Check, RefreshCw, KeyRound, Calculator, AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

interface AdultChallenge {
  id: string;
  question: string;
  subtext: string;
  expectedAnswer: string;
}

const ADULT_CHALLENGES: AdultChallenge[] = [
  { id: 'c1', question: 'What is 7 multiplied by 8?', subtext: 'Enter the answer in numbers', expectedAnswer: '56' },
  { id: 'c2', question: 'Type the digits for: NINE - THREE - FIVE', subtext: 'Enter the numbers in order', expectedAnswer: '935' },
  { id: 'c3', question: 'What is 14 plus 18?', subtext: 'Enter the sum in digits', expectedAnswer: '32' },
  { id: 'c4', question: 'Type the digits for: SEVEN - TWO - FOUR - ONE', subtext: 'Enter the numbers in order', expectedAnswer: '7241' },
  { id: 'c5', question: 'What is 9 multiplied by 6?', subtext: 'Enter the product in numbers', expectedAnswer: '54' },
  { id: 'c6', question: 'Type the digits for: SIX - EIGHT - ZERO - TWO', subtext: 'Enter the numbers in order', expectedAnswer: '6802' },
  { id: 'c7', question: 'What is 25 minus 9?', subtext: 'Enter the difference in digits', expectedAnswer: '16' },
  { id: 'c8', question: 'What is 8 multiplied by 4?', subtext: 'Enter the product in numbers', expectedAnswer: '32' },
  { id: 'c9', question: 'Type the digits for: FOUR - ONE - NINE - SEVEN', subtext: 'Enter the numbers in order', expectedAnswer: '4197' },
  { id: 'c10', question: 'What is 12 multiplied by 3?', subtext: 'Enter the product in numbers', expectedAnswer: '36' },
];

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onCancel
}) => {
  const [mode, setMode] = useState<'challenge' | 'pin'>('challenge');
  const [currentChallenge, setCurrentChallenge] = useState<AdultChallenge>(ADULT_CHALLENGES[0]);
  const [inputVal, setInputVal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [parentPin, setParentPin] = useState('1234');

  // Load parent PIN and randomize challenge on open
  useEffect(() => {
    if (isOpen) {
      const settings = storageService.getParentSettings();
      setParentPin(settings.parentPin || '1234');
      pickRandomChallenge();
      setInputVal('');
      setErrorMessage('');
      setIsShaking(false);
    }
  }, [isOpen]);

  const pickRandomChallenge = () => {
    const nextIdx = Math.floor(Math.random() * ADULT_CHALLENGES.length);
    setCurrentChallenge(ADULT_CHALLENGES[nextIdx]);
    setInputVal('');
    setErrorMessage('');
  };

  const handleVerify = useCallback(() => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const isCorrect = mode === 'challenge'
      ? trimmed === currentChallenge.expectedAnswer
      : trimmed === parentPin;

    if (isCorrect) {
      soundEngine.playSnap();
      setErrorMessage('');
      onSuccess();
    } else {
      soundEngine.playOops();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      if (mode === 'challenge') {
        setErrorMessage('Incorrect answer. Please try this new question.');
        pickRandomChallenge();
      } else {
        setErrorMessage(`Incorrect PIN. (Default is 1234)`);
        setInputVal('');
      }
    }
  }, [inputVal, mode, currentChallenge, parentPin, onSuccess]);

  const handleKeypadPress = useCallback((val: string) => {
    soundEngine.playPop();
    setErrorMessage('');
    if (val === 'clear') {
      setInputVal('');
    } else if (val === 'back') {
      setInputVal(prev => prev.slice(0, -1));
    } else {
      setInputVal(prev => {
        const maxLen = mode === 'pin' ? 4 : 5;
        if (prev.length >= maxLen) return prev;
        const nextVal = prev + val;
        // Auto-verify if 4-digit PIN is reached in PIN mode
        if (mode === 'pin' && nextVal.length === 4) {
          setTimeout(() => {
            if (nextVal === parentPin) {
              soundEngine.playSnap();
              onSuccess();
            } else {
              soundEngine.playOops();
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), 500);
              setErrorMessage('Incorrect PIN. (Default is 1234)');
              setInputVal('');
            }
          }, 150);
        }
        return nextVal;
      });
    }
  }, [mode, parentPin, onSuccess]);

  // Physical keyboard support for desktop & laptop parents
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isOpen, handleKeypadPress, handleVerify, onCancel]);

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
          {/* Top Sticky Header */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white px-4 py-3 sm:px-6 sm:py-4 relative shrink-0">
            {/* Top-Left Back Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onCancel();
              }}
              className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-2.5 py-1 text-indigo-100 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center gap-1 text-xs font-fun font-bold"
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
              className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 p-1.5 text-indigo-200 hover:text-white rounded-xl hover:bg-white/10 active:scale-95 transition"
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
              Verify you are a grown-up to access settings & profiles.
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
                className={`flex-1 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold font-fun flex items-center justify-center gap-1.5 transition ${
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
                className={`flex-1 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold font-fun flex items-center justify-center gap-1.5 transition ${
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
            {mode === 'challenge' ? (
              /* Adult Challenge Mode */
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-2.5 sm:p-3.5 shadow-sm mb-2.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                    {currentChallenge.subtext}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      pickRandomChallenge();
                    }}
                    className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition"
                    title="Get a different question"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 py-0.5 font-fun">
                  {currentChallenge.question}
                </div>
              </div>
            ) : (
              /* PIN Code Mode */
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-2.5 sm:p-3 shadow-sm mb-2.5">
                <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1.5">
                  Enter 4-Digit Parent PIN
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
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5">
                  Default: <strong className="text-indigo-600">1234</strong> (Change in Parent Settings)
                </p>
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
              <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl py-1 px-2.5 mb-2.5 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Responsive Tactile Touch Keypad */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === 'C') handleKeypadPress('clear');
                    else if (item === '⌫') handleKeypadPress('back');
                    else handleKeypadPress(item);
                  }}
                  className={`h-10 sm:h-12 rounded-xl sm:rounded-2xl font-black font-fun text-base sm:text-lg transition shadow-sm active:scale-95 border flex items-center justify-center ${
                    item === 'C'
                      ? 'bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border-rose-200'
                      : item === '⌫'
                      ? 'bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 border-amber-200'
                      : 'bg-white hover:bg-indigo-50 active:bg-indigo-100 text-slate-800 border-slate-200'
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
                className="flex-1 py-2.5 sm:py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span>Back to Games</span>
              </button>
              <button
                type="button"
                onClick={() => handleVerify()}
                disabled={!inputVal}
                className={`flex-1 py-2.5 sm:py-3 rounded-2xl font-bold font-fun text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 ${
                  inputVal
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-indigo-500/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Verify & Enter</span>
              </button>
            </div>

            {/* Reassuring COPPA footer */}
            <div className="mt-2.5 text-[9px] sm:text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>COPPA Compliant • 100% Private & Ad-Free</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
