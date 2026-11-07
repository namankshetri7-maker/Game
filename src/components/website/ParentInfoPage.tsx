import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

interface ParentInfoPageProps {
  onNavigate: (route: string) => void;
}

export const ParentInfoPage: React.FC<ParentInfoPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-fun">Parent Info</span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mt-1 mb-3">
            Parental Controls & Privacy
          </h1>
          <p className="text-sm text-slate-300">
            Simple, offline-first educational games designed for family safety.
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-white font-bold font-fun text-lg">
              <Shield className="w-6 h-6 text-amber-400" />
              <span>Secure Parental Gate</span>
            </div>
            <p>
              All parent settings, time limit controls, and profile management are protected behind a secure parental gate requiring adult challenge verification.
            </p>
          </div>

          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-white font-bold font-fun text-lg">
              <Lock className="w-6 h-6 text-emerald-400" />
              <span>100% Offline & No Data Storage</span>
            </div>
            <p>
              Wonder World Kids is entirely offline. No user data, game progress, or child profiles are ever sent to external servers. All information is kept strictly local on your device.
            </p>
          </div>

          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-white font-bold font-fun text-lg">
              <CheckCircle2 className="w-6 h-6 text-sky-400" />
              <span>Ad-Free Environment</span>
            </div>
            <p>
              We provide a focused, distraction-free environment with no ads or external tracking inside the children's gameplay to maintain a pure learning experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
