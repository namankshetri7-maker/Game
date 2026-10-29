/**
 * Wonder World Kids Learning - Core Domain Types
 * 100% Offline Educational Game Suite Architecture
 */

export type GameState = 'INITIALIZING' | 'PLAYING' | 'PAUSED' | 'LEVEL_COMPLETE' | 'GAME_OVER';

export type AgeGroup = '3-4' | '5-7' | '8-10';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type SubjectArea = 'math' | 'phonics' | 'geography' | 'science' | 'logic';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  avatar: string; // avatar identifier (e.g., 'lion', 'panda', 'fox', 'astronaut')
  createdAt: number;
  dailyTimeLimitMinutes: number; // default: 45 min
  todayPlayTimeSeconds: number;
  totalPlayTimeSeconds: number;
}

export interface GameProgress {
  gameId: string;
  worldId: string;
  level?: number;
  maxLevel?: number;
  stars: number; // 0 to 3
  bestScore: number;
  attemptsCount: number;
  successCount: number;
  lastPlayedAt: number;
  timeSpentSeconds: number;
}

export interface Sticker {
  id: string;
  name: string;
  worldId: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
  description: string;
  unlockedAt?: number;
}

export interface WorldMeta {
  id: string;
  subject: SubjectArea;
  title: string;
  subtitle: string;
  themeColor: string;
  bgGradient: string;
  icon: string;
  gameCount: number;
  description: string;
}

export interface MiniGameMeta {
  id: string;
  worldId: string;
  subject: SubjectArea;
  title: string;
  number: number;
  ageRecommendation: string;
  skills: string[];
  icon: string;
  playable: boolean;
}

export interface ParentGateChallenge {
  question: string;
  answer: string | number;
  type: 'math_spelled' | 'digits_challenge' | 'multiplication';
}

export interface DevicePreset {
  id: string;
  name: string;
  aspectRatio: string;
  ratioWidth: number;
  ratioHeight: number;
  deviceType: 'tablet_4_3' | 'tablet_16_10' | 'phone_16_9' | 'fullscreen';
}
