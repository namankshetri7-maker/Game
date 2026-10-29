/**
 * COPPA Compliant Parent Gate
 * Prevents small children from entering settings or modifying profiles.
 * Generates randomized adult challenges (e.g. written word math numbers: "Write 'SEVEN' in digits",
 * or spelled multiplication questions: "EIGHT x FOUR = ?").
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X, Check, Lock } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

interface GateChallenge {
  question: string;
  expectedAnswer: string;
  instruction: string;
}

const CHALLENGES: GateChallenge[] = [
  { question: "Write the number 'EIGHT' in digits", expectedAnswer: '8', instruction: 'Enter single digit' },
  { question: "Write the number 'SEVEN' in digits", expectedAnswer: '7', instruction: 'Enter single digit' },
  { question: "What is 4 multiplied by 3?", expectedAnswer: '12', instruction: 'Enter the answer in numbers' },
  { question: "What is 6 plus 7?", expectedAnswer: '13', instruction: 'Enter the sum in digits' },
  { question: "Write the number 'NINE' in digits", expectedAnswer: '9', instruction: 'Enter single digit' },
  { question: "What is 15 minus 6?", expectedAnswer: '9', instruction: 'Enter the answer in numbers' },
  { question: "What is 8 multiplied by 5?", expectedAnswer: '40', instruction: 'Enter the product in digits' }
];

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onCancel
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<GateChallenge>(CHALLENGES[0]);
  const [inputVal, setInputVal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Randomize challenge on open
  useEffect(() => {
    if (isOpen) {
      const randomIdx = Math.floor(Math.random() * CHALLENGES.length);
      setCurrentChallenge(CHALLENGES[randomIdx]);
      setInputVal('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputVal.trim() === currentChallenge.expectedAnswer) {
      soundEngine.playSnap();
      onSuccess();
    } else {
      soundEngine.playOops();
      setErrorMessage('Verification failed. Please try again.');
      // pick another challenge
      const randomIdx = Math.floor(Math.random() * CHALLENGES.length);
      setCurrentChallenge(CHALLENGES[randomIdx]);
      setInputVal('');
    }
  };

  const handleKeypadPress = (val: string) => {
    soundEngine.playPop();
    setErrorMessage('');
    if (val === 'clear') {
      setInputVal('');
    } else if (val === 'back') {
      setInputVal(prev => prev.slice(0, -1));
    } else {
      if (inputVal.length < 4) {
        setInputVal(prev => prev + val);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-indigo-300 text-center"
        >
          {/* Close button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onCancel();
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Shield Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-fun font-bold text-slate-900 mb-1">
            Grown-Ups Only
          </h3>
          <p className="text-xs font-body text-slate-500 mb-4">
            COPPA Safety Check: Please solve this question to access Parent Settings & Reports.
          </p>

          {/* The randomized challenge card */}
          <div className="bg-slate-50 border-2 border-indigo-100 rounded-2xl p-4 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
              {currentChallenge.instruction}
            </span>
            <div className="text-lg font-bold text-slate-800">
              {currentChallenge.question}
            </div>
          </div>

          {/* Input display */}
          <div className="flex items-center justify-center h-12 bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl text-2xl font-bold tracking-widest text-indigo-900 mb-2">
            {inputVal || <span className="text-slate-300 font-normal text-base">Tap numbers below</span>}
          </div>

          {errorMessage && (
            <p className="text-xs font-semibold text-rose-500 mb-2 animate-bounce">
              {errorMessage}
            </p>
          )}

          {/* Numeric keypad for touch devices */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item === 'C') handleKeypadPress('clear');
                  else if (item === '⌫') handleKeypadPress('back');
                  else handleKeypadPress(item);
                }}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-100 active:bg-indigo-200 text-slate-800 font-bold text-lg transition shadow-sm"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onCancel();
              }}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold text-sm hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!inputVal}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1 shadow-md transition ${
                inputVal
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-200 text-indigo-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
