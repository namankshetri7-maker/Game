import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Scale, CheckCircle2, RotateCcw, Volume2, HelpCircle } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

interface GreaterDragonScalesGameProps {
  currentLevel: 1 | 2 | 3 | 4 | 5;
  onCorrect: (points?: number) => void;
  onIncorrect: (hint?: string) => void;
}

interface ScaleQuestion {
  id: number;
  leftDisplay: string;
  leftValue: number;
  rightDisplay: string;
  rightValue: number;
  correctOp: '<' | '=' | '>';
  hint: string;
}

const QUESTIONS_BY_LEVEL: Record<number, ScaleQuestion[]> = {
  // Level 1: Numbers 1 - 10 with direct counting
  1: [
    { id: 1, leftDisplay: '4', leftValue: 4, rightDisplay: '7', rightValue: 7, correctOp: '<', hint: '7 gems are heavier than 4 gems! The dragon chomps 7!' },
    { id: 2, leftDisplay: '9', leftValue: 9, rightDisplay: '3', rightValue: 3, correctOp: '>', hint: '9 is bigger than 3! The scale tilts to 9!' },
    { id: 3, leftDisplay: '5', leftValue: 5, rightDisplay: '5', rightValue: 5, correctOp: '=', hint: 'Both sides have 5 gems! The scale is perfectly balanced!' },
    { id: 4, leftDisplay: '8', leftValue: 8, rightDisplay: '2', rightValue: 2, correctOp: '>', hint: '8 is much bigger than 2!' },
    { id: 5, leftDisplay: '6', leftValue: 6, rightDisplay: '10', rightValue: 10, correctOp: '<', hint: '10 is greater than 6!' }
  ],
  // Level 2: Numbers 10 - 25
  2: [
    { id: 1, leftDisplay: '12', leftValue: 12, rightDisplay: '18', rightValue: 18, correctOp: '<', hint: '18 is greater than 12!' },
    { id: 2, leftDisplay: '20', leftValue: 20, rightDisplay: '15', rightValue: 15, correctOp: '>', hint: '20 is heavier than 15!' },
    { id: 3, leftDisplay: '16', leftValue: 16, rightDisplay: '16', rightValue: 16, correctOp: '=', hint: '16 equals 16! Perfectly balanced scale!' },
    { id: 4, leftDisplay: '25', leftValue: 25, rightDisplay: '21', rightValue: 21, correctOp: '>', hint: '25 is greater than 21!' },
    { id: 5, leftDisplay: '11', leftValue: 11, rightDisplay: '19', rightValue: 19, correctOp: '<', hint: '19 is greater than 11!' }
  ],
  // Level 3: Numbers 25 - 60 & Tens comparison
  3: [
    { id: 1, leftDisplay: '42', leftValue: 42, rightDisplay: '37', rightValue: 37, correctOp: '>', hint: '4 tens is bigger than 3 tens!' },
    { id: 2, leftDisplay: '28', leftValue: 28, rightDisplay: '50', rightValue: 50, correctOp: '<', hint: '50 is much greater than 28!' },
    { id: 3, leftDisplay: '35', leftValue: 35, rightDisplay: '35', rightValue: 35, correctOp: '=', hint: '35 equals 35!' },
    { id: 4, leftDisplay: '58', leftValue: 58, rightDisplay: '49', rightValue: 49, correctOp: '>', hint: '58 is greater than 49!' },
    { id: 5, leftDisplay: '31', leftValue: 31, rightDisplay: '39', rightValue: 39, correctOp: '<', hint: '39 is greater than 31!' }
  ],
  // Level 4: Simple Addition Comparison (e.g. 5 + 3 vs 9)
  4: [
    { id: 1, leftDisplay: '5 + 3', leftValue: 8, rightDisplay: '9', rightValue: 9, correctOp: '<', hint: '5 + 3 is 8. 9 is greater than 8!' },
    { id: 2, leftDisplay: '7 + 4', leftValue: 11, rightDisplay: '10', rightValue: 10, correctOp: '>', hint: '7 + 4 is 11. 11 is bigger than 10!' },
    { id: 3, leftDisplay: '6 + 6', leftValue: 12, rightDisplay: '12', rightValue: 12, correctOp: '=', hint: '6 + 6 is 12! Both sides are equal!' },
    { id: 4, leftDisplay: '8 + 5', leftValue: 13, rightDisplay: '15', rightValue: 15, correctOp: '<', hint: '8 + 5 is 13. 15 is heavier!' },
    { id: 5, leftDisplay: '10 + 8', leftValue: 18, rightDisplay: '16', rightValue: 16, correctOp: '>', hint: '10 + 8 is 18. 18 is greater than 16!' }
  ],
  // Level 5: Double Expression Balance
  5: [
    { id: 1, leftDisplay: '7 + 3', leftValue: 10, rightDisplay: '6 + 4', rightValue: 10, correctOp: '=', hint: 'Both sides equal 10! The dragon is balanced!' },
    { id: 2, leftDisplay: '8 + 4', leftValue: 12, rightDisplay: '5 + 9', rightValue: 14, correctOp: '<', hint: '12 on left vs 14 on right! Right is greater!' },
    { id: 3, leftDisplay: '9 + 6', leftValue: 15, rightDisplay: '8 + 5', rightValue: 13, correctOp: '>', hint: '15 is greater than 13!' },
    { id: 4, leftDisplay: '12 + 8', leftValue: 20, rightDisplay: '11 + 9', rightValue: 20, correctOp: '=', hint: '20 equals 20! Perfect match!' },
    { id: 5, leftDisplay: '15 + 7', leftValue: 22, rightDisplay: '10 + 10', rightValue: 20, correctOp: '>', hint: '22 is greater than 20!' }
  ]
};

export const GreaterDragonScalesGame: React.FC<GreaterDragonScalesGameProps> = ({
  currentLevel,
  onCorrect,
  onIncorrect
}) => {
  const questions = QUESTIONS_BY_LEVEL[currentLevel] || QUESTIONS_BY_LEVEL[1];
  const [questionIndex, setQuestionIndex] = useState(0);
  const q = questions[questionIndex % questions.length];

  const [selectedOp, setSelectedOp] = useState<'<' | '=' | '>' | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [dragonMouth, setDragonMouth] = useState<'neutral' | 'left' | 'right' | 'equal'>('neutral');

  // Reset when level or question changes
  useEffect(() => {
    setSelectedOp(null);
    setFeedbackState('idle');
    setDragonMouth('neutral');
  }, [currentLevel, questionIndex]);

  // Calculate tilt angle for the physical scale beam:
  // If answered correctly: tilts towards heavier side!
  // If idle: stays level or slight gentle float
  let beamRotation = 0;
  if (selectedOp !== null) {
    if (q.leftValue > q.rightValue) beamRotation = -12; // left pan goes down
    else if (q.leftValue < q.rightValue) beamRotation = 12; // right pan goes down
    else beamRotation = 0;
  }

  const handleSelectOp = (op: '<' | '=' | '>') => {
    soundEngine.playPop();
    setSelectedOp(op);

    if (op === '>') setDragonMouth('left');
    else if (op === '<') setDragonMouth('right');
    else setDragonMouth('equal');

    if (op === q.correctOp) {
      setFeedbackState('correct');
      soundEngine.playVictory();
      try {
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      } catch {}

      setTimeout(() => {
        onCorrect(120);
        setQuestionIndex(prev => prev + 1);
      }, 1400);
    } else {
      setFeedbackState('wrong');
      soundEngine.playError();
      onIncorrect(q.hint);
      setTimeout(() => {
        setSelectedOp(null);
        setFeedbackState('idle');
        setDragonMouth('neutral');
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-amber-900/30 via-slate-900/50 to-orange-950/40 border-4 border-amber-400/40 shadow-2xl font-body select-none">
      
      {/* Level Header Bar */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-2 bg-slate-900/90 p-3 rounded-2xl border border-amber-400/30">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce">🐲</span>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block font-fun">
              Dragon Scales • Level {currentLevel} of 5
            </span>
            <h2 className="text-sm sm:text-base font-black text-white font-fun">
              Help Ignis the Dragon Compare & Balance the Scales!
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs text-amber-300 font-black font-fun">
            Round {questionIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Main Interactive Dragon & Balance Scale Stage */}
      <div className="w-full flex flex-col items-center bg-slate-950/90 p-4 sm:p-6 rounded-3xl border-4 border-amber-400/40 shadow-2xl relative overflow-hidden my-2 min-h-[360px]">
        
        {/* Animated Dragon Mascot at Center Top */}
        <motion.div
          animate={dragonMouth === 'neutral' ? { y: [0, -4, 0] } : { scale: [1, 1.12, 1] }}
          transition={{ repeat: dragonMouth === 'neutral' ? Infinity : 0, duration: 2.5 }}
          className="relative flex flex-col items-center z-20 mb-1"
        >
          {/* Dragon Face & Expression */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-emerald-400 to-green-600 border-4 border-amber-300 shadow-xl flex items-center justify-center ring-4 ring-emerald-500/30">
            {/* Dragon Horns */}
            <span className="absolute -top-3 left-2 text-xl -rotate-12">🔱</span>
            <span className="absolute -top-3 right-2 text-xl rotate-12">🔱</span>
            
            {/* Dragon Expression depending on comparison */}
            <div className="text-4xl sm:text-5xl flex items-center justify-center">
              {dragonMouth === 'neutral' && '🐲'}
              {dragonMouth === 'left' && '😋'}
              {dragonMouth === 'right' && '😋'}
              {dragonMouth === 'equal' && '🥳'}
            </div>

            {/* Chomp Direction Indicator Ribbon */}
            {dragonMouth === 'left' && (
              <span className="absolute -left-6 top-6 text-xl animate-bounce">👈🔥</span>
            )}
            {dragonMouth === 'right' && (
              <span className="absolute -right-6 top-6 text-xl animate-bounce">🔥👉</span>
            )}
          </div>
          <span className="text-[11px] font-black uppercase text-amber-300 font-fun mt-1 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow">
            {dragonMouth === 'left' ? 'Dragon Chomps Left!' : dragonMouth === 'right' ? 'Dragon Chomps Right!' : dragonMouth === 'equal' ? 'Balanced & Equal!' : 'Hungry Dragon Scale'}
          </span>
        </motion.div>

        {/* Balancing Beam with Pivot Fulcrum */}
        <div className="relative w-full max-w-lg flex flex-col items-center mt-2">
          
          {/* Scale Pivot Triangle Base */}
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] border-b-amber-500 shadow-md z-10" />

          {/* Dynamic Tilting Beam */}
          <motion.div
            animate={{ rotate: beamRotation }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="w-full h-4 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full border-2 border-amber-800 shadow-lg relative flex items-center justify-between -mt-9 px-4 z-15"
          >
            {/* Left Pan Hanging Rod */}
            <div className="w-1.5 h-16 bg-amber-400 border border-amber-700 absolute left-8 top-3 flex flex-col items-center justify-end">
              {/* Left Scale Pan Basket */}
              <div className="w-28 sm:w-32 p-3 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 border-3 border-cyan-400 rounded-2xl shadow-xl flex flex-col items-center translate-y-full -mt-2">
                <span className="text-2xl sm:text-3xl font-black font-fun text-cyan-300 drop-shadow">
                  {q.leftDisplay}
                </span>
                {/* Visual Coin Counters for Level 1 */}
                {currentLevel === 1 && (
                  <div className="flex flex-wrap gap-0.5 justify-center mt-1 max-w-[90px]">
                    {Array.from({ length: q.leftValue }).map((_, i) => (
                      <span key={i} className="text-xs">💎</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center Balance Emblem */}
            <div className="w-6 h-6 rounded-full bg-amber-300 border-2 border-amber-600 mx-auto flex items-center justify-center text-xs font-bold text-amber-950 shadow">
              ⚖️
            </div>

            {/* Right Pan Hanging Rod */}
            <div className="w-1.5 h-16 bg-amber-400 border border-amber-700 absolute right-8 top-3 flex flex-col items-center justify-end">
              {/* Right Scale Pan Basket */}
              <div className="w-28 sm:w-32 p-3 bg-gradient-to-b from-purple-950 via-slate-900 to-purple-900 border-3 border-fuchsia-400 rounded-2xl shadow-xl flex flex-col items-center translate-y-full -mt-2">
                <span className="text-2xl sm:text-3xl font-black font-fun text-fuchsia-300 drop-shadow">
                  {q.rightDisplay}
                </span>
                {/* Visual Coin Counters for Level 1 */}
                {currentLevel === 1 && (
                  <div className="flex flex-wrap gap-0.5 justify-center mt-1 max-w-[90px]">
                    {Array.from({ length: q.rightValue }).map((_, i) => (
                      <span key={i} className="text-xs">💎</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Space Spacer for Hanging Baskets */}
        <div className="h-28" />

        {/* Center Operator Comparison Slot */}
        <div className="mt-4 flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl border-2 border-amber-400/50 shadow-inner">
          <span className="text-xl sm:text-2xl font-black text-cyan-300 font-fun">{q.leftDisplay}</span>
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 border-2 border-dashed border-amber-400 flex items-center justify-center text-3xl font-black text-amber-300 font-fun">
            {selectedOp || '?'}
          </div>
          <span className="text-xl sm:text-2xl font-black text-fuchsia-300 font-fun">{q.rightDisplay}</span>
        </div>
      </div>

      {/* Choice Buttons Bar with Big Friendly Symbols & Labels */}
      <div className="w-full flex flex-col items-center gap-2 mt-2">
        <span className="text-xs font-black uppercase text-amber-300 font-fun tracking-wider">
          Which symbol makes the dragon scale true? Tap one:
        </span>

        <div className="grid grid-cols-3 gap-3 w-full max-w-md">
          {/* Greater Than: Dragon eats Left */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectOp('>')}
            className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer ${
              selectedOp === '>'
                ? feedbackState === 'correct'
                  ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-300'
                  : 'bg-rose-500 border-white text-white ring-4 ring-rose-300'
                : 'bg-gradient-to-b from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 border-blue-300 text-white'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black font-fun leading-none">&gt;</span>
            <span className="text-[11px] font-black uppercase font-fun mt-1 text-blue-100">
              Left is Bigger
            </span>
          </motion.button>

          {/* Equal To: Both sides match */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectOp('=')}
            className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer ${
              selectedOp === '='
                ? feedbackState === 'correct'
                  ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-300'
                  : 'bg-rose-500 border-white text-white ring-4 ring-rose-300'
                : 'bg-gradient-to-b from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 border-amber-300 text-white'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black font-fun leading-none">=</span>
            <span className="text-[11px] font-black uppercase font-fun mt-1 text-amber-100">
              Balanced Equal
            </span>
          </motion.button>

          {/* Less Than: Dragon eats Right */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectOp('<')}
            className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer ${
              selectedOp === '<'
                ? feedbackState === 'correct'
                  ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-300'
                  : 'bg-rose-500 border-white text-white ring-4 ring-rose-300'
                : 'bg-gradient-to-b from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 border-purple-300 text-white'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black font-fun leading-none">&lt;</span>
            <span className="text-[11px] font-black uppercase font-fun mt-1 text-purple-100">
              Right is Bigger
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
