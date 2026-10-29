/**
 * Complete 45 Mini-Game Directory Modal
 * Allows browsing all games in the 5 thematic worlds, filtering by subject,
 * inspecting skills learned, and launching playable games directly.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Lock, CheckCircle2, Search, Filter } from 'lucide-react';
import { MINI_GAMES_MATRIX, WORLDS } from '../data/gameMatrix';
import { MiniGameMeta, SubjectArea } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface GameDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (gameId: string) => void;
}

export const GameDirectoryModal: React.FC<GameDirectoryModalProps> = ({
  isOpen,
  onClose,
  onLaunchGame
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectArea | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredGames = MINI_GAMES_MATRIX.filter(g => {
    const matchesSubject = selectedSubject === 'all' || g.subject === selectedSubject;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md select-none overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-indigo-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-fun">Complete 45 Mini-Game Matrix</h2>
              <p className="text-xs text-indigo-200">5 Thematic Worlds • Ages 3 to 10 Curriculum Matrix</p>
            </div>
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="p-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-indigo-200 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search & Subject Filter Bar */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedSubject('all');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedSubject === 'all'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All (45)
              </button>
              {WORLDS.map(w => (
                <button
                  key={w.id}
                  onClick={() => {
                    soundEngine.playPop();
                    setSelectedSubject(w.subject);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition ${
                    selectedSubject === w.subject
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{w.icon}</span>
                  <span>{w.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search games or skills..."
                className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Games Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGames.map(game => (
              <div
                key={game.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition ${
                  game.playable
                    ? 'bg-gradient-to-b from-white to-indigo-50/40 border-indigo-200 hover:border-indigo-400 shadow-sm'
                    : 'bg-white border-slate-200 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">#{game.number}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      game.playable ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {game.playable ? '▶ Ready to Play' : 'Catalog Matrix'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl p-2 rounded-xl bg-slate-100">{game.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 font-fun">{game.title}</h4>
                      <p className="text-[11px] text-indigo-700 font-semibold">{game.ageRecommendation}</p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {game.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Launch button if playable */}
                {game.playable ? (
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      onLaunchGame(game.id);
                      onClose();
                    }}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xs font-bold font-fun flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Now</span>
                  </button>
                ) : (
                  <div className="text-[11px] font-bold text-slate-400 py-1.5 text-center bg-slate-50 rounded-xl border border-slate-200">
                    Curriculum Level Asset
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
