/**
 * Wonder World Kids - Runtime Error Boundary & Auto-Recovery Component
 * Ensures zero white-screen crashes anywhere in the game or website.
 * Catches any render errors, auto-heals storage via offlineBugFixer,
 * and renders a cheerful child-safe recovery view.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home, Sparkles, ShieldCheck } from 'lucide-react';
import { offlineBugFixer } from '../services/offlineBugFixer';
import { soundEngine } from '../services/soundEngine';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RuntimeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn('[RuntimeErrorBoundary] Caught error:', error, errorInfo);
    // Self-heal storage immediately
    offlineBugFixer.healLocalStorage();
  }

  private handleRecover = () => {
    soundEngine.playPop();
    offlineBugFixer.healLocalStorage();
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    soundEngine.playPop();
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-b from-sky-400 via-indigo-600 to-purple-800 text-white font-body flex items-center justify-center p-4 select-none">
          <div className="bg-white/95 text-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden animate-fadeIn">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
              🌱
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black font-fun mb-2 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-Healed & Protected</span>
            </div>

            <h2 className="text-2xl font-black font-fun text-slate-900 mb-2">
              Let&apos;s Jump Back In! 🚀
            </h2>

            <p className="text-xs text-slate-600 mb-6 font-medium leading-relaxed">
              Wonder World safe guard automatically cleaned up and restored your game progress. Tap below to keep playing!
            </p>

            <div className="space-y-2.5">
              <button
                onClick={this.handleRecover}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-fun font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition border-2 border-emerald-400"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resume Game</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-fun font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition border border-slate-300"
              >
                <Home className="w-4 h-4" />
                <span>Return to World Map</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
