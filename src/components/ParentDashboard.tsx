/**
 * Parent Dashboard & Offline Learning Analytics
 * Displays 100% offline child progress:
 * - Accuracy %, stars earned per subject area
 * - Time spent today & all time
 * - Child profile manager (up to 4 children: age, avatar, time limits)
 * - Sticker collection gallery
 * - Safe COPPA controls (zero ads, zero tracking, local data wipe)
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Home,
  ArrowLeft,
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
  BookOpen,
  KeyRound,
  AlertTriangle,
  Smartphone,
  WifiOff,
  Download,
  Upload,
  FileText,
  ShieldAlert,
  Info
} from 'lucide-react';
import { ChildProfile, SubjectArea } from '../types/game';
import { storageService, INITIAL_STICKERS } from '../services/storageService';
import { soundEngine } from '../services/soundEngine';
import { parentSecurityService } from '../services/parentSecurityService';
import { OfflineSetupGuideModal } from './OfflineSetupGuideModal';

interface ParentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileSwitched: () => void;
  onOpenInstallModal?: () => void;
  onNativeInstall?: () => void;
  canNativeInstall?: boolean;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  isOpen,
  onClose,
  onProfileSwitched,
  onOpenInstallModal,
  onNativeInstall,
  canNativeInstall = false
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'profiles' | 'stickers' | 'settings'>('analytics');
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => storageService.getProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(() => storageService.getActiveProfileId() || '');
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(5);
  const [newChildAvatar, setNewChildAvatar] = useState('🦁');
  const [newChildLimit, setNewChildLimit] = useState(45);
  const [parentSettings, setParentSettings] = useState(() => storageService.getParentSettings());
  const [showOfflineGuide, setShowOfflineGuide] = useState(false);
  
  // Secure PIN change state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [pinStatusMessage, setPinStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentStats = storageService.getAggregatedStats(activeProfileId || '');
  const currentProfile: ChildProfile = (activeProfileId ? profiles.find(p => p.id === activeProfileId) : undefined) || profiles[0] || {
    id: 'placeholder',
    name: 'Explorer',
    age: 5,
    ageGroup: '5-7',
    avatar: '🦁',
    createdAt: Date.now(),
    dailyTimeLimitMinutes: 45,
    todayPlayTimeSeconds: 0,
    totalPlayTimeSeconds: 0
  };
  const unlockedStickers = activeProfileId ? storageService.getUnlockedStickers(activeProfileId) : [];

  const handleSelectProfile = (id: string) => {
    soundEngine.playPop();
    storageService.setActiveProfileId(id);
    setActiveProfileId(id);
    onProfileSwitched();
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPinInput)) {
      setPinStatusMessage({ text: 'New PIN must be exactly 4 digits.', isError: true });
      soundEngine.playOops();
      return;
    }
    if (newPinInput !== confirmNewPinInput) {
      setPinStatusMessage({ text: 'PIN confirmation does not match.', isError: true });
      soundEngine.playOops();
      return;
    }

    let res: { success: boolean; error?: string };
    if (parentSecurityService.isPinConfigured()) {
      res = await parentSecurityService.changePin(currentPinInput, newPinInput, confirmNewPinInput);
    } else {
      res = await parentSecurityService.setupPin(newPinInput, confirmNewPinInput);
    }

    if (!res.success) {
      setPinStatusMessage({ text: res.error || 'Failed to update PIN', isError: true });
      soundEngine.playOops();
    } else {
      soundEngine.playSnap();
      setPinStatusMessage({ text: 'Parent PIN securely updated!', isError: false });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmNewPinInput('');
      setTimeout(() => setPinStatusMessage(null), 3500);
    }
  };

  const handleExportData = () => {
    soundEngine.playSnap();
    const dataStr = storageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WonderWorldKids_FamilyBackup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setNoticeMessage('Family progress successfully exported to JSON backup file!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storageService.importAllData(content);
      if (res.success) {
        soundEngine.playVictory();
        const updated = storageService.getProfiles();
        setProfiles(updated);
        setActiveProfileId(storageService.getActiveProfileId() || '');
        setNoticeMessage('Family progress successfully restored!');
        onProfileSwitched();
      } else {
        soundEngine.playOops();
        setNoticeMessage(res.error || 'Import failed. Please check JSON format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      setNoticeMessage('At least one child profile must be retained.');
      return;
    }
    soundEngine.playPop();
    storageService.deleteProfile(id);
    const updated = storageService.getProfiles();
    setProfiles(updated);
    setActiveProfileId(storageService.getActiveProfileId() || '');
    onProfileSwitched();
  };

  const handleExecuteReset = () => {
    soundEngine.playOops();
    storageService.resetProfileProgress(activeProfileId);
    setProfiles([...storageService.getProfiles()]);
    setConfirmResetOpen(false);
    onProfileSwitched();
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
    <div className="fixed inset-0 z-[100] flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md select-none overflow-hidden font-body">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border-4 border-slate-200 overflow-hidden flex flex-col"
      >
        {/* Top Header Bar with Prominent Back to Home Button */}
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 gap-2 sticky top-0 z-20">
          {/* Back to Games / Home Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 active:scale-95 text-amber-950 font-fun font-black text-xs sm:text-sm shadow-md border-2 border-white transition shrink-0"
            title="Return to WonderWorld Games Home"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Title & Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 sm:p-2 bg-indigo-600 rounded-xl shrink-0 hidden xs:flex">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <h2 className="text-sm sm:text-lg font-black font-fun text-white truncate">
                Parent Control Hub 🛡️
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">
                100% Offline Analytics • Screen Limits • Child Profiles
              </p>
            </div>
          </div>

          {/* Action & Close Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                soundEngine.playPop();
                setShowOfflineGuide(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-fun font-bold text-xs border border-emerald-400/50 shadow-sm transition active:scale-95 cursor-pointer"
              title="Add to Home Screen Guide for iOS & Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Offline Setup Guide</span>
              <span className="sm:hidden">Setup</span>
            </button>

            {/* Close X Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 shrink-0 cursor-pointer"
              title="Close Parent Control"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
              {/* Offline Setup Guide Banner Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-2 border-emerald-400/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0">
                    📲
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-fun font-black text-sm text-white">Setup 100% Offline Mode</h4>
                      <span className="text-[10px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase font-fun">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Add Wonder World to your iPad, iPhone, or Android home screen for zero-data flights, road trips & full-screen play.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    setShowOfflineGuide(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-fun font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 border border-white"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-950" />
                  <span>Offline Setup Guide</span>
                </button>
              </div>

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
              {noticeMessage && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{noticeMessage}</span>
                  </div>
                  <button
                    onClick={() => setNoticeMessage(null)}
                    className="text-amber-700 hover:text-amber-900 px-2 py-0.5 rounded-lg hover:bg-amber-100"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Parent PIN Security Configuration */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Change Parent Security PIN</h3>
                    <p className="text-xs text-slate-500">Requires entering your current PIN before setting a new code.</p>
                  </div>
                </div>

                <form onSubmit={handleSavePin} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Current PIN
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={currentPinInput}
                        onChange={e => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-3 py-2 text-center text-base font-mono font-bold tracking-widest border-2 border-slate-200 focus:border-indigo-500 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        New 4-Digit PIN
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={newPinInput}
                        onChange={e => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-3 py-2 text-center text-base font-mono font-bold tracking-widest border-2 border-indigo-200 focus:border-indigo-500 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Confirm New PIN
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={confirmNewPinInput}
                        onChange={e => setConfirmNewPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-3 py-2 text-center text-base font-mono font-bold tracking-widest border-2 border-indigo-200 focus:border-indigo-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold font-fun shadow-sm transition cursor-pointer"
                    >
                      Update Security PIN
                    </button>
                    {pinStatusMessage && (
                      <span className={`text-xs font-bold ${pinStatusMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {pinStatusMessage.text}
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Family Data Backup & Transfer (JSON Export/Import) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Family Progress Backup & Transfer</h3>
                    <p className="text-xs text-slate-500">Safely export or restore profiles, stars, and stickers across your family devices.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 rounded-xl text-xs font-bold font-fun transition active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Export Backup (.JSON)</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-2 border-indigo-300 rounded-xl text-xs font-bold font-fun transition active:scale-95 cursor-pointer shadow-2xs">
                    <Upload className="w-4 h-4 text-indigo-700" />
                    <span>Import Backup (.JSON)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Security Architecture & Client-Side Limitations Notice */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-fun font-bold text-xs text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Important Notice on Client-Side Parental Controls</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed font-body">
                  This parental gate uses salted cryptographic derivation and progressive verification throttling to prevent young children (ages 3–10) from accidentally resetting game data or modifying time limits. Because Wonder World Kids runs 100% offline without mandatory cloud servers, files and localStorage are stored directly on this device. Tech-savvy users with browser developer tools or root file system access can inspect local browser storage. For complete device-level screen locks, we recommend pairing this with your operating system's built-in parental restrictions (Apple Screen Time, Google Family Link, or Windows Family Safety).
                </p>
              </div>

              {/* Safety & Compliance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Safety & COPPA Compliance</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Private Learning:</strong> Zero analytics SDKs, zero telemetry, and zero remote network requests. All data stays safely on this device.</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Child Privacy:</strong> COPPA & GDPR-K compliant. No ads, no popups, and no social media integrations.</span>
                  </div>
                </div>
              </div>

              {/* Offline Capability & Storage Status */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">100% Offline Architecture</h3>
                      <p className="text-xs text-slate-500">Service Worker caching & synthesized audio enabled for iOS & Android.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setShowOfflineGuide(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Offline Setup Guide</span>
                    </button>
                    {onOpenInstallModal && (
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playPop();
                          onOpenInstallModal();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-fun font-bold text-xs border border-slate-300 transition"
                      >
                        PWA Status
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Audio Synthesizer:</span>
                    <span className="font-bold text-emerald-700">Offline Procedural Web Audio</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Player Data Persistence:</span>
                    <span className="font-bold text-emerald-700">Local Device Storage</span>
                  </div>
                </div>
              </div>

              {/* Reset Child Progress */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Reset Child Progress</h3>
                <p className="text-xs text-slate-500">
                  Reset star scores, attempt logs, and unlocked stickers for {currentProfile.name}.
                </p>

                {confirmResetOpen ? (
                  <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Are you sure? This will permanently reset progress for {currentProfile.name}.</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmResetOpen(false)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleExecuteReset}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                      >
                        Yes, Reset {currentProfile.name}'s Progress
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(true)}
                    className="px-4 py-2.5 rounded-xl border-2 border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition"
                  >
                    Reset Progress for {currentProfile.name}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Persistent Bottom Action Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-300 font-medium hidden sm:block">
            <span>Ready for {currentProfile.name} to continue playing?</span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 text-white font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-emerald-300 transition"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <Home className="w-4 h-4" />
            <span>Return to Games World Map</span>
          </button>
        </div>
      </motion.div>

      {/* Offline Setup Guide Overlay for Parents */}
      <OfflineSetupGuideModal
        isOpen={showOfflineGuide}
        onClose={() => setShowOfflineGuide(false)}
        onNativeInstall={onNativeInstall}
        canNativeInstall={canNativeInstall}
      />
    </div>
  );
};
