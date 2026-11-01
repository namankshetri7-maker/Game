/**
 * Mini-Game 2: Word Builder Bee (World 2: English & Phonics Jungle)
 * Production-ready, 100% offline educational game for ages 3–10.
 *
 * Age Dynamic Difficulty:
 * - Easy (3–4): CVC words (CAT, SUN, BUG) with visual picture cues & letter outlines.
 * - Medium (5–7): 4-letter blends (FROG, STAR, BOAT) with phonics letter audio.
 * - Hard (8–10): Multi-letter vocabulary (PLANET, JUNGLE, BREEZE) with jumbled tiles.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pause, RotateCcw, Sparkles, Volume2, HelpCircle, Home, ArrowLeft } from 'lucide-react';
import { AgeGroup, DifficultyLevel, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface WordBuilderBeeProps {
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: number;
  onHome: () => void;
  onBackToWorld?: () => void;
  onNextGame: () => void;
}

interface PhonicsWord {
  word: string;
  emoji: string;
  clue: string;
}

export const WordBuilderBee: React.FC<WordBuilderBeeProps> = ({
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onBackToWorld,
  onNextGame
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    if (ageGroup === '3-4') return 'EASY';
    if (ageGroup === '5-7') return 'MEDIUM';
    return 'HARD';
  });
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(3);
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<Sticker | null>(null);
  const [showHint, setShowHint] = useState(ageGroup === '3-4' || difficulty === 'EASY');

  // Dynamic 3-tier dictionary across all 5 levels
  const getWordsForLevelAndDifficulty = (lvl: number, diff: DifficultyLevel): PhonicsWord[] => {
    if (diff === 'EASY') {
      // EASY: 3-letter CVC & simple 4-letter words with picture cues
      if (lvl === 1) {
        return [
          { word: 'CAT', emoji: '🐱', clue: 'Furry pet that says meow' },
          { word: 'SUN', emoji: '☀️', clue: 'Shines bright in the warm sky' },
          { word: 'BEE', emoji: '🐝', clue: 'Makes sweet honey in the hive' }
        ];
      } else if (lvl === 2) {
        return [
          { word: 'BUG', emoji: '🐛', clue: 'Little crawler on green leaves' },
          { word: 'PIG', emoji: '🐷', clue: 'Oinks cheerfully in the farm' },
          { word: 'FOX', emoji: '🦊', clue: 'Clever friend with an orange tail' }
        ];
      } else if (lvl === 3) {
        return [
          { word: 'FROG', emoji: '🐸', clue: 'Green hopper on lily pads' },
          { word: 'STAR', emoji: '⭐', clue: 'Twinkles in the night sky' },
          { word: 'DUCK', emoji: '🦆', clue: 'Swims in pond and says quack' }
        ];
      } else if (lvl === 4) {
        return [
          { word: 'FISH', emoji: '🐟', clue: 'Swims quickly in clear water' },
          { word: 'BOAT', emoji: '⛵', clue: 'Floats across the ocean waves' },
          { word: 'LION', emoji: '🦁', clue: 'Brave king of the savanna' }
        ];
      } else {
        // Level 5
        return [
          { word: 'TRAIN', emoji: '🚂', clue: 'Chug-chug rides down the track' },
          { word: 'WHALE', emoji: '🐋', clue: 'Giant friendly ocean swimmer' },
          { word: 'SHEEP', emoji: '🐑', clue: 'Fluffy farm friend says baa' }
        ];
      }
    } else if (diff === 'MEDIUM') {
      // MEDIUM: 4-6 letter phonics blends
      if (lvl === 1) {
        return [
          { word: 'FROG', emoji: '🐸', clue: 'Green hopper on lily pads' },
          { word: 'STAR', emoji: '⭐', clue: 'Twinkles in the night sky' },
          { word: 'BOAT', emoji: '⛵', clue: 'Floats on the ocean waves' }
        ];
      } else if (lvl === 2) {
        return [
          { word: 'TRAIN', emoji: '🚂', clue: 'Rides on the railroad tracks' },
          { word: 'WHALE', emoji: '🐋', clue: 'Giant gentle swimmer in the sea' },
          { word: 'SHEEP', emoji: '🐑', clue: 'Fluffy farm friend that says baa' }
        ];
      } else if (lvl === 3) {
        return [
          { word: 'JUNGLE', emoji: '🌴', clue: 'Dense rainforest filled with wildlife' },
          { word: 'PLANET', emoji: '🪐', clue: 'Orbits around a glowing star' },
          { word: 'FLOWER', emoji: '🌸', clue: 'Blooms with sweet nectar for bees' }
        ];
      } else if (lvl === 4) {
        return [
          { word: 'DOLPHIN', emoji: '🐬', clue: 'Smart ocean friend that loves to leap' },
          { word: 'GIRAFFE', emoji: '🦒', clue: 'Tallest animal reaching top tree branches' },
          { word: 'PENGUIN', emoji: '🐧', clue: 'Waddles and slides across snowy ice' }
        ];
      } else {
        // Level 5
        return [
          { word: 'RAINBOW', emoji: '🌈', clue: 'Colorful arc across the sky after rain' },
          { word: 'SUNSHINE', emoji: '☀️', clue: 'Golden warmth that brightens the day' },
          { word: 'BUTTERFLY', emoji: '🦋', clue: 'Fluttering wings painted with vivid colors' }
        ];
      }
    } else {
      // HARD: Advanced vocabulary, multi-syllable science & nature words
      if (lvl === 1) {
        return [
          { word: 'JUNGLE', emoji: '🌴', clue: 'Tropical rainforest habitat with exotic birds' },
          { word: 'PLANET', emoji: '🪐', clue: 'Celestial body in orbit around a star' },
          { word: 'FLOWER', emoji: '🌸', clue: 'Botanical blossom rich with pollen & nectar' }
        ];
      } else if (lvl === 2) {
        return [
          { word: 'DOLPHIN', emoji: '🐬', clue: 'Highly intelligent aquatic mammal' },
          { word: 'OCTOPUS', emoji: '🐙', clue: 'Eight-armed ocean explorer of the coral reefs' },
          { word: 'VOLCANO', emoji: '🌋', clue: 'Geological mountain that erupts hot molten lava' }
        ];
      } else if (lvl === 3) {
        return [
          { word: 'RAINBOW', emoji: '🌈', clue: 'Atmospheric spectrum created by light & raindrops' },
          { word: 'BUTTERFLY', emoji: '🦋', clue: 'Metamorphic creature that transforms from caterpillar' },
          { word: 'DINOSAUR', emoji: '🦖', clue: 'Magnificent prehistoric reptile of ancient Earth' }
        ];
      } else if (lvl === 4) {
        return [
          { word: 'ASTRONAUT', emoji: '👨‍🚀', clue: 'Intrepid space explorer beyond Earth atmosphere' },
          { word: 'TELESCOPE', emoji: '🔭', clue: 'Optical instrument for stargazing distant galaxies' },
          { word: 'SUBMARINE', emoji: '🚤', clue: 'Deep-diving submersible vessel in ocean depths' }
        ];
      } else {
        // Level 5
        return [
          { word: 'CONSTELLATION', emoji: '✨', clue: 'Pattern of brilliant stars forming sky legends' },
          { word: 'METEORITE', emoji: '☄️', clue: 'Space rock shooting across the night atmosphere' },
          { word: 'ECOSYSTEM', emoji: '🌿', clue: 'Interconnected community of living organisms' }
        ];
      }
    }
  };

  const [wordList, setWordList] = useState<PhonicsWord[]>(() =>
    getWordsForLevelAndDifficulty(currentLevel, difficulty)
  );

  useEffect(() => {
    setWordList(getWordsForLevelAndDifficulty(currentLevel, difficulty));
    setWordIndex(0);
  }, [currentLevel, difficulty]);

  const currentWordObj = wordList[wordIndex] || wordList[0];
  const targetWord = currentWordObj.word;

  // Honeycomb slots state
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; letter: string; isUsed: boolean }[]>([]);

  // Initialize honeycomb tiles with tier-appropriate distractors
  useEffect(() => {
    const letters = targetWord.split('');
    setPlacedLetters(new Array(letters.length).fill(null));

    const tiles = letters.map((l, i) => ({ id: `tile_${i}_${l}`, letter: l, isUsed: false }));

    // Distractor letters based on difficulty tier
    const distractorPool = ['R', 'S', 'T', 'L', 'N', 'A', 'E', 'M', 'P', 'B', 'D'];
    let numDistractors = 0;
    if (difficulty === 'EASY') {
      numDistractors = currentLevel >= 4 ? 1 : 0;
    } else if (difficulty === 'MEDIUM') {
      numDistractors = 2;
    } else {
      // HARD
      numDistractors = 4;
    }

    const availablePool = distractorPool.filter(l => !targetWord.includes(l));
    for (let d = 0; d < numDistractors; d++) {
      const distractorChar = availablePool[d % availablePool.length] || 'X';
      tiles.push({ id: `tile_distract_${d}_${distractorChar}`, letter: distractorChar, isUsed: false });
    }

    // Shuffle tiles
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
  }, [wordIndex, targetWord, difficulty, currentLevel]);

  // Handle letter slot drop or tap
  const handleSelectLetter = (tileId: string, letter: string) => {
    // Play letter tone
    soundEngine.playLetterTone(letter);

    // Find first empty slot
    const emptyIndex = placedLetters.findIndex(slot => slot === null);
    if (emptyIndex === -1) return;

    // Check if this matches expected letter for this slot position
    const expectedLetter = targetWord[emptyIndex];
    if (letter === expectedLetter) {
      soundEngine.playSnap();
      const updatedPlaced = [...placedLetters];
      updatedPlaced[emptyIndex] = letter;
      setPlacedLetters(updatedPlaced);

      setAvailableTiles(prev => prev.map(t => t.id === tileId ? { ...t, isUsed: true } : t));
      setScore(prev => prev + 50);

      // Check if word is completely spelled!
      if (updatedPlaced.every(slot => slot !== null)) {
        soundEngine.playSnap();
        setScore(prev => prev + 100);

        if (wordIndex < wordList.length - 1) {
          setTimeout(() => {
            setWordIndex(prev => prev + 1);
          }, 900);
        } else {
          // All words complete
          setTimeout(() => {
            const finalMistakes = mistakes;
            let calculatedStars = 3;
            if (finalMistakes === 1) calculatedStars = 2;
            else if (finalMistakes > 1) calculatedStars = 1;

            setStars(calculatedStars);
            setGameState('LEVEL_COMPLETE');
            soundEngine.playVictory();

            try {
              confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
            } catch {}

            const timeSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
            storageService.recordGameResult(
              activeProfileId,
              'game_word_builder_bee',
              'world_phonics',
              calculatedStars,
              score + 150,
              timeSec,
              true
            );

            const stickers = storageService.getUnlockedStickers(activeProfileId);
            if (stickers.length > 0) {
              setEarnedSticker(stickers[stickers.length - 1]);
            }
          }, 800);
        }
      }
    } else {
      // Gentle oops
      soundEngine.playOops();
      setMistakes(prev => prev + 1);
    }
  };

  const handleClearSlot = (index: number) => {
    const letter = placedLetters[index];
    if (!letter) return;
    soundEngine.playPop();

    const updated = [...placedLetters];
    updated[index] = null;
    setPlacedLetters(updated);

    // Unuse the tile
    const tileToRestore = availableTiles.find(t => t.letter === letter && t.isUsed);
    if (tileToRestore) {
      setAvailableTiles(prev => prev.map(t => t.id === tileToRestore.id ? { ...t, isUsed: false } : t));
    }
  };

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] bg-gradient-to-b from-amber-300 via-yellow-200 to-emerald-600 rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-amber-400 shadow-2xl">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onBackToWorld && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onBackToWorld();
              }}
              className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-amber-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-amber-300 active:scale-95 transition flex items-center gap-1.5"
              title="Return to Island Levels"
            >
              <ArrowLeft className="w-4 h-4 text-amber-700 stroke-[2.5]" />
              <span className="hidden sm:inline">Levels</span>
            </button>
          )}

          {/* Direct Home Map Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-amber-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-amber-300 active:scale-95 transition flex items-center gap-1.5"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPaused(true);
              setGameState('PAUSED');
            }}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-amber-900 rounded-2xl shadow-md active:scale-95 border-2 border-amber-300 transition"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full shadow-sm">
                Level {currentLevel} of 5
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-950 bg-white/60 px-2 py-0.5 rounded-full">
                Word {wordIndex + 1} of {wordList.length}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-amber-950 font-fun drop-shadow-sm">
              Word Builder Bee
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty Tier Selector (Easy / Medium / Hard) */}
          <div className="flex bg-black/20 p-1 rounded-2xl border border-white/20 backdrop-blur-sm">
            {(['EASY', 'MEDIUM', 'HARD'] as DifficultyLevel[]).map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  soundEngine.playPop();
                  setDifficulty(tier);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black font-fun transition active:scale-95 ${
                  difficulty === tier
                    ? tier === 'EASY'
                      ? 'bg-emerald-400 text-emerald-950 shadow-sm'
                      : tier === 'MEDIUM'
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : 'bg-rose-500 text-white shadow-sm'
                    : 'text-amber-950/80 hover:text-amber-950'
                }`}
              >
                {tier === 'EASY' ? '🌱 Easy' : tier === 'MEDIUM' ? '⚡ Med' : '🔥 Hard'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-md">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="text-base sm:text-lg font-black text-amber-950 font-fun">{score} pts</span>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-3 z-10">
        {/* Animated Worker Bee & Clue */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [-5, 5, -5]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center drop-shadow-xl"
          >
            <span className="text-6xl sm:text-7xl">🐝</span>
          </motion.div>

          {/* Picture Card */}
          <div className="bg-white/95 px-5 py-3 rounded-3xl border-3 border-amber-400 shadow-lg flex items-center gap-3">
            <span className="text-4xl sm:text-5xl">{currentWordObj.emoji}</span>
            <div>
              <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider block">
                {difficulty === 'HARD' ? 'Vocabulary Master' : 'Spell The Word'}
              </span>
              <p className="text-sm font-bold text-slate-800 font-body">{currentWordObj.clue}</p>
            </div>
          </div>
        </div>

        {/* Honeycomb Word Target Slots */}
        <div className="w-full max-w-xl bg-white/90 rounded-3xl p-5 shadow-xl border-4 border-amber-400 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
            {targetWord.split('').map((char, idx) => {
              const placed = placedLetters[idx];
              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClearSlot(idx)}
                    className={`w-12 h-14 sm:w-16 sm:h-20 flex items-center justify-center font-fun text-xl sm:text-3xl font-black rounded-2xl border-4 transition-all shadow-md ${
                      placed
                        ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-amber-400/50'
                        : 'bg-amber-50 border-dashed border-amber-400 text-amber-300'
                    }`}
                  >
                    {placed || (difficulty === 'EASY' ? (
                      <span className="opacity-40 text-amber-500">{char}</span>
                    ) : difficulty === 'MEDIUM' ? (
                      <span className="opacity-40 text-amber-500">?</span>
                    ) : (
                      <span className="opacity-30 text-amber-600 font-sans">_</span>
                    ))}
                  </motion.button>
                  <span className="text-[10px] font-bold text-slate-400 mt-1">Slot {idx + 1}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-amber-900 font-bold mb-4 font-body text-center">
            {difficulty === 'EASY'
              ? 'Ghost letters guide the way! Tap each letter tile to fill the honeycomb.'
              : difficulty === 'MEDIUM'
              ? 'Sound out the phonics word and tap letters in the correct sequence!'
              : 'Master tier! Unscramble the advanced vocabulary tiles without letter guides.'}
          </p>

          {/* Letter Honeycomb Tiles (+20dp touch targets) */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {availableTiles.map((tile) => (
              <motion.button
                key={tile.id}
                disabled={tile.isUsed}
                whileHover={!tile.isUsed ? { scale: 1.1 } : {}}
                whileTap={!tile.isUsed ? { scale: 0.92 } : {}}
                onClick={() => handleSelectLetter(tile.id, tile.letter)}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-fun text-2xl sm:text-3xl font-black border-4 shadow-md transition-all ${
                  tile.isUsed
                    ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-40 cursor-not-allowed'
                    : 'bg-gradient-to-b from-yellow-300 to-amber-400 hover:from-yellow-200 hover:to-amber-300 active:bg-amber-500 border-amber-500 text-amber-950 cursor-pointer shadow-amber-300/60'
                }`}
              >
                <span>{tile.letter}</span>
                <span className="text-[10px] uppercase font-bold text-amber-900 -mt-1">🍯</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Hint Bar */}
      <div className="flex items-center justify-between text-amber-950 font-bold text-xs z-10 px-2">
        <button
          onClick={() => {
            soundEngine.playPop();
            setShowHint(prev => !prev);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-amber-950 border border-amber-300 shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>{showHint ? 'Hide Letter Clue' : 'Hear First Letter'}</span>
        </button>

        {showHint && (
          <span className="bg-white text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 shadow-sm font-fun">
            🐝 The word starts with "{targetWord[0]}"!
          </span>
        )}

        <span className="bg-black/10 px-3 py-1 rounded-full text-white">
          Mistakes: {mistakes}
        </span>
      </div>

      {/* Universal Win Modal */}
      <WinModal
        isOpen={gameState === 'LEVEL_COMPLETE'}
        stars={stars}
        score={score}
        timeSpentSeconds={Math.max(1, Math.round((Date.now() - startTime) / 1000))}
        stickerEarned={earnedSticker}
        currentLevel={currentLevel}
        gameTitle="Word Builder Bee 🐝"
        worldName="Language Jungle"
        onRestart={() => {
          setGameState('PLAYING');
          setWordIndex(0);
          setScore(0);
          setMistakes(0);
          setPlacedLetters([]);
        }}
        onNextLevel={() => {
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setGameState('PLAYING');
            setScore(prev => prev + 100);
          } else {
            onNextGame();
          }
        }}
        onHome={onHome}
        onBackToWorld={onBackToWorld}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPaused}
        isMuted={soundEngine.getMuted()}
        onToggleMute={() => {
          soundEngine.setMuted(!soundEngine.getMuted());
        }}
        onResume={() => {
          setIsPaused(false);
          setGameState('PLAYING');
        }}
        onRestart={() => {
          setIsPaused(false);
          setGameState('PLAYING');
          setWordIndex(0);
          setScore(0);
          setMistakes(0);
          setPlacedLetters([]);
        }}
        onHome={onHome}
        onBackToWorld={onBackToWorld ? () => {
          setIsPaused(false);
          onBackToWorld();
        } : undefined}
      />
    </div>
  );
};
