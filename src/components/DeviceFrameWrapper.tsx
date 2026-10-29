/**
 * Cross-Platform Device Frame & Aspect Ratio Controller
 * Simulates iPad (4:3), Android Tablet (16:10), Mobile Phone (16:9), and Fullscreen.
 * Demonstrates seamless multi-device compliance requested in the prompt.
 */

import React, { useState } from 'react';
import { Tablet, Smartphone, Monitor, RotateCw, Sparkles, Volume2, VolumeX, Shield, BookOpen, Layers, Download } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export type DeviceMode = 'ipad_4_3' | 'android_16_10' | 'phone_16_9' | 'responsive';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  onOpenParentGate: () => void;
  onOpenArchitecture: () => void;
  onOpenDirectory: () => void;
  onOpenApkModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  childAvatar: string;
  childName: string;
  childAge: number;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  onOpenParentGate,
  onOpenArchitecture,
  onOpenDirectory,
  onOpenApkModal,
  isMuted,
  onToggleMute,
  childAvatar,
  childName,
  childAge
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('ipad_4_3');
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  const handleDeviceChange = (mode: DeviceMode) => {
    soundEngine.playPop();
    setDeviceMode(mode);
  };

  const toggleOrientation = () => {
    soundEngine.playPop();
    setIsPortrait(prev => !prev);
  };

  // Compute container dimensions based on device preset and orientation
  const getFrameStyles = (): React.CSSProperties => {
    if (deviceMode === 'responsive') {
      return { width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' };
    }

    if (deviceMode === 'ipad_4_3') {
      // 4:3 ratio
      return isPortrait
        ? { width: 'min(92vw, 680px)', aspectRatio: '3 / 4' }
        : { width: 'min(94vw, 980px)', aspectRatio: '4 / 3' };
    }

    if (deviceMode === 'android_16_10') {
      // 16:10 ratio
      return isPortrait
        ? { width: 'min(88vw, 620px)', aspectRatio: '10 / 16' }
        : { width: 'min(95vw, 1020px)', aspectRatio: '16 / 10' };
    }

    if (deviceMode === 'phone_16_9') {
      // 16:9 ratio
      return isPortrait
        ? { width: 'min(85vw, 420px)', aspectRatio: '9 / 16' }
        : { width: 'min(92vw, 860px)', aspectRatio: '16 / 9' };
    }

    return { width: '100%', height: '100%' };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body selection:bg-indigo-500 selection:text-white">
      {/* Top Universal App Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 z-30 shadow-md">
        {/* App Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center text-xl shadow-md border border-white/20">
            🌟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm font-fun tracking-wide text-white">
                Wonder World Kids Learning
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Offline Suite
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Active Player: <strong className="text-white">{childAvatar} {childName} ({childAge}y)</strong></span>
            </div>
          </div>
        </div>

        {/* Center: Device Aspect Ratio & Orientation Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => handleDeviceChange('ipad_4_3')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              deviceMode === 'ipad_4_3' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="iPad 4:3 Aspect Ratio"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iPad (4:3)</span>
          </button>

          <button
            onClick={() => handleDeviceChange('android_16_10')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              deviceMode === 'android_16_10' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Android Tablet 16:10"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android (16:10)</span>
          </button>

          <button
            onClick={() => handleDeviceChange('phone_16_9')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              deviceMode === 'phone_16_9' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Phone 16:9"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone (16:9)</span>
          </button>

          <button
            onClick={() => handleDeviceChange('responsive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              deviceMode === 'responsive' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Responsive Full Viewport"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full</span>
          </button>

          {deviceMode !== 'responsive' && (
            <button
              onClick={toggleOrientation}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 ml-1 border-l border-slate-700 pl-2"
              title="Rotate Screen Orientation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Tools: APK Bundle, Architecture Inspector, Audio, Parent Gate */}
        <div className="flex items-center gap-2">
          {/* Mobile Packages (Android APK & iOS IPA) */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenApkModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-emerald-600/30 border border-emerald-400/30 transition active:scale-95"
            title="Download Android APK & iOS Packages"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-fun">Download Apps (Android & iOS)</span>
          </button>

          {/* Architecture Blueprint modal trigger */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenArchitecture();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold border border-slate-700 shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Tech Blueprint</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onToggleMute();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Parent Gate Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenParentGate();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/30"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Parent Gate</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 overflow-hidden">
        {deviceMode === 'responsive' ? (
          <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-center">
            {children}
          </div>
        ) : (
          <div
            style={getFrameStyles()}
            className="relative bg-slate-950 p-3 sm:p-4 rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-800 flex flex-col justify-center items-center transition-all duration-300 ring-1 ring-white/10"
          >
            {/* Camera / Speaker dot */}
            <div className="absolute top-2 w-12 h-2 rounded-full bg-slate-800/80 mb-1 z-20" />

            {/* Simulated Kid Screen */}
            <div className="w-full h-full rounded-[28px] overflow-hidden relative shadow-inner bg-slate-900">
              {children}
            </div>

            {/* Home indicator bar at bottom */}
            <div className="absolute bottom-1 w-24 h-1 rounded-full bg-slate-700/80 mt-1 z-20" />
          </div>
        )}
      </main>
    </div>
  );
};
