/**
 * 100% Offline Procedural Sound Synthesizer & AudioBuffer Pre-Cache Engine
 *
 * Designed for both PWA web browsers and the standalone Android WebView build:
 * - Pre-renders and caches all game audio buffers in memory on launch via OfflineAudioContext
 *   so first-tap audio-visual feedback is instantaneous even on an empty WebView cache.
 * - Falls back seamlessly to real-time Web Audio OscillatorNode synthesis if needed.
 * - Zero external audio files, zero network hits, and deterministic offline playback.
 */

export interface AudioPrecacheStatus {
  ready: boolean;
  inProgress: boolean;
  cachedCount: number;
  totalCount: number;
  usingCachedBuffers: boolean;
  contextState: AudioContextState | 'unavailable';
}

const BGM_SCALE_NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C pentatonic
const STAR_NOTES = [523.25, 659.25, 783.99]; // C5, E5, G5
const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DEFAULT_PRECACHE_SAMPLE_RATE = 44100;

export const GAME_AUDIO_ASSET_KEYS: readonly string[] = [
  'pop',
  'snap',
  'star_0',
  'star_1',
  'star_2',
  'victory',
  'level_up_fanfare',
  'count_tick',
  'oops',
  'crunch',
  'laser',
  'coin',
  ...ALPHABET_LETTERS.map((letter) => `letter_${letter}`),
  ...BGM_SCALE_NOTES.map((_, idx) => `bgm_${idx}`),
];

type RenderDescriptor = {
  durationSec: number;
  render: (ctx: BaseAudioContext, startTime: number, destination: AudioNode) => void;
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private musicInterval: number | null = null;

  private bufferCache: Map<string, AudioBuffer> = new Map();
  private precachePromise: Promise<AudioPrecacheStatus> | null = null;
  private isPrecaching: boolean = false;
  private isPrecacheReady: boolean = false;
  private hasWarmedUpHardware: boolean = false;
  private listenersInstalled: boolean = false;

  constructor() {
    this.installLifecycleListeners();
  }

  private getAudioContextConstructor(): typeof AudioContext | null {
    if (typeof window === 'undefined') return null;
    return (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ||
      null
    );
  }

  private getOfflineAudioContextConstructor(): typeof OfflineAudioContext | null {
    if (typeof window === 'undefined') return null;
    return (
      window.OfflineAudioContext ||
      (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext })
        .webkitOfflineAudioContext ||
      null
    );
  }

  private installLifecycleListeners(): void {
    if (this.listenersInstalled || typeof window === 'undefined') return;
    this.listenersInstalled = true;

    const handleInteractionUnlock = () => {
      this.unlockAndWarmup();
      if (!this.isPrecacheReady && !this.isPrecaching) {
        void this.precacheAll();
      }
      window.removeEventListener('pointerdown', handleInteractionUnlock);
      window.removeEventListener('touchstart', handleInteractionUnlock);
      window.removeEventListener('keydown', handleInteractionUnlock);
    };

    window.addEventListener('pointerdown', handleInteractionUnlock, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteractionUnlock, { once: true, passive: true });
    window.addEventListener('keydown', handleInteractionUnlock, { once: true, passive: true });

    const handleResumeAudio = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
        this.ctx.resume().catch(() => {});
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleResumeAudio);
    }
    window.addEventListener('wwk-android-resume', handleResumeAudio);
  }

  private initContext(): AudioContext | null {
    const AudioCtx = this.getAudioContextConstructor();
    if (!AudioCtx) return null;

    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Unlocks the WebView / Browser AudioContext and plays a 1-sample silent buffer
   * so Android audio hardware wakes up immediately without first-tap latency.
   */
  public unlockAndWarmup(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (this.hasWarmedUpHardware) return;
    try {
      const silentBuffer = ctx.createBuffer(1, 1, ctx.sampleRate || DEFAULT_PRECACHE_SAMPLE_RATE);
      const source = ctx.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(ctx.destination);
      source.start(0);
      this.hasWarmedUpHardware = true;
    } catch {
      // Safe no-op on restricted environments before user interaction
    }
  }

  /**
   * Immediately pre-renders and caches all game audio assets into AudioBuffers.
   * Safe and idempotent to call at application launch even with an empty WebView cache.
   */
  public async precacheAll(options: { unlockImmediate?: boolean } = {}): Promise<AudioPrecacheStatus> {
    if (options.unlockImmediate) {
      this.unlockAndWarmup();
    }

    if (this.isPrecacheReady && this.bufferCache.size >= GAME_AUDIO_ASSET_KEYS.length) {
      return this.getPrecacheStatus();
    }

    if (this.precachePromise) {
      return this.precachePromise;
    }

    this.isPrecaching = true;
    this.precachePromise = (async () => {
      try {
        // Pre-warm offline speech synthesis voice list on supported WebViews
        try {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
          }
        } catch {
          // Ignore if TTS engine is unavailable
        }

        const OfflineCtx = this.getOfflineAudioContextConstructor();
        const sampleRate = this.ctx?.sampleRate || DEFAULT_PRECACHE_SAMPLE_RATE;

        if (OfflineCtx) {
          for (const key of GAME_AUDIO_ASSET_KEYS) {
            if (this.bufferCache.has(key)) continue;
            const descriptor = this.getDescriptorForKey(key);
            if (!descriptor) continue;

            try {
              const frameCount = Math.max(1, Math.ceil(descriptor.durationSec * sampleRate));
              const offlineCtx = new OfflineCtx(1, frameCount, sampleRate);
              descriptor.render(offlineCtx, 0, offlineCtx.destination);
              const renderedBuffer = await offlineCtx.startRendering();
              if (renderedBuffer) {
                this.bufferCache.set(key, renderedBuffer);
              }
            } catch {
              // Individual render failure falls back transparently to live synthesis
            }
          }
        }

        this.isPrecacheReady = true;
        return this.getPrecacheStatus();
      } finally {
        this.isPrecaching = false;
        this.precachePromise = null;
      }
    })();

    return this.precachePromise;
  }

  public isPrecached(): boolean {
    return this.isPrecacheReady && this.bufferCache.size > 0;
  }

  public getCachedAssetKeys(): string[] {
    return Array.from(this.bufferCache.keys());
  }

  public getPrecacheStatus(): AudioPrecacheStatus {
    return {
      ready: this.isPrecacheReady,
      inProgress: this.isPrecaching,
      cachedCount: this.bufferCache.size,
      totalCount: GAME_AUDIO_ASSET_KEYS.length,
      usingCachedBuffers: this.bufferCache.size > 0,
      contextState: this.ctx ? this.ctx.state : 'unavailable',
    };
  }

  private getDescriptorForKey(key: string): RenderDescriptor | null {
    switch (key) {
      case 'pop':
        return {
          durationSec: 0.11,
          render: (ctx, startTime, dest) => this.renderPop(ctx, startTime, dest),
        };
      case 'snap':
        return {
          durationSec: 0.16,
          render: (ctx, startTime, dest) => this.renderSnap(ctx, startTime, dest),
        };
      case 'star_0':
      case 'star_1':
      case 'star_2': {
        const idx = Number(key.split('_')[1]) || 0;
        return {
          durationSec: 0.42,
          render: (ctx, startTime, dest) => this.renderStar(ctx, startTime, dest, idx),
        };
      }
      case 'victory':
        return {
          durationSec: 0.9,
          render: (ctx, startTime, dest) => this.renderVictory(ctx, startTime, dest),
        };
      case 'level_up_fanfare':
        return {
          durationSec: 1.4,
          render: (ctx, startTime, dest) => this.renderLevelUpFanfare(ctx, startTime, dest),
        };
      case 'count_tick':
        return {
          durationSec: 0.06,
          render: (ctx, startTime, dest) => this.renderCountTick(ctx, startTime, dest, 680),
        };
      case 'oops':
        return {
          durationSec: 0.35,
          render: (ctx, startTime, dest) => this.renderOops(ctx, startTime, dest),
        };
      case 'crunch':
        return {
          durationSec: 0.14,
          render: (ctx, startTime, dest) => this.renderCrunch(ctx, startTime, dest),
        };
      case 'laser':
        return {
          durationSec: 0.18,
          render: (ctx, startTime, dest) => this.renderLaser(ctx, startTime, dest),
        };
      case 'coin':
        return {
          durationSec: 0.3,
          render: (ctx, startTime, dest) => this.renderCoin(ctx, startTime, dest),
        };
      default:
        break;
    }

    if (key.startsWith('letter_') && key.length === 8) {
      const letter = key.slice(7);
      return {
        durationSec: 0.28,
        render: (ctx, startTime, dest) => this.renderLetterTone(ctx, startTime, dest, letter),
      };
    }

    if (key.startsWith('bgm_')) {
      const idx = Number(key.slice(4));
      const freq = BGM_SCALE_NOTES[idx];
      if (typeof freq === 'number') {
        return {
          durationSec: 0.36,
          render: (ctx, startTime, dest) => this.renderBgmBeat(ctx, startTime, dest, freq),
        };
      }
    }

    return null;
  }

  private playCachedBuffer(
    ctx: AudioContext,
    key: string,
    destination?: AudioNode,
    playbackRate: number = 1
  ): boolean {
    const buffer = this.bufferCache.get(key);
    if (!buffer) return false;

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      if (playbackRate !== 1 && source.playbackRate) {
        source.playbackRate.setValueAtTime(playbackRate, ctx.currentTime);
      }
      source.connect(destination || ctx.destination);
      source.start(ctx.currentTime);
      return true;
    } catch {
      return false;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = muted ? 0 : 0.05;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private renderPop(ctx: BaseAudioContext, startTime: number, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, startTime);
    osc.frequency.exponentialRampToValueAtTime(840, startTime + 0.08);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.095);
  }

  private renderSnap(ctx: BaseAudioContext, startTime: number, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, startTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, startTime + 0.12); // G5

    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.14);
  }

  private renderStar(
    ctx: BaseAudioContext,
    startTime: number,
    destination: AudioNode,
    starIndex: number
  ): void {
    const freq = STAR_NOTES[((starIndex % STAR_NOTES.length) + STAR_NOTES.length) % STAR_NOTES.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.3);

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.405);
  }

  private renderVictory(ctx: BaseAudioContext, startTime: number, destination: AudioNode): void {
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [293.66, 369.99, 440.0], // D major
      [329.63, 415.3, 493.88], // E major
      [523.25, 659.25, 783.99, 1046.5], // C6 grand
    ];

    chords.forEach((chord, stepIndex) => {
      const stepTime = startTime + stepIndex * 0.16;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, stepTime);

        gain.gain.setValueAtTime(0.12, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.35);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(stepTime);
        osc.stop(stepTime + 0.36);
      });
    });
  }

  private renderLevelUpFanfare(
    ctx: BaseAudioContext,
    startTime: number,
    destination: AudioNode
  ): void {
    // Fast ascending celebratory notes: C4, E4, G4, C5, E5, G5, B5, C6
    const fanfareNotes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 987.77, 1046.5];

    fanfareNotes.forEach((freq, idx) => {
      const noteStart = startTime + idx * 0.07;
      const isLast = idx === fanfareNotes.length - 1;
      const duration = isLast ? 0.8 : 0.22;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isLast ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      const gainVal = isLast ? 0.3 : 0.18;
      gain.gain.setValueAtTime(gainVal, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(noteStart);
      osc.stop(noteStart + duration + 0.05);

      if (isLast) {
        const shimmerOsc = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.setValueAtTime(freq * 2, noteStart);
        shimmerGain.gain.setValueAtTime(0.12, noteStart);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration * 0.9);
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(destination);
        shimmerOsc.start(noteStart);
        shimmerOsc.stop(noteStart + duration);
      }
    });
  }

  private renderCountTick(
    ctx: BaseAudioContext,
    startTime: number,
    destination: AudioNode,
    freq: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.06, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  private renderOops(ctx: BaseAudioContext, startTime: number, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, startTime);
    osc.frequency.linearRampToValueAtTime(260, startTime + 0.15);
    osc.frequency.linearRampToValueAtTime(290, startTime + 0.3);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.33);
  }

  private renderLetterTone(
    ctx: BaseAudioContext,
    startTime: number,
    destination: AudioNode,
    letter: string
  ): void {
    const charCode = (letter || 'A').toUpperCase().charCodeAt(0);
    // Map A-Z (65-90) to musical frequencies from 320Hz to ~770Hz
    const offset = (((charCode - 65) % 26) + 26) % 26;
    const baseFreq = 320 + offset * 18;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.05, startTime + 0.2);

    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  }

  private renderBgmBeat(
    ctx: BaseAudioContext,
    startTime: number,
    destination: AudioNode,
    noteFreq: number
  ): void {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(noteFreq, startTime);

    noteGain.gain.setValueAtTime(0.08, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(noteGain);
    noteGain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + 0.35);
  }

  private renderCrunch(ctx: BaseAudioContext, startTime: number, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(60, startTime + 0.1);
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(startTime);
    osc.stop(startTime + 0.125);
  }

  private renderLaser(ctx: BaseAudioContext, startTime: number, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, startTime);
    osc.frequency.exponentialRampToValueAtTime(220, startTime + 0.15);
    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(startTime);
    osc.stop(startTime + 0.165);
  }

  private renderCoin(ctx: BaseAudioContext, startTime: number, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, startTime); // B5
    osc.frequency.setValueAtTime(1318.51, startTime + 0.08); // E6
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(startTime);
    osc.stop(startTime + 0.285);
  }

  /**
   * Quick cheerful pop sound for button clicks & item grabs
   */
  public playPop(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'pop')) {
      this.renderPop(ctx, ctx.currentTime, ctx.destination);
    }
  }

  /**
   * Crisp magnetic snap sound when item snaps to slot (threshold <= 35px)
   */
  public playSnap(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'snap')) {
      this.renderSnap(ctx, ctx.currentTime, ctx.destination);
    }
  }

  /**
   * Positive star reward chime
   */
  public playStar(starIndex: number = 0): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const normalizedIdx = ((starIndex % STAR_NOTES.length) + STAR_NOTES.length) % STAR_NOTES.length;
    if (!this.playCachedBuffer(ctx, `star_${normalizedIdx}`)) {
      this.renderStar(ctx, ctx.currentTime, ctx.destination, normalizedIdx);
    }
  }

  /**
   * Grand celebratory victory fanfare chord sequence
   */
  public playVictory(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'victory')) {
      this.renderVictory(ctx, ctx.currentTime, ctx.destination);
    }
  }

  /**
   * Triumphant Level-Up fanfare: rapid celebratory ascending arpeggio with rich harmonics
   */
  public playLevelUpFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'level_up_fanfare')) {
      this.renderLevelUpFanfare(ctx, ctx.currentTime, ctx.destination);
    }
  }

  /**
   * Snappy marimba tick for score counter rollup
   */
  public playCountTick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const pitchRate = 0.88 + Math.random() * 0.28;
    if (!this.playCachedBuffer(ctx, 'count_tick', undefined, pitchRate)) {
      this.renderCountTick(ctx, ctx.currentTime, ctx.destination, 600 + Math.random() * 200);
    }
  }

  /**
   * Non-punitive gentle "oops" audio cue (soft ascending wobble, friendly reminder)
   */
  public playOops(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'oops')) {
      this.renderOops(ctx, ctx.currentTime, ctx.destination);
    }
  }

  /**
   * Phonics letter tone synthesizer (clear resonant frequencies)
   */
  public playLetterTone(letter: string): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const normalized = (letter || 'A').trim().toUpperCase().charAt(0);
    const key = normalized >= 'A' && normalized <= 'Z' ? `letter_${normalized}` : '';

    if (!key || !this.playCachedBuffer(ctx, key)) {
      this.renderLetterTone(ctx, ctx.currentTime, ctx.destination, letter);
    }
  }

  /**
   * Friendly marimba-style background music loop for kids
   */
  public startKidBgm(): void {
    if (this.isMusicPlaying) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.musicGainNode = ctx.createGain();
    this.musicGainNode.gain.value = this.isMuted ? 0 : 0.05;
    this.musicGainNode.connect(ctx.destination);
    this.isMusicPlaying = true;

    let step = 0;

    const playBeat = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;
      const noteIdx = step % BGM_SCALE_NOTES.length;
      const noteFreq = BGM_SCALE_NOTES[noteIdx];
      step = (step + 1) % 16;

      if (step % 2 === 0) {
        if (!this.playCachedBuffer(this.ctx, `bgm_${noteIdx}`, this.musicGainNode)) {
          this.renderBgmBeat(this.ctx, this.ctx.currentTime, this.musicGainNode, noteFreq);
        }
      }
    };

    this.musicInterval = window.setInterval(playBeat, 280);
  }

  public playCorrect(): void {
    this.playStar(1);
  }

  public playCelebration(): void {
    this.playVictory();
  }

  public playError(): void {
    this.playOops();
  }

  public playCrunch(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'crunch')) {
      this.renderCrunch(ctx, ctx.currentTime, ctx.destination);
    }
  }

  public playLaser(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'laser')) {
      this.renderLaser(ctx, ctx.currentTime, ctx.destination);
    }
  }

  public playCoin(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.playCachedBuffer(ctx, 'coin')) {
      this.renderCoin(ctx, ctx.currentTime, ctx.destination);
    }
  }

  public stopKidBgm(): void {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const soundEngine = new SoundEngine();
