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
            No ZIP downloads required! Install Wonder World Kids directly from your browser as a lightning-fast offline app.
          </p>
        </div>

        {/* Launch / Install Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-900 rounded-3xl border-3 border-emerald-400 p-8 shadow-2xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black font-fun text-white mb-2">Ready to Play Offline?</h2>
            <p className="text-xs text-emerald-200">Open our web URL on any device and tap "Install" or "Add to Home Screen".</p>
          </div>
          <button
            onClick={() => { soundEngine.playPop(); onEnterGame(); }}
            className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer shrink-0 border border-emerald-400"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Web App URL</span>
          </button>
        </div>

        {/* Instructions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2.5 mb-4">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold font-fun text-white">Android Phone & Tablet (Chrome / Edge)</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Open <strong className="text-white">Chrome</strong> and navigate to our web app URL.</li>
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
              <li>Open <strong className="text-white">Safari</strong> and visit our game URL.</li>
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
              <li>Open our URL in Chrome or Microsoft Edge.</li>
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
              <li>Open our web URL in Chrome or Safari.</li>
              <li>In Chrome, click the install icon in the address bar. In Safari, choose <strong className="text-white">File &gt; Add to Dock</strong>.</li>
              <li>Launch instantly from your Mac Dock offline!</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};
