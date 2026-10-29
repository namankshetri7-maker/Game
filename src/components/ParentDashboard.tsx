/**
 * Parent Dashboard & Offline Learning Analytics
 * Displays 100% offline child progress:
 * - Accuracy %, stars earned per subject area
 * - Time spent today & all time
 * - Child profile manager (up to 4 children: age, avatar, time limits)
 * - Sticker collection gallery
 * - Safe COPPA controls (zero ads, zero tracking, local data wipe)
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Users,
  Clock,
  Award,
  Sparkles,
  BarChart3,
  Sliders,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { ChildProfile, SubjectArea } from '../types/game';
import { storageService, INITIAL_STICKERS } from '../services/storageService';
import { soundEngine } from '../services/soundEngine';

interface ParentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileSwitched: () => void;
  onOpenApkBundle?: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  isOpen,
  onClose,
  onProfileSwitched,
  onOpenApkBundle
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'profiles' | 'stickers' | 'settings'>('analytics');
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => storageService.getProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(() => storageService.getActiveProfileId());
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(5);
  const [newChildAvatar, setNewChildAvatar] = useState('🦁');
  const [newChildLimit, setNewChildLimit] = useState(45);
  const [parentSettings, setParentSettings] = useState(() => storageService.getParentSettings());

  if (!isOpen) return null;

  const currentStats = storageService.getAggregatedStats(activeProfileId);
  const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const unlockedStickers = storageService.getUnlockedStickers(activeProfileId);

  const handleSelectProfile = (id: string) => {
    soundEngine.playPop();
    storageService.setActiveProfileId(id);
    setActiveProfileId(id);
    onProfileSwitched();
  };

  const handleCreateChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    let group: '3-4' | '5-7' | '8-10' = '5-7';
    if (newChildAge <= 4) group = '3-4';
    else if (newChildAge >= 8) group = '8-10';

    const created = storageService.createProfile({
      name: newChildName.trim(),
      age: newChildAge,
      ageGroup: group,
      avatar: newChildAvatar,
      dailyTimeLimitMinutes: newChildLimit
    });

    if (created) {
      soundEngine.playSnap();
      setProfiles(storageService.getProfiles());
      setShowAddChildModal(false);
      setNewChildName('');
    }
  };

  const handleDeleteChild = (id: string) => {
    if (profiles.length <= 1) {
      alert('At least one profile must be retained.');
      return;
    }
    soundEngine.playPop();
    storageService.deleteProfile(id);
    const updated = storageService.getProfiles();
    setProfiles(updated);
    setActiveProfileId(storageService.getActiveProfileId());
    onProfileSwitched();
  };

  const handleResetData = () => {
    if (confirm(`Reset all game progress and stars for ${currentProfile.name}?`)) {
      soundEngine.playOops();
      storageService.resetProfileProgress(activeProfileId);
      setProfiles([...storageService.getProfiles()]);
      onProfileSwitched();
    }
  };

  const AVATAR_OPTIONS = ['🦁', '🦊', '🐼', '🐨', '🦖', '🦄', '🚀', '⭐'];

  const SUBJECT_TITLES: Record<SubjectArea, { label: string; color: string; icon: string }> = {
    math: { label: 'Math Valley', color: 'bg-blue-500', icon: '🔢' },
    phonics: { label: 'English & Phonics', color: 'bg-emerald-500', icon: '🦁' },
    geography: { label: 'World Geography', color: 'bg-amber-500', icon: '🌍' },
    science: { label: 'Animals & Science', color: 'bg-pink-500', icon: '🐾' },
    logic: { label: 'Brain & Logic', color: 'bg-purple-500', icon: '🧩' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-fun">Parent Zone & Learning Dashboard</h2>
              <p className="text-xs text-slate-400">100% Offline • COPPA Safe • Zero Advertising</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Quick-Switch Tabs */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Active Child:</span>
            {profiles.map(p => {
              const isSelected = p.id === activeProfileId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProfile(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                    isSelected
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <span className="text-base">{p.avatar}</span>
                  <span>{p.name} ({p.age}y)</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-200" />}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Today: {currentStats.todayPlayTimeMinutes} min / {currentProfile.dailyTimeLimitMinutes} min max</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === 'analytics'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Learning Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === 'profiles'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Profiles ({profiles.length}/4)</span>
          </button>
          <button
            onClick={() => setActiveTab('stickers')}
            className={`py-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === 'stickers'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Stickers ({unlockedStickers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Controls & Screen Time</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 font-body">
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                    <span>Total Stars</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold font-fun text-amber-600">{currentStats.totalStars} ⭐</div>
                  <p className="text-[11px] text-slate-400 mt-1">Across all 5 worlds</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                    <span>Accuracy Rate</span>
                    <Award className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold font-fun text-emerald-600">{currentStats.accuracyPercent}%</div>
                  <p className="text-[11px] text-slate-400 mt-1">Successful solutions</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                    <span>Games Mastered</span>
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold font-fun text-blue-600">{currentStats.totalGamesPlayed} / 45</div>
                  <p className="text-[11px] text-slate-400 mt-1">Mini-game activities</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                    <span>Total Learning Time</span>
                    <Clock className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-2xl font-bold font-fun text-indigo-600">{currentStats.totalPlayTimeMinutes} min</div>
                  <p className="text-[11px] text-slate-400 mt-1">Cumulative education</p>
                </div>
              </div>

              {/* Subject Breakdown Bars */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>Subject Mastery Breakdown</span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                    Age Group: {currentProfile.ageGroup}
                  </span>
                </h3>

                <div className="space-y-4">
                  {(Object.keys(SUBJECT_TITLES) as SubjectArea[]).map(subjKey => {
                    const info = SUBJECT_TITLES[subjKey];
                    const stat = currentStats.subjectStats[subjKey];
                    const maxStars = 30; // 10 games * 3 stars (or 15 for logic)
                    const percent = Math.min(100, Math.round((stat.stars / (subjKey === 'logic' ? 15 : 30)) * 100));

                    return (
                      <div key={subjKey}>
                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <span>{info.icon}</span>
                            <span>{info.label}</span>
                          </span>
                          <span className="text-slate-500">
                            {stat.stars} Stars • {Math.round(stat.timeSeconds / 60)} min
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full ${info.color} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(5, percent)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Child Profiles (Up to 4)</h3>
                  <p className="text-xs text-slate-500">Each child gets their own age-adaptive difficulty, stars, and stickers.</p>
                </div>
                {profiles.length < 4 && (
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setShowAddChildModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Child</span>
                  </button>
                )}
              </div>

              {/* Profiles List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profiles.map(p => {
                  const isActive = p.id === activeProfileId;
                  return (
                    <div
                      key={p.id}
                      className={`p-5 rounded-2xl border-2 transition ${
                        isActive ? 'bg-indigo-50/60 border-indigo-500 shadow-md' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl p-2 bg-white rounded-2xl border border-slate-200 shadow-inner">
                            {p.avatar}
                          </span>
                          <div>
                            <h4 className="text-lg font-bold font-fun text-slate-800">{p.name}</h4>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              Age {p.age} • Group {p.ageGroup}
                            </span>
                          </div>
                        </div>

                        {profiles.length > 1 && (
                          <button
                            onClick={() => handleDeleteChild(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 mb-4">
                        <div>Daily Screen Time Limit: <span className="font-bold text-slate-800">{p.dailyTimeLimitMinutes} min</span></div>
                        <div>Total Play Time: <span className="font-bold text-slate-800">{Math.round(p.totalPlayTimeSeconds / 60)} min</span></div>
                      </div>

                      <div className="flex gap-2">
                        {!isActive ? (
                          <button
                            onClick={() => handleSelectProfile(p.id)}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                          >
                            Switch to this Player
                          </button>
                        ) : (
                          <div className="w-full py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-300">
                            ✓ Currently Active Player
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add child inline form */}
              {showAddChildModal && (
                <div className="bg-white p-5 rounded-2xl border-2 border-indigo-200 shadow-md">
                  <h4 className="font-bold text-slate-800 mb-3">Create Child Profile</h4>
                  <form onSubmit={handleCreateChild} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Child's Name</label>
                      <input
                        type="text"
                        value={newChildName}
                        onChange={e => setNewChildName(e.target.value)}
                        placeholder="e.g. Emma"
                        required
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Age (3 to 10)</label>
                        <select
                          value={newChildAge}
                          onChange={e => setNewChildAge(Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                        >
                          {[3, 4, 5, 6, 7, 8, 9, 10].map(a => (
                            <option key={a} value={a}>
                              Age {a} ({a <= 4 ? 'Ages 3-4 Easy' : a <= 7 ? 'Ages 5-7 Medium' : 'Ages 8-10 Hard'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Daily Limit</label>
                        <select
                          value={newChildLimit}
                          onChange={e => setNewChildLimit(Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                        >
                          <option value={20}>20 Minutes</option>
                          <option value={30}>30 Minutes</option>
                          <option value={45}>45 Minutes</option>
                          <option value={60}>60 Minutes</option>
                          <option value={90}>90 Minutes</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Choose Fun Avatar</label>
                      <div className="flex gap-2 flex-wrap">
                        {AVATAR_OPTIONS.map(av => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setNewChildAvatar(av)}
                            className={`text-2xl p-2 rounded-xl border-2 transition ${
                              newChildAvatar === av ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddChildModal(false)}
                        className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                      >
                        Save Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stickers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {currentProfile.name}'s Sticker Book ({unlockedStickers.length}/{INITIAL_STICKERS.length})
                  </h3>
                  <p className="text-xs text-slate-500">Stickers are awarded for solving puzzles and earning stars!</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INITIAL_STICKERS.map(stk => {
                  const isUnlocked = unlockedStickers.some(u => u.id === stk.id);
                  return (
                    <div
                      key={stk.id}
                      className={`p-4 rounded-2xl border-2 text-center transition ${
                        isUnlocked
                          ? 'bg-white border-amber-300 shadow-md ring-2 ring-amber-100'
                          : 'bg-slate-100/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="text-4xl mb-2 filter drop-shadow">
                        {isUnlocked ? stk.icon : '🔒'}
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 mb-1">{stk.name}</h4>
                      <p className="text-[10px] text-slate-500">{stk.description}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        stk.rarity === 'legendary' ? 'bg-purple-100 text-purple-700' :
                        stk.rarity === 'rare' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {stk.rarity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Safety & COPPA Compliance</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>100% Offline:</strong> Zero analytics SDKs, zero telemetry, and zero remote network requests. All data stays on this device.</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Child Privacy:</strong> COPPA & GDPR-K compliant. No ads, no popups, and no social media integrations.</span>
                  </div>
                </div>
              </div>

              {/* Mobile App Packages (Android APK & iOS Package) card */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 p-5 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-fun flex items-center gap-2">
                      <span>Mobile App Packages (Android APK & iOS)</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Offline Bundles</span>
                    </h3>
                    <p className="text-xs text-slate-600">
                      Download complete offline Android Studio APK bundle (.zip) and iOS Xcode & iPadOS package (.zip) with zero network permissions.
                    </p>
                  </div>
                  <span className="text-2xl">📱</span>
                </div>
                {onOpenApkBundle && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      onOpenApkBundle();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:brightness-110 text-white font-fun font-bold text-xs shadow-md transition flex items-center gap-2"
                  >
                    <span>Download Android APK & iOS Packages</span>
                  </button>
                )}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Reset Child Progress</h3>
                <p className="text-xs text-slate-500">
                  Reset star scores, attempt logs, and stickers for {currentProfile.name}.
                </p>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-2.5 rounded-xl border-2 border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition"
                >
                  Reset Progress for {currentProfile.name}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
