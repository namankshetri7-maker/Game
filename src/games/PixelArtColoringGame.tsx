import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Wand2, Eraser, Lightbulb, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PixelArtColoringGameProps {
  currentLevel: 1 | 2 | 3 | 4 | 5;
  onCorrect: (points?: number) => void;
  onIncorrect: (hint?: string) => void;
}

interface PixelTemplate {
  name: string;
  icon: string;
  gridSize: number;
  palette: Array<{ num: number; color: string; label: string }>;
  // 2D Array of color numbers (0 = transparent/white background)
  matrix: number[][];
}

// 5 Difficulty Tiers of Pixel Art Templates
const PIXEL_TEMPLATES: Record<number, PixelTemplate> = {
  1: {
    name: 'Red Heart of Wonder',
    icon: '💖',
    gridSize: 5,
    palette: [
      { num: 1, color: '#EF4444', label: 'Crimson Red' },
      { num: 2, color: '#F472B6', label: 'Rose Pink' },
      { num: 3, color: '#FFFFFF', label: 'White Shine' }
    ],
    matrix: [
      [0, 1, 0, 1, 0],
      [1, 2, 1, 2, 1],
      [1, 3, 2, 2, 1],
      [0, 1, 2, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  2: {
    name: 'Sunny Golden Star',
    icon: '⭐',
    gridSize: 6,
    palette: [
      { num: 1, color: '#F59E0B', label: 'Golden Amber' },
      { num: 2, color: '#FDE047', label: 'Bright Yellow' },
      { num: 3, color: '#EA580C', label: 'Orange Outline' }
    ],
    matrix: [
      [0, 0, 3, 3, 0, 0],
      [0, 3, 2, 2, 3, 0],
      [3, 1, 2, 2, 1, 3],
      [0, 3, 2, 2, 3, 0],
      [0, 3, 1, 1, 3, 0],
      [3, 1, 0, 0, 1, 3]
    ]
  },
  3: {
    name: 'Friendly Space Rocket',
    icon: '🚀',
    gridSize: 7,
    palette: [
      { num: 1, color: '#3B82F6', label: 'Sky Blue' },
      { num: 2, color: '#EF4444', label: 'Rocket Red' },
      { num: 3, color: '#F59E0B', label: 'Flame Gold' },
      { num: 4, color: '#06B6D4', label: 'Window Cyan' }
    ],
    matrix: [
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 2, 1, 2, 0, 0],
      [0, 0, 1, 4, 1, 0, 0],
      [0, 2, 1, 1, 1, 2, 0],
      [0, 2, 1, 1, 1, 2, 0],
      [0, 0, 2, 2, 2, 0, 0],
      [0, 0, 3, 3, 3, 0, 0]
    ]
  },
  4: {
    name: 'Little Dino Explorer',
    icon: '🦕',
    gridSize: 8,
    palette: [
      { num: 1, color: '#10B981', label: 'Emerald Green' },
      { num: 2, color: '#A7F3D0', label: 'Mint Belly' },
      { num: 3, color: '#F59E0B', label: 'Golden Spikes' },
      { num: 4, color: '#1E293B', label: 'Eye Black' }
    ],
    matrix: [
      [0, 0, 0, 1, 1, 1, 3, 0],
      [0, 0, 1, 4, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [3, 0, 1, 2, 2, 1, 0, 0],
      [3, 1, 1, 2, 2, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0]
    ]
  },
  5: {
    name: 'Wonder Castle Kingdom',
    icon: '🏰',
    gridSize: 8,
    palette: [
      { num: 1, color: '#8B5CF6', label: 'Royal Purple' },
      { num: 2, color: '#F59E0B', label: 'Golden Roof' },
      { num: 3, color: '#EC4899', label: 'Pink Flags' },
      { num: 4, color: '#71717A', label: 'Stone Gray' },
      { num: 5, color: '#38BDF8', label: 'Sky Water' }
    ],
    matrix: [
      [3, 0, 0, 3, 0, 0, 3, 0],
      [2, 0, 0, 2, 0, 0, 2, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 4, 1, 1, 4, 1, 1],
      [4, 4, 4, 4, 4, 4, 4, 4],
      [4, 1, 4, 2, 2, 4, 1, 4],
      [4, 1, 4, 2, 2, 4, 1, 4],
      [5, 5, 5, 5, 5, 5, 5, 5]
    ]
  }
};

export const PixelArtColoringGame: React.FC<PixelArtColoringGameProps> = ({
  currentLevel,
  onCorrect,
  onIncorrect
}) => {
  const template = PIXEL_TEMPLATES[currentLevel] || PIXEL_TEMPLATES[1];
  const [selectedColorNum, setSelectedColorNum] = useState<number>(1);
  const [paintedGrid, setPaintedGrid] = useState<Record<string, number>>({});
  const [activeTool, setActiveTool] = useState<'brush' | 'bucket' | 'eraser'>('brush');

  // Reset grid when level changes
  useEffect(() => {
    setSelectedColorNum(1);
    setPaintedGrid({});
    setActiveTool('brush');
  }, [currentLevel, template]);

  // Count target colorable cells (cells with matrix[r][c] > 0)
  let totalTargetCells = 0;
  for (let r = 0; r < template.gridSize; r++) {
    for (let c = 0; c < template.gridSize; c++) {
      if (template.matrix[r][c] > 0) totalTargetCells++;
    }
  }

  // Count correctly painted cells
  let correctPaintedCount = 0;
  for (let r = 0; r < template.gridSize; r++) {
    for (let c = 0; c < template.gridSize; c++) {
      const key = `${r}_${c}`;
      const targetColor = template.matrix[r][c];
      if (targetColor > 0 && paintedGrid[key] === targetColor) {
        correctPaintedCount++;
      }
    }
  }

  const isCompleted = correctPaintedCount === totalTargetCells && totalTargetCells > 0;

  const handleCellClick = (r: number, c: number) => {
    const key = `${r}_${c}`;
    const targetColorNum = template.matrix[r][c];

    // Background tile (0) cannot be colored
    if (targetColorNum === 0) {
      soundEngine.playPop();
      return;
    }

    if (activeTool === 'eraser') {
      soundEngine.playPop();
      const updated = { ...paintedGrid };
      delete updated[key];
      setPaintedGrid(updated);
      return;
    }

    if (activeTool === 'bucket') {
      // Magic fill all matching cells of selectedColorNum
      soundEngine.playStar();
      const updated = { ...paintedGrid };
      for (let i = 0; i < template.gridSize; i++) {
        for (let j = 0; j < template.gridSize; j++) {
          if (template.matrix[i][j] === selectedColorNum) {
            updated[`${i}_${j}`] = selectedColorNum;
          }
        }
      }
      setPaintedGrid(updated);
      checkCompletion(updated);
      return;
    }

    // Brush Tool
    if (selectedColorNum === targetColorNum) {
      soundEngine.playPop();
      const updated = { ...paintedGrid, [key]: selectedColorNum };
      setPaintedGrid(updated);
      checkCompletion(updated);
    } else {
      soundEngine.playError();
      const rightColor = template.palette.find(p => p.num === targetColorNum);
      onIncorrect(`That tile needs Color #${targetColorNum} (${rightColor?.label})!`);
    }
  };

  const checkCompletion = (grid: Record<string, number>) => {
    let matches = 0;
    for (let r = 0; r < template.gridSize; r++) {
      for (let c = 0; c < template.gridSize; c++) {
        const key = `${r}_${c}`;
        const targetColor = template.matrix[r][c];
        if (targetColor > 0 && grid[key] === targetColor) {
          matches++;
        }
      }
    }

    if (matches === totalTargetCells) {
      soundEngine.playCelebration();
      onCorrect(150 + matches * 10);
    }
  };

  const handleRevealHint = () => {
    soundEngine.playStar();
    // Auto fill next unpainted cell of selected color
    const updated = { ...paintedGrid };
    for (let r = 0; r < template.gridSize; r++) {
      for (let c = 0; c < template.gridSize; c++) {
        const key = `${r}_${c}`;
        if (template.matrix[r][c] === selectedColorNum && updated[key] !== selectedColorNum) {
          updated[key] = selectedColorNum;
          setPaintedGrid(updated);
          checkCompletion(updated);
          return;
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-purple-900/30 via-slate-900/50 to-pink-950/40 border-4 border-purple-300/40 shadow-2xl font-body select-none">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-3 bg-slate-900/90 p-3 rounded-2xl border border-purple-400/30">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce">{template.icon}</span>
          <div>
            <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider block font-fun">
              Pixel Color-by-Number • Level {currentLevel} of 5
            </span>
            <h2 className="text-sm sm:text-base font-black text-white font-fun">
              {template.name}
            </h2>
          </div>
        </div>

        {/* Progress & Tools */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-xs text-purple-200 font-black font-fun">
            {correctPaintedCount} / {totalTargetCells} Tiles
          </span>

          <button
            onClick={handleRevealHint}
            className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition"
            title="Reveal Hint"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Hint</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setPaintedGrid({});
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Palette Split View */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
        
        {/* CENTER/LEFT: Pixel Art Canvas */}
        <div className="md:col-span-2 flex flex-col items-center justify-center bg-slate-950/90 p-4 sm:p-6 rounded-3xl border-4 border-purple-400/40 shadow-2xl overflow-hidden min-h-[300px]">
          
          <div
            className="grid gap-1.5 p-2 bg-slate-900 rounded-2xl border-2 border-slate-700 shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${template.gridSize}, minmax(0, 1fr))`
            }}
          >
            {template.matrix.map((row, r) =>
              row.map((targetNum, c) => {
                const key = `${r}_${c}`;
                const paintedNum = paintedGrid[key];
                const isBg = targetNum === 0;
                const isCorrect = paintedNum === targetNum && targetNum > 0;
                const isSelectedColorTarget = targetNum === selectedColorNum && !isCorrect;

                const paletteItem = template.palette.find(p => p.num === targetNum);
                const paintedPaletteItem = template.palette.find(p => p.num === paintedNum);

                return (
                  <button
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    disabled={isBg}
                    style={{
                      backgroundColor: isCorrect
                        ? paletteItem?.color
                        : paintedNum
                        ? paintedPaletteItem?.color
                        : isBg
                        ? 'transparent'
                        : '#1E293B'
                    }}
                    className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-fun font-black text-xs sm:text-sm transition-all duration-150 relative ${
                      isBg
                        ? 'opacity-20 cursor-default'
                        : isCorrect
                        ? 'shadow-sm border-2 border-white/40 scale-100'
                        : isSelectedColorTarget
                        ? 'border-2 border-amber-400 ring-2 ring-amber-300/60 animate-pulse cursor-pointer hover:scale-105'
                        : 'border border-slate-700 hover:border-purple-400 cursor-pointer active:scale-95'
                    }`}
                  >
                    {!isCorrect && !isBg && (
                      <span className={`drop-shadow ${
                        isSelectedColorTarget ? 'text-amber-300 font-bold scale-110' : 'text-slate-400'
                      }`}>
                        {targetNum}
                      </span>
                    )}

                    {isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-[10px] opacity-80"
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Color Palette & Tool Selector */}
        <div className="flex flex-col justify-between bg-slate-900/90 p-4 rounded-3xl border-2 border-purple-400/30 shadow-xl gap-4">
          
          {/* Tool Selector */}
          <div>
            <span className="text-[11px] font-black uppercase text-purple-300 tracking-wider block font-fun mb-2">
              Select Painting Tool:
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => { soundEngine.playPop(); setActiveTool('brush'); }}
                className={`py-2 rounded-xl text-xs font-black font-fun flex items-center justify-center gap-1 transition ${
                  activeTool === 'brush' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🖌️ Brush
              </button>
              <button
                onClick={() => { soundEngine.playPop(); setActiveTool('bucket'); }}
                className={`py-2 rounded-xl text-xs font-black font-fun flex items-center justify-center gap-1 transition ${
                  activeTool === 'bucket' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🪄 Fill
              </button>
              <button
                onClick={() => { soundEngine.playPop(); setActiveTool('eraser'); }}
                className={`py-2 rounded-xl text-xs font-black font-fun flex items-center justify-center gap-1 transition ${
                  activeTool === 'eraser' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🧼 Eraser
              </button>
            </div>
          </div>

          {/* Color Palette List */}
          <div>
            <span className="text-[11px] font-black uppercase text-purple-300 tracking-wider block font-fun mb-2">
              Color Palette Numbers:
            </span>
            <div className="flex flex-col gap-2">
              {template.palette.map(p => {
                const isSelected = selectedColorNum === p.num;

                return (
                  <button
                    key={p.num}
                    onClick={() => {
                      soundEngine.playPop();
                      setSelectedColorNum(p.num);
                      if (activeTool === 'eraser') setActiveTool('brush');
                    }}
                    className={`p-2.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950 border-amber-400 ring-2 ring-amber-300 scale-102 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-xl border-2 border-white/60 shadow-md flex items-center justify-center font-black font-fun text-white text-xs"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.num}
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block leading-none font-fun">
                          #{p.num} {p.label}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-xs font-black text-amber-300 font-fun">Active ★</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
