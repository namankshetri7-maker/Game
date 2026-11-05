/**
 * Wonder World Kids - First-Time Onboarding Experience (FTUX)
 * Welcomes new families, guides the parent through PIN creation,
 * sets up the first child player profile with age-adaptive brackets,
 * explains local device data saving, and launches them into the World Map.
 *
 * Privacy Promise:
 * - Zero mandatory accounts or cloud registration.
 * - Zero email or personal data collection.
 * - 100% local device storage.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Shield,
  KeyRound,
  User,
  Heart,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  WifiOff,
  Star
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';
import { parentSecurityService } from '../services/parentSecurityService';
import { ChildProfile, AgeGroup } from '../types/game';
import confetti from 'canvas-confetti';

interface FirstTimeOnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: ChildProfile) => void;
}

const AVATARS = ['🦁', '🦊', '🐼', '🐨', '🦖', '🦄', '🚀', '⭐', '🐬', '🦉'];

export const FirstTimeOnboardingModal: React.FC<FirstTimeOnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Parent PIN state
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Child Profile state
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(5);
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState(45);
  const [profileError, setProfileError] = useState('');

  if (!isOpen) return null;

  // Determine age group
  const getAgeGroup = (age: number): AgeGroup => {
    if (age <= 4) return '3-4';
    if (age <= 7) return '5-7';
    return '8-10';
  };

  const handleStep1Next = () => {
    soundEngine.playPop();
    setStep(2);
  };

  const handleStep2SavePin = async () => {
    setPinError('');
    if (pin.length !== 4) {
      setPinError('PIN must be exactly 4 digits.');
      soundEngine.playOops();
      return;
    }
    if (pin !== confirmPin) {
      setPinError('PIN confirmation does not match. Please re-enter.');
      soundEngine.playOops();
      return;
    }

    const res = await parentSecurityService.setupPin(pin, confirmPin);
    if (!res.success) {
      setPinError(res.error || 'Invalid PIN.');
      soundEngine.playOops();
      return;
    }

    soundEngine.playSnap();
    setStep(3);
  };

  const handleStep3Next = () => {
    setProfileError('');
    const trimmed = childName.trim();
    if (!trimmed) {
      setProfileError("Please enter your child's first name or nickname.");
      soundEngine.playOops();
      return;
    }

    soundEngine.playPop();
    setStep(4);
  };

  const handleFinishOnboarding = () => {
    const ageGroup = getAgeGroup(childAge);
    const newProfile = storageService.createProfile({
      name: childName.trim(),
      age: childAge,
      ageGroup,
      avatar: selectedAvatar,
      dailyTimeLimitMinutes: dailyLimitMinutes
    });

    if (newProfile) {
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {}
      soundEngine.playVictory();
      onComplete(newProfile);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none font-body overflow-y-auto">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 overflow-hidden text-slate-800 my-auto"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-5 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl animate-bounce">🚀</span>
            <h2 className="text-xl sm:text-2xl font-black font-fun tracking-wide">
              Wonder World Kids
            </h2>
          </div>
          <p className="text-xs text-indigo-100 font-medium">
            Super Quest • 100% Offline Educational Suite
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s ? 'w-8 bg-amber-400' : step > s ? 'w-3 bg-emerald-400' : 'w-3 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 bg-slate-50">
          <AnimatePresence mode="wait">
            {/* STEP 1: Welcome & Overview */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black font-fun text-slate-900">
                    Welcome to Safe, Ad-Free Learning!
                  </h3>
                  <p className="text-xs text-slate-600">
                    A complete one-time purchase designed for children aged 3–10.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-2xs flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <WifiOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">100% Offline</h4>
                      <p className="text-[11px] text-slate-500">Play anywhere without wifi, data, or network ads.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-2xs flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Private by Design</h4>
                      <p className="text-[11px] text-slate-500">No account creation, no tracking, and no external data collection.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-2xs flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">45 Mini-Games</h4>
                      <p className="text-[11px] text-slate-500">5 worlds covering Math, Phonics, Geography, Science & Logic.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-2xs flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Up to 4 Children</h4>
                      <p className="text-[11px] text-slate-500">Separate progress, stars, stickers, and playtime tracking.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white font-fun font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Family Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Secure Parent PIN Setup */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-1">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black font-fun text-slate-900">
                    Create Your Parent PIN
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Choose a 4-digit security code. This locks the Parent Dashboard, screen-time settings, and profile controls from accidental child access.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      New 4-Digit Parent PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={pin}
                      onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full px-4 py-2.5 text-center text-xl font-mono tracking-widest border-2 border-indigo-200 focus:border-indigo-600 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={confirmPin}
                      onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full px-4 py-2.5 text-center text-xl font-mono tracking-widest border-2 border-indigo-200 focus:border-indigo-600 rounded-xl outline-none"
                    />
                  </div>

                  {pinError && (
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                      {pinError}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 text-center">
                    🔒 Stored locally with salted cryptographic hashing. No default PIN exists.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStep2SavePin}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white font-fun font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Save PIN & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: First Child Profile */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black font-fun text-slate-900">
                    Create Your First Child Profile
                  </h3>
                  <p className="text-xs text-slate-600">
                    We adapt game difficulty and challenges based on age.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-3.5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Child's Name or Nickname
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={childName}
                      onChange={e => setChildName(e.target.value)}
                      placeholder="e.g., Alex, Sammy, Leo"
                      className="w-full px-3.5 py-2.5 text-sm font-bold border-2 border-indigo-200 focus:border-indigo-600 rounded-xl outline-none"
                    />
                  </div>

                  {/* Age Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Age: <span className="text-indigo-600 font-black">{childAge} Years Old</span>
                      </label>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {childAge <= 4 ? 'Ages 3–4: Early Explorer' : childAge <= 7 ? 'Ages 5–7: Adventurer' : 'Ages 8–10: Champion'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[3, 4, 5, 6, 7, 8, 9, 10].map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => {
                            soundEngine.playPop();
                            setChildAge(a);
                          }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-fun font-black transition active:scale-95 ${
                            childAge === a
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Choose an Avatar
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVATARS.map(av => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => {
                            soundEngine.playPop();
                            setSelectedAvatar(av);
                          }}
                          className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition active:scale-95 ${
                            selectedAvatar === av
                              ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-sm'
                              : 'bg-slate-100 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Screen Time Limit */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Daily Playtime Reminder</span>
                      <span className="text-amber-600">{dailyLimitMinutes} Minutes</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={120}
                      step={15}
                      value={dailyLimitMinutes}
                      onChange={e => setDailyLimitMinutes(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {profileError && (
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                      {profileError}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStep3Next}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white font-fun font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Next: Playtime Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Explanation of Local Saving & Ready to Play */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <span className="text-4xl animate-bounce block">✨</span>
                  <h3 className="text-lg font-black font-fun text-slate-900">
                    You're All Set, {childName}!
                  </h3>
                  <p className="text-xs text-slate-600">
                    Everything is prepared for an amazing learning journey.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Progress Saved Locally:</strong> Golden stars, scores, and unlocked stickers are saved safely on this device.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Offline Freedom:</strong> Install to your home screen or download our portable offline bundle to play anywhere without internet.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Family Controls:</strong> Access the Parent Dashboard anytime by tapping the shield in the top header.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 hover:brightness-110 active:scale-95 text-white font-fun font-black text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                >
                  <span>Launch Wonder World Map!</span>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
