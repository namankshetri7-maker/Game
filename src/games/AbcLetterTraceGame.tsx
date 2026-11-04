import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  Eraser,
  PenTool,
  Lightbulb,
  Undo2,
  Palette,
  Check
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

interface AbcLetterTraceGameProps {
  currentLevel: 1 | 2 | 3 | 4 | 5;
  onCorrect: (points?: number) => void;
  onIncorrect: (hint?: string) => void;
}

interface LetterModel {
  char: string;
  word: string;
  emoji: string;
  phonics: string;
  strokes: Array<{
    strokeNum: number;
    description: string;
    start: { x: number; y: number };
    end: { x: number; y: number };
  }>;
  // Normalized 0-100 target checkpoints along the letter path
  checkpoints: Array<{ id: number; x: number; y: number }>;
}

const LETTERS_BY_LEVEL: Record<number, LetterModel[]> = {
  1: [
    {
      char: 'A',
      word: 'Apple',
      emoji: '🍎',
      phonics: 'A says ah!',
      strokes: [
        { strokeNum: 1, description: 'Slant down left', start: { x: 50, y: 16 }, end: { x: 20, y: 84 } },
        { strokeNum: 2, description: 'Slant down right', start: { x: 50, y: 16 }, end: { x: 80, y: 84 } },
        { strokeNum: 3, description: 'Across the middle', start: { x: 32, y: 56 }, end: { x: 68, y: 56 } }
      ],
      checkpoints: [
        { id: 1, x: 50, y: 18 },
        { id: 2, x: 35, y: 50 },
        { id: 3, x: 22, y: 82 },
        { id: 4, x: 65, y: 50 },
        { id: 5, x: 78, y: 82 },
        { id: 6, x: 50, y: 56 }
      ]
    },
    {
      char: 'B',
      word: 'Butterfly',
      emoji: '🦋',
      phonics: 'B says buh!',
      strokes: [
        { strokeNum: 1, description: 'Line straight down', start: { x: 30, y: 16 }, end: { x: 30, y: 84 } },
        { strokeNum: 2, description: 'Top round bump', start: { x: 30, y: 16 }, end: { x: 30, y: 50 } },
        { strokeNum: 3, description: 'Bottom round bump', start: { x: 30, y: 50 }, end: { x: 30, y: 84 } }
      ],
      checkpoints: [
        { id: 1, x: 30, y: 20 },
        { id: 2, x: 30, y: 50 },
        { id: 3, x: 30, y: 80 },
        { id: 4, x: 58, y: 32 },
        { id: 5, x: 64, y: 66 },
        { id: 6, x: 44, y: 50 }
      ]
    }
  ],
  2: [
    {
      char: 'C',
      word: 'Cat',
      emoji: '🐱',
      phonics: 'C says kuh!',
      strokes: [
        { strokeNum: 1, description: 'Curve around like a crescent', start: { x: 75, y: 25 }, end: { x: 75, y: 75 } }
      ],
      checkpoints: [
        { id: 1, x: 72, y: 25 },
        { id: 2, x: 45, y: 20 },
        { id: 3, x: 26, y: 50 },
        { id: 4, x: 45, y: 80 },
        { id: 5, x: 72, y: 75 }
      ]
    },
    {
      char: 'D',
      word: 'Dinosaur',
      emoji: '🦕',
      phonics: 'D says duh!',
      strokes: [
        { strokeNum: 1, description: 'Straight down', start: { x: 30, y: 16 }, end: { x: 30, y: 84 } },
        { strokeNum: 2, description: 'Big round tummy', start: { x: 30, y: 16 }, end: { x: 30, y: 84 } }
      ],
      checkpoints: [
        { id: 1, x: 30, y: 22 },
        { id: 2, x: 30, y: 50 },
        { id: 3, x: 30, y: 80 },
        { id: 4, x: 64, y: 32 },
        { id: 5, x: 70, y: 50 },
        { id: 6, x: 64, y: 72 }
      ]
    }
  ],
  3: [
    {
      char: 'E',
      word: 'Elephant',
      emoji: '🐘',
      phonics: 'E says eh!',
      strokes: [
        { strokeNum: 1, description: 'Straight down', start: { x: 28, y: 16 }, end: { x: 28, y: 84 } },
        { strokeNum: 2, description: 'Top line across', start: { x: 28, y: 18 }, end: { x: 72, y: 18 } },
        { strokeNum: 3, description: 'Middle line across', start: { x: 28, y: 50 }, end: { x: 64, y: 50 } },
        { strokeNum: 4, description: 'Bottom line across', start: { x: 28, y: 82 }, end: { x: 72, y: 82 } }
      ],
      checkpoints: [
        { id: 1, x: 28, y: 20 },
        { id: 2, x: 28, y: 50 },
        { id: 3, x: 28, y: 80 },
        { id: 4, x: 68, y: 18 },
        { id: 5, x: 60, y: 50 },
        { id: 6, x: 68, y: 82 }
      ]
    },
    {
      char: 'F',
      word: 'Frog',
      emoji: '🐸',
      phonics: 'F says fff!',
      strokes: [
        { strokeNum: 1, description: 'Straight down', start: { x: 28, y: 16 }, end: { x: 28, y: 84 } },
        { strokeNum: 2, description: 'Top branch', start: { x: 28, y: 18 }, end: { x: 72, y: 18 } },
        { strokeNum: 3, description: 'Middle branch', start: { x: 28, y: 50 }, end: { x: 64, y: 50 } }
      ],
      checkpoints: [
        { id: 1, x: 28, y: 20 },
        { id: 2, x: 28, y: 50 },
        { id: 3, x: 28, y: 80 },
        { id: 4, x: 68, y: 18 },
        { id: 5, x: 58, y: 50 }
      ]
    }
  ],
  4: [
    {
      char: 'M',
      word: 'Monkey',
      emoji: '🐒',
      phonics: 'M says mmm!',
      strokes: [
        { strokeNum: 1, description: 'Up on the left', start: { x: 20, y: 84 }, end: { x: 20, y: 16 } },
        { strokeNum: 2, description: 'Slant down to middle', start: { x: 20, y: 16 }, end: { x: 50, y: 60 } },
        { strokeNum: 3, description: 'Slant up to right', start: { x: 50, y: 60 }, end: { x: 80, y: 16 } },
        { strokeNum: 4, description: 'Down on the right', start: { x: 80, y: 16 }, end: { x: 80, y: 84 } }
      ],
      checkpoints: [
        { id: 1, x: 20, y: 80 },
        { id: 2, x: 20, y: 22 },
        { id: 3, x: 50, y: 58 },
        { id: 4, x: 80, y: 22 },
        { id: 5, x: 80, y: 80 }
      ]
    },
    {
      char: 'S',
      word: 'Sun',
      emoji: '☀️',
      phonics: 'S says sss!',
      strokes: [
        { strokeNum: 1, description: 'Snake curve', start: { x: 72, y: 25 }, end: { x: 28, y: 75 } }
      ],
      checkpoints: [
        { id: 1, x: 70, y: 25 },
        { id: 2, x: 45, y: 18 },
        { id: 3, x: 30, y: 35 },
        { id: 4, x: 50, y: 50 },
        { id: 5, x: 70, y: 65 },
        { id: 6, x: 52, y: 82 },
        { id: 7, x: 28, y: 75 }
      ]
    }
  ],
  5: [
    {
      char: 'W',
      word: 'Wonder',
      emoji: '🌟',
      phonics: 'W says wuh!',
      strokes: [
        { strokeNum: 1, description: 'Down, up, down, up peaks', start: { x: 18, y: 18 }, end: { x: 82, y: 18 } }
      ],
      checkpoints: [
        { id: 1, x: 20, y: 20 },
        { id: 2, x: 34, y: 80 },
        { id: 3, x: 50, y: 38 },
        { id: 4, x: 66, y: 80 },
        { id: 5, x: 80, y: 20 }
      ]
    },
    {
      char: 'Z',
      word: 'Zebra',
      emoji: '🦓',
      phonics: 'Z says zzz!',
      strokes: [
        { strokeNum: 1, description: 'Top across', start: { x: 24, y: 20 }, end: { x: 76, y: 20 } },
        { strokeNum: 2, description: 'Zigzag diagonal', start: { x: 76, y: 20 }, end: { x: 24, y: 80 } },
        { strokeNum: 3, description: 'Bottom across', start: { x: 24, y: 80 }, end: { x: 76, y: 80 } }
      ],
      checkpoints: [
        { id: 1, x: 26, y: 20 },
        { id: 2, x: 74, y: 20 },
        { id: 3, x: 50, y: 50 },
        { id: 4, x: 26, y: 80 },
        { id: 5, x: 74, y: 80 }
      ]
    }
  ]
};

const BRUSH_COLORS = [
  { id: 'rainbow', name: 'Rainbow ✨', color: '#EC4899', isRainbow: true },
  { id: 'gold', name: 'Gold 🌟', color: '#F59E0B' },
  { id: 'pink', name: 'Pink 💖', color: '#EC4899' },
  { id: 'blue', name: 'Ocean 🌊', color: '#3B82F6' },
  { id: 'green', name: 'Lime 🍀', color: '#10B981' },
  { id: 'purple', name: 'Magic 💜', color: '#8B5CF6' }
];

export const AbcLetterTraceGame: React.FC<AbcLetterTraceGameProps> = ({
  currentLevel,
  onCorrect,
  onIncorrect
}) => {
  const letters = LETTERS_BY_LEVEL[currentLevel] || LETTERS_BY_LEVEL[1];
  const [letterIndex, setLetterIndex] = useState(0);
  const currentLetter = letters[letterIndex % letters.length];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(BRUSH_COLORS[0]);
  const [brushWidth, setBrushWidth] = useState<number>(14);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');
  const [clearedCount, setClearedCount] = useState(0);

  // Checkpoints traced by kid's finger/pen
  const [tracedCheckpoints, setTracedCheckpoints] = useState<number[]>([]);
  const [rainbowHue, setRainbowHue] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // History of strokes for Undo
  const strokeHistoryRef = useRef<ImageData[]>([]);
  // Last pointer point for smooth quadratic curve interpolation
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Reset drawing state when letter changes
  useEffect(() => {
    setTracedCheckpoints([]);
    setHasCompleted(false);
    strokeHistoryRef.current = [];
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [currentLetter, clearedCount]);

  // Audio pronunciation
  const playLetterSound = useCallback(() => {
    soundEngine.playLetterTone(currentLetter.char);
    if ('speechSynthesis' in window && !soundEngine.getMuted()) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `${currentLetter.char}! ${currentLetter.word}!`
        );
        utterance.rate = 0.9;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback tone already played
      }
    }
  }, [currentLetter]);

  // Handle pointer down (mouse or finger touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture pointer for smooth drawing across borders
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current canvas state before new stroke for undo
    try {
      strokeHistoryRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (strokeHistoryRef.current.length > 10) strokeHistoryRef.current.shift();
    } catch {}

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushWidth;

    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      const strokeCol = selectedColor.isRainbow
        ? `hsl(${rainbowHue}, 90%, 55%)`
        : selectedColor.color;
      ctx.strokeStyle = strokeCol;
      ctx.fillStyle = strokeCol;
    }

    // Draw initial contact dot
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, brushWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
    lastPointRef.current = { x: canvasX, y: canvasY };
    setIsDrawing(true);

    checkCheckpointHit(canvasX, canvasY, canvas.width, canvas.height);
  };

  // Handle pointer move with smooth Bezier/quadratic midpoint smoothing
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushWidth;

    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      if (selectedColor.isRainbow) {
        ctx.strokeStyle = `hsl(${rainbowHue}, 90%, 55%)`;
        setRainbowHue(prev => (prev + 5) % 360);
      } else {
        ctx.strokeStyle = selectedColor.color;
      }
    }

    if (lastPointRef.current) {
      // Quadratic midpoint interpolation makes lines look like smooth fluid ink
      const midX = (lastPointRef.current.x + canvasX) / 2;
      const midY = (lastPointRef.current.y + canvasY) / 2;
      ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(midX, midY);
    } else {
      ctx.lineTo(canvasX, canvasY);
      ctx.stroke();
    }

    lastPointRef.current = { x: canvasX, y: canvasY };
    checkCheckpointHit(canvasX, canvasY, canvas.width, canvas.height);
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    }
    lastPointRef.current = null;
    setIsDrawing(false);

    // Check if letter tracing meets goal threshold
    evaluateCompletion();
  };

  // Check if stroke point covers any checkpoint (within hit radius)
  const checkCheckpointHit = (px: number, py: number, width: number, height: number) => {
    if (activeTool === 'eraser') return;

    const normX = (px / width) * 100;
    const normY = (py / height) * 100;

    currentLetter.checkpoints.forEach(cp => {
      const dist = Math.hypot(normX - cp.x, normY - cp.y);
      // Generous 18% radius for young children and touchscreen precision
      if (dist < 18) {
        setTracedCheckpoints(prev => {
          if (!prev.includes(cp.id)) {
            soundEngine.playPop();
            return [...prev, cp.id];
          }
          return prev;
        });
      }
    });
  };

  // Evaluate letter tracing completion
  const evaluateCompletion = () => {
    if (hasCompleted) return;

    const total = currentLetter.checkpoints.length;
    const covered = tracedCheckpoints.length;

    // Generous 70% threshold so toddlers and young kids don't get frustrated
    if (covered >= Math.ceil(total * 0.7)) {
      setHasCompleted(true);
      soundEngine.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setTimeout(() => {
        onCorrect(120);
        setLetterIndex(prev => prev + 1);
      }, 1200);
    }
  };

  // Manual Check Button
  const handleDoneCheck = () => {
    const total = currentLetter.checkpoints.length;
    const covered = tracedCheckpoints.length;
    if (covered >= Math.ceil(total * 0.6)) {
      setHasCompleted(true);
      soundEngine.playVictory();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => {
        onCorrect(120);
        setLetterIndex(prev => prev + 1);
      }, 1000);
    } else {
      soundEngine.playOops();
      onIncorrect(`Trace the dotted lines from top to bottom to form letter '${currentLetter.char}'!`);
    }
  };

  const handleUndo = () => {
    soundEngine.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = strokeHistoryRef.current.pop();
    if (lastState) {
      ctx.putImageData(lastState, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClear = () => {
    soundEngine.playPop();
    setClearedCount(prev => prev + 1);
  };

  const totalCheckpoints = currentLetter.checkpoints.length;
  const progressPercent = Math.min(100, Math.round((tracedCheckpoints.length / totalCheckpoints) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-indigo-900/30 via-slate-900/50 to-pink-950/40 border-4 border-indigo-400/40 shadow-2xl font-body select-none">
      
      {/* Top Level Bar */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-3 bg-slate-900/90 p-3 rounded-2xl border border-indigo-400/30">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce">{currentLetter.emoji}</span>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block font-fun">
              Letter Tracing • Level {currentLevel} of 5
            </span>
            <h2 className="text-sm sm:text-base font-black text-white font-fun flex items-center gap-1.5">
              <span>Trace Letter</span>
              <span className="text-xl text-amber-400 font-black">'{currentLetter.char}'</span>
              <span className="text-xs text-indigo-300 font-bold">for {currentLetter.word}</span>
            </h2>
          </div>
        </div>

        {/* Audio Clue & Level Progress */}
        <div className="flex items-center gap-2">
          <button
            onClick={playLetterSound}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-fun flex items-center gap-1 shadow-md active:scale-95 transition"
            title="Hear Letter Pronunciation"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Phonics Sound</span>
          </button>

          <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-xs font-black font-fun text-indigo-200">
            Traced: {progressPercent}%
          </span>
        </div>
      </div>

      {/* Main Drawing Stage Split View */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch mb-3">
        
        {/* CENTER/LEFT: Interactive Letter Canvas */}
        <div className="md:col-span-2 relative flex flex-col items-center justify-center bg-slate-950/90 p-3 sm:p-5 rounded-3xl border-4 border-indigo-400/50 shadow-2xl overflow-hidden min-h-[340px]">
          
          {/* Background Dotted Letter Watermark Guide */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* Soft Dotted Letter SVG Template */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              viewBox="0 0 100 100"
            >
              {/* Dotted Stroke Guide Arrows & Paths */}
              {currentLetter.strokes.map((st, idx) => (
                <g key={idx}>
                  <line
                    x1={st.start.x}
                    y1={st.start.y}
                    x2={st.end.x}
                    y2={st.end.y}
                    stroke="#818CF8"
                    strokeWidth="12"
                    strokeDasharray="2 6"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  {/* Start Point Dot */}
                  <circle
                    cx={st.start.x}
                    cy={st.start.y}
                    r="3.5"
                    fill="#FDE047"
                    stroke="#1E1B4B"
                    strokeWidth="1.5"
                  />
                  {/* Number Badge at Stroke Start */}
                  <text
                    x={st.start.x + (st.start.x > 50 ? 5 : -5)}
                    y={st.start.y}
                    fill="#FDE047"
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor={st.start.x > 50 ? 'start' : 'end'}
                    alignmentBaseline="middle"
                  >
                    #{st.strokeNum}
                  </text>
                </g>
              ))}

              {/* Checkpoint Target Stars */}
              {currentLetter.checkpoints.map(cp => {
                const isHit = tracedCheckpoints.includes(cp.id);
                return (
                  <circle
                    key={cp.id}
                    cx={cp.x}
                    cy={cp.y}
                    r={isHit ? 4 : 3}
                    fill={isHit ? '#10B981' : '#FCD34D'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className={isHit ? 'animate-pulse' : 'opacity-70'}
                  />
                );
              })}
            </svg>

            {/* Giant Faint Letter Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[170px] sm:text-[200px] font-black font-fun text-indigo-300/10 leading-none">
                {currentLetter.char}
              </span>
            </div>

            {/* Active Drawing Canvas (Finger / Stylus / Mouse) */}
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none rounded-2xl z-10"
              style={{ touchAction: 'none' }}
            />
          </div>

          <p className="text-[11px] text-indigo-300 font-fun font-bold mt-2 text-center">
            ✍️ Use your finger or mouse to draw along the dotted line from #1 ➔ #2!
          </p>
        </div>

        {/* RIGHT PANEL: Color Inks & Tool Controls */}
        <div className="flex flex-col justify-between bg-slate-900/90 p-4 rounded-3xl border-2 border-indigo-400/30 shadow-xl gap-3">
          
          {/* Tool Modes: Pen vs Eraser */}
          <div>
            <span className="text-[11px] font-black uppercase text-indigo-300 tracking-wider block font-fun mb-2">
              Drawing Tool:
            </span>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => { soundEngine.playPop(); setActiveTool('pen'); }}
                className={`py-2 px-3 rounded-xl text-xs font-black font-fun flex items-center justify-center gap-1.5 transition ${
                  activeTool === 'pen' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Draw Pen</span>
              </button>
              <button
                onClick={() => { soundEngine.playPop(); setActiveTool('eraser'); }}
                className={`py-2 px-3 rounded-xl text-xs font-black font-fun flex items-center justify-center gap-1.5 transition ${
                  activeTool === 'eraser' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eraser className="w-4 h-4" />
                <span>Eraser</span>
              </button>
            </div>
          </div>

          {/* Color Palette Choices */}
          <div>
            <span className="text-[11px] font-black uppercase text-indigo-300 tracking-wider block font-fun mb-2">
              Glitter Ink Colors:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {BRUSH_COLORS.map(c => {
                const isSelected = selectedColor.id === c.id && activeTool === 'pen';

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      soundEngine.playPop();
                      setSelectedColor(c);
                      setActiveTool('pen');
                    }}
                    className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-indigo-950 border-amber-400 ring-2 ring-amber-300 scale-105 shadow-md'
                        : 'bg-slate-950/80 border-slate-800 hover:border-indigo-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-white/80 shadow ${
                        c.isRainbow ? 'bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500' : ''
                      }`}
                      style={{ backgroundColor: c.isRainbow ? undefined : c.color }}
                    />
                    <span className="text-[10px] font-bold text-white font-fun text-center leading-none">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brush Thickness Selector */}
          <div>
            <span className="text-[11px] font-black uppercase text-indigo-300 tracking-wider block font-fun mb-1.5">
              Pen Size:
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              {[
                { label: 'Normal', width: 10 },
                { label: 'Chonky', width: 16 },
                { label: 'Jumbo', width: 24 }
              ].map(w => (
                <button
                  key={w.width}
                  onClick={() => { soundEngine.playPop(); setBrushWidth(w.width); }}
                  className={`py-1.5 rounded-xl text-xs font-black font-fun transition ${
                    brushWidth === w.width ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Undo, Clear, Check */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleUndo}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-fun flex items-center justify-center shadow transition active:scale-95 flex-1"
              title="Undo last stroke"
            >
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </button>
            <button
              onClick={handleClear}
              className="p-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 text-xs font-bold font-fun flex items-center justify-center shadow transition active:scale-95 flex-1"
              title="Clear canvas"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>

          <button
            onClick={handleDoneCheck}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 hover:brightness-105 active:scale-95 text-slate-950 font-black font-fun text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>Check My Tracing!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
