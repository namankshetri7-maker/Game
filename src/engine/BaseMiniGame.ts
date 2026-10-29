/**
 * BaseMiniGame - Core Abstract Engine Framework
 * Universal Game Controller for all 45 Wonder World Kids Learning mini-games.
 *
 * Implements:
 * 1. Game State Management (INITIALIZING, PLAYING, PAUSED, LEVEL_COMPLETE, GAME_OVER)
 * 2. Dynamic Difficulty Engine (Easy 3-4, Medium 5-7, Hard 8-10)
 * 3. Universal Touch & Drag-and-drop with <=35px snap threshold and +20dp padding
 * 4. Audio Feedback Engine (Positive star pops, soft non-punitive oops, victory fanfare)
 * 5. Star calculation (1 to 3 stars based on attempts, accuracy, and age-adapted timing)
 */

import { AgeGroup, DifficultyLevel, GameProgress, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

export interface GameConfig {
  gameId: string;
  worldId: string;
  title: string;
  ageGroup: AgeGroup;
  snapThresholdPx?: number; // default <= 35px
  touchTargetPaddingDp?: number; // default +20dp
  maxAttemptsAllowed?: number;
}

export interface DifficultyParameters {
  level: DifficultyLevel;
  itemCount: number;
  showExplicitVisualHints: boolean;
  isTimed: boolean;
  timeLimitSeconds: number;
  hintCooldownSeconds: number;
}

export interface SnapTarget {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  acceptedItemId?: string;
  isOccupied?: boolean;
}

export interface DragItem {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  isSnapped: boolean;
  targetId?: string;
}

export abstract class BaseMiniGame<TGameData = unknown> {
  public config: GameConfig;
  public state: GameState = 'INITIALIZING';
  public difficulty: DifficultyParameters;
  public score: number = 0;
  public starsEarned: number = 0;
  public attempts: number = 0;
  public mistakes: number = 0;
  public startTime: number = 0;
  public elapsedTimeSeconds: number = 0;
  public earnedSticker: Sticker | null = null;
  public isNewHighScore: boolean = false;

  // Listeners for UI state binding
  protected stateChangeListeners: Array<(state: GameState) => void> = [];
  protected updateListeners: Array<() => void> = [];

  constructor(config: GameConfig) {
    this.config = {
      snapThresholdPx: 35,
      touchTargetPaddingDp: 20,
      maxAttemptsAllowed: 5,
      ...config
    };
    this.difficulty = this.calculateDifficulty(config.ageGroup);
  }

  // ================= 1. DYNAMIC DIFFICULTY ENGINE =================
  /**
   * Adapts item count, visual hints, and timing depending on age group:
   * - Easy (Ages 3-4): 3-4 items, large visual guides, explicit hints, no timer
   * - Medium (Ages 5-7): 5-7 items, moderate hints, optional star timer
   * - Hard (Ages 8-10): Advanced equations/vocabulary, minimal hints, precision scoring
   */
  public calculateDifficulty(ageGroup: AgeGroup): DifficultyParameters {
    switch (ageGroup) {
      case '3-4':
        return {
          level: 'EASY',
          itemCount: 3,
          showExplicitVisualHints: true,
          isTimed: false,
          timeLimitSeconds: 0,
          hintCooldownSeconds: 4
        };
      case '5-7':
        return {
          level: 'MEDIUM',
          itemCount: 5,
          showExplicitVisualHints: false,
          isTimed: true,
          timeLimitSeconds: 60,
          hintCooldownSeconds: 10
        };
      case '8-10':
      default:
        return {
          level: 'HARD',
          itemCount: 7,
          showExplicitVisualHints: false,
          isTimed: true,
          timeLimitSeconds: 45,
          hintCooldownSeconds: 18
        };
    }
  }

  // ================= 2. GAME STATE MANAGEMENT =================
  public initialize(): void {
    this.state = 'INITIALIZING';
    this.score = 0;
    this.starsEarned = 0;
    this.attempts = 0;
    this.mistakes = 0;
    this.elapsedTimeSeconds = 0;
    this.earnedSticker = null;
    this.isNewHighScore = false;
    this.onInit();
    this.notifyListeners();
  }

  public start(): void {
    this.state = 'PLAYING';
    this.startTime = Date.now();
    soundEngine.playPop();
    this.onStart();
    this.notifyStateChange('PLAYING');
    this.notifyListeners();
  }

  public pause(): void {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    soundEngine.playPop();
    this.onPause();
    this.notifyStateChange('PAUSED');
    this.notifyListeners();
  }

  public resume(): void {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    soundEngine.playPop();
    this.onResume();
    this.notifyStateChange('PLAYING');
    this.notifyListeners();
  }

  public restart(): void {
    soundEngine.playPop();
    this.initialize();
    this.start();
  }

  // ================= 3. TOUCH & PHYSICS HELPERS =================
  /**
   * Check if dragged item is within snap threshold (<= 35px) of target center
   * Automatically adds +20dp finger padding allowance for toddlers
   */
  public checkSnapThreshold(
    itemX: number,
    itemY: number,
    targetX: number,
    targetY: number,
    customSnapThreshold?: number
  ): boolean {
    const threshold = customSnapThreshold ?? (this.config.snapThresholdPx || 35);
    const padding = this.config.touchTargetPaddingDp || 20;
    const effectiveThreshold = threshold + (this.difficulty.level === 'EASY' ? padding : 0);

    const dx = itemX - targetX;
    const dy = itemY - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= effectiveThreshold;
  }

  /**
   * Handle correct item placement with audio feedback
   */
  public onValidDrop(): void {
    soundEngine.playSnap();
    this.score += 100;
    this.notifyListeners();
  }

  /**
   * Handle incorrect item placement with non-penalizing soft cue
   */
  public onInvalidDrop(): void {
    this.mistakes += 1;
    soundEngine.playOops();
    this.notifyListeners();
  }

  // ================= 4. WIN & EVALUATION LOGIC =================
  /**
   * Calculate 1 to 3 stars based on mistakes, age difficulty, and completion
   */
  public calculateStars(): number {
    if (this.difficulty.level === 'EASY') {
      // For ages 3-4, completion always awards positive reinforcement!
      if (this.mistakes <= 1) return 3;
      if (this.mistakes <= 3) return 2;
      return 1;
    } else if (this.difficulty.level === 'MEDIUM') {
      if (this.mistakes === 0) return 3;
      if (this.mistakes <= 2) return 2;
      return 1;
    } else {
      // Hard mode: high accuracy required for 3 stars
      if (this.mistakes === 0) return 3;
      if (this.mistakes === 1) return 2;
      return 1;
    }
  }

  /**
   * Complete the level, award stars, save offline progress, trigger confetti & fanfare
   */
  public completeLevel(activeProfileId: string): void {
    this.state = 'LEVEL_COMPLETE';
    this.elapsedTimeSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
    this.starsEarned = this.calculateStars();

    // Trigger celebratory Web Audio fanfare and star chime
    soundEngine.playVictory();
    soundEngine.playStar(this.starsEarned - 1);

    // Particle confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe fallback if canvas is unavailable
    }

    // Save offline progress to LocalStorage / SQLite repository
    const result = storageService.recordGameResult(
      activeProfileId,
      this.config.gameId,
      this.config.worldId,
      this.starsEarned,
      this.score,
      this.elapsedTimeSeconds,
      true
    );

    this.isNewHighScore = result.isNewRecord;

    // Check if a sticker was unlocked
    const unlockedStickers = storageService.getUnlockedStickers(activeProfileId);
    if (unlockedStickers.length > 0) {
      this.earnedSticker = unlockedStickers[unlockedStickers.length - 1];
    }

    this.onLevelComplete();
    this.notifyStateChange('LEVEL_COMPLETE');
    this.notifyListeners();
  }

  // ================= 5. OBSERVER PATTERNS =================
  public onStateChange(listener: (state: GameState) => void): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    };
  }

  public onUpdate(listener: () => void): () => void {
    this.updateListeners.push(listener);
    return () => {
      this.updateListeners = this.updateListeners.filter(l => l !== listener);
    };
  }

  protected notifyStateChange(state: GameState): void {
    this.stateChangeListeners.forEach(listener => listener(state));
  }

  protected notifyListeners(): void {
    this.updateListeners.forEach(listener => listener());
  }

  // Abstract lifecycle hooks for child mini-games
  protected abstract onInit(): void;
  protected abstract onStart(): void;
  protected abstract onPause(): void;
  protected abstract onResume(): void;
  protected abstract onLevelComplete(): void;
  public abstract getGamePayload(): TGameData;
}
