/**
 * Wonder World Kids Website - PWA Installation Instructions Page
 * Simple, clean guide for installing the app as a Progressive Web App across devices.
 */

import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import { Download, Laptop, Smartphone, CheckCircle2, Shield, Play } from 'lucide-react';

interface DownloadInstructionsPageProps {
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
}

export const DownloadInstructionsPage: React.FC<DownloadInstructionsPageProps> = ({ onNavigate, onEnterGame }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-fun">Offline App Installation</span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mt-1 mb-3">
            Install Wonder World PWA
          </h1>
          <p className="text-sm text-slate-300">
            Play anywhere, anytime! Download the standalone offline ZIP game package or install the 1-click web app directly to your home screen.
          </p>
        </div>

        {/* Dual Direct Options: Instant Play & Direct Download Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl border-3 border-emerald-400 p-6 sm:p-8 shadow-2xl mb-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-fun mb-2 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Offline • Lifetime Access • No Internet Needed</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-fun text-white mb-1.5">Get Wonder World Kids Now</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Launch the live interactive web game in your browser or directly download the full 20 MB standalone offline ZIP package for PC, Mac, iPad, or USB drive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => { soundEngine.playPop(); onEnterGame(); }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-fun font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-emerald-400 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Live Game</span>
            </button>

            <a
              href="/WonderWorldKids_Offline_Package.zip"
              download="WonderWorldKids_Offline_Package.zip"
              onClick={() => soundEngine.playVictory()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-fun font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer border-2 border-white transition"
            >
              <Download className="w-4 h-4" />
              <span>Direct Download ZIP (20 MB)</span>
            </a>
          </div>
        </div>

        {/* Option 1: Standalone Offline Package Card */}
        <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 border-2 border-amber-400/80 shadow-xl mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-md shrink-0">
              📦
            </div>
            <div>
              <h3 className="text-lg font-black font-fun text-white flex items-center gap-2">
                <span>Option 1: Direct Offline Package (.ZIP)</span>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-md uppercase">20 MB</span>
              </h3>
              <p className="text-xs text-slate-300">
                Self-contained, standalone offline game suite. No internet or install tool required.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/80 mb-5">
            <h4 className="text-xs font-bold text-amber-300 uppercase font-fun mb-2">How to use the Offline ZIP:</h4>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Click the <strong className="text-white">Download ZIP (20 MB)</strong> button above.</li>
              <li>Right-click the downloaded file and select <strong className="text-white">Extract All</strong> (Windows) or double-click to unzip (Mac).</li>
              <li>Double-click <strong className="text-indigo-400 font-mono">index.html</strong> inside the extracted folder.</li>
              <li>It opens instantly in Chrome, Safari, Edge, or Firefox—<strong className="text-emerald-400">completely offline without Wi-Fi</strong>!</li>
            </ol>
          </div>

          <div className="flex items-center justify-end">
            <a
              href="/WonderWorldKids_Offline_Package.zip"
              download="WonderWorldKids_Offline_Package.zip"
              onClick={() => soundEngine.playVictory()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-fun font-bold text-xs shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Download WonderWorldKids_Offline_Package.zip</span>
            </a>
          </div>
        </div>

        {/* Option 2: 1-Click PWA Installation Section Header */}
        <div className="mb-6">
          <h3 className="text-lg font-black font-fun text-white flex items-center gap-2">
            <span>Option 2: 1-Click Home Screen Install (PWA)</span>
            <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-md uppercase">Instant</span>
          </h3>
          <p className="text-xs text-slate-400">
            Add to your home screen or desktop application list for one-tap full-screen offline play.
          </p>
        </div>

        {/* Instructions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2.5 mb-4">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold font-fun text-white">Android Phone & Tablet (Chrome / Edge)</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Open <strong className="text-white">Chrome</strong> and navigate to <strong className="text-indigo-400">wonderworldkidslearning.space</strong>.</li>
              <li>Tap the menu button (<strong className="text-white">⋮</strong>) in the top right corner.</li>
              <li>Select <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong>.</li>
              <li>Enjoy 100% offline access right from your app launcher!</li>
            </ol>
          </div>
  
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2.5 mb-4">
              <Smartphone className="w-6 h-6 text-purple-400" />
              <h3 className="text-base font-bold font-fun text-white">iPhone & iPad (Safari iOS)</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Open <strong className="text-white">Safari</strong> and visit <strong className="text-indigo-400">wonderworldkidslearning.space</strong>.</li>
              <li>Tap the <strong className="text-white">Share</strong> button at the bottom of your screen.</li>
              <li>Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</li>
              <li>Confirm to add Wonder World to your home screen.</li>
            </ol>
          </div>
  
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2.5 mb-4">
              <Laptop className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold font-fun text-white">Windows PC (Chrome / Edge)</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Open <strong className="text-indigo-400">wonderworldkidslearning.space</strong> in Chrome or Edge.</li>
              <li>Click the <strong className="text-white">Install icon</strong> (monitor with down arrow) in the right side of the address bar.</li>
              <li>Click <strong className="text-white">Install</strong> to run Wonder World as a dedicated desktop app window.</li>
            </ol>
          </div>
  
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2.5 mb-4">
              <Laptop className="w-6 h-6 text-sky-400" />
              <h3 className="text-base font-bold font-fun text-white">macOS (Chrome / Safari)</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Open <strong className="text-indigo-400">wonderworldkidslearning.space</strong> in Chrome or Safari.</li>
              <li>In Chrome, click the install icon in the address bar. In Safari, choose <strong className="text-white">File &gt; Add to Dock</strong>.</li>
              <li>Launch instantly from your Mac Dock offline!</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};
