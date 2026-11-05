/**
 * 100% Offline Local Storage Service
 * Manages up to 4 child player profiles, star ratings, sticker unlocks,
 * daily time limits, and COPPA compliant offline analytics.
 * Works seamlessly with localStorage with zero network exposure.
 */

import { ChildProfile, GameProgress, Sticker, SubjectArea } from '../types/game';

const PROFILES_KEY = 'wonder_world_profiles_v1';
const ACTIVE_PROFILE_KEY = 'wonder_world_active_profile_id_v1';
const PROGRESS_KEY_PREFIX = 'wonder_world_progress_';
const STICKERS_KEY_PREFIX = 'wonder_world_stickers_';
const PARENT_SETTINGS_KEY = 'wonder_world_parent_settings_v1';

export const INITIAL_STICKERS: Sticker[] = [
  { id: 'stk_dino_star', name: 'Sunny Dino', worldId: 'world_math', icon: '🦕', rarity: 'common', description: 'Awarded for mastering Dino Addition!' },
  { id: 'stk_honey_bee', name: 'Busy Bee', worldId: 'world_phonics', icon: '🐝', rarity: 'common', description: 'Earned in Word Builder Bee!' },
  { id: 'stk_globe_trotter', name: 'World Voyager', worldId: 'world_geography', icon: '🌍', rarity: 'rare', description: 'Assembled the 7 continents!' },
  { id: 'stk_math_wizard', name: 'Math Magician', worldId: 'world_math', icon: '✨', rarity: 'rare', description: 'Completed 5 math challenges with 3 stars!' },
  { id: 'stk_tiger_roar', name: 'Jungle King', worldId: 'world_phonics', icon: '🐯', rarity: 'common', description: 'Explored English Jungle phonics sounds.' },
  { id: 'stk_dolphin_jump', name: 'Ocean Star', worldId: 'world_science', icon: '🐬', rarity: 'rare', description: 'Dove deep into animal habitats!' },
  { id: 'stk_rocket_ship', name: 'Galaxy Brain', worldId: 'world_logic', icon: '🚀', rarity: 'legendary', description: 'Solved advanced logic puzzles!' },
  { id: 'stk_golden_crown', name: 'Wonder Champion', worldId: 'world_math', icon: '👑', rarity: 'legendary', description: 'Reached 20 total stars across worlds!' }
];

export interface ParentSettings {
  soundVolume: number;
  musicEnabled: boolean;
  voicePromptsEnabled: boolean;
  screenTimeLockEnabled: boolean;
}

export const DEFAULT_PARENT_SETTINGS: ParentSettings = {
  soundVolume: 0.8,
  musicEnabled: true,
  voicePromptsEnabled: true,
  screenTimeLockEnabled: true
};

class StorageService {
  /**
   * Check if onboarding has been completed (at least one profile exists)
   */
  public hasCompletedOnboarding(): boolean {
    const profiles = this.getProfiles();
    return profiles.length > 0;
  }

  /**
   * Get all child profiles (max 4). Returns default starter profiles on clean install.
   */
  public getProfiles(): ChildProfile[] {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (!raw) {
        // Initialize with default starter profiles for immediate frictionless play
        const defaultProfiles: ChildProfile[] = [
          {
            id: 'child_leo',
            name: 'Leo',
            age: 5,
            ageGroup: '5-7',
            avatar: '🦁',
            createdAt: Date.now(),
            dailyTimeLimitMinutes: 45,
            todayPlayTimeSeconds: 0,
            totalPlayTimeSeconds: 0
          },
          {
            id: 'child_mia',
            name: 'Mia',
            age: 7,
            ageGroup: '5-7',
            avatar: '🐰',
            createdAt: Date.now(),
            dailyTimeLimitMinutes: 60,
            todayPlayTimeSeconds: 0,
            totalPlayTimeSeconds: 0
          }
        ];
        this.saveProfiles(defaultProfiles);
        return defaultProfiles;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [
          {
            id: 'child_leo',
            name: 'Leo',
            age: 5,
            ageGroup: '5-7',
            avatar: '🦁',
            createdAt: Date.now(),
            dailyTimeLimitMinutes: 45,
            todayPlayTimeSeconds: 0,
            totalPlayTimeSeconds: 0
          }
        ];
      }
      return parsed;
    } catch {
      return [];
    }
  }

  public saveProfiles(profiles: ChildProfile[]): void {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles.slice(0, 4)));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public getActiveProfileId(): string | null {
    try {
      const active = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (active) return active;
      const profiles = this.getProfiles();
      if (profiles.length > 0) {
        const id = profiles[0].id;
        this.setActiveProfileId(id);
        return id;
      }
      return null;
    } catch {
      return null;
    }
  }

  public setActiveProfileId(id: string): void {
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public getActiveProfile(): ChildProfile {
    const profiles = this.getProfiles();
    const activeId = this.getActiveProfileId();
    const match = profiles.find(p => p.id === activeId);
    if (match) return match;
    if (profiles.length > 0) return profiles[0];
    return {
      id: 'child_leo',
      name: 'Leo',
      age: 5,
      ageGroup: '5-7',
      avatar: '🦁',
      createdAt: Date.now(),
      dailyTimeLimitMinutes: 45,
      todayPlayTimeSeconds: 0,
      totalPlayTimeSeconds: 0
    };
  }

  public updateProfile(updated: ChildProfile): void {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex(p => p.id === updated.id);
    if (idx >= 0) {
      profiles[idx] = updated;
    } else if (profiles.length < 4) {
      profiles.push(updated);
    }
    this.saveProfiles(profiles);
  }

  public createProfile(profile: Omit<ChildProfile, 'id' | 'createdAt' | 'todayPlayTimeSeconds' | 'totalPlayTimeSeconds'>): ChildProfile | null {
    const profiles = this.getProfiles();
    if (profiles.length >= 4) return null;

    const newProfile: ChildProfile = {
      ...profile,
      id: `child_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      todayPlayTimeSeconds: 0,
      totalPlayTimeSeconds: 0
    };
    profiles.push(newProfile);
    this.saveProfiles(profiles);
    this.setActiveProfileId(newProfile.id);
    return newProfile;
  }

  public deleteProfile(profileId: string): void {
    let profiles = this.getProfiles();
    profiles = profiles.filter(p => p.id !== profileId);
    this.saveProfiles(profiles);
    
    // Clean up profile specific progress and stickers
    try {
      localStorage.removeItem(`${PROGRESS_KEY_PREFIX}${profileId}`);
      localStorage.removeItem(`${STICKERS_KEY_PREFIX}${profileId}`);
    } catch {}

    if (this.getActiveProfileId() === profileId) {
      if (profiles.length > 0) {
        this.setActiveProfileId(profiles[0].id);
      } else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    }
  }

  /**
   * Progress & Star storage per child
   */
  public getProgressList(profileId: string): GameProgress[] {
    try {
      const key = `${PROGRESS_KEY_PREFIX}${profileId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getGameProgress(profileId: string, gameId: string): GameProgress | null {
    const list = this.getProgressList(profileId);
    return list.find(p => p.gameId === gameId) || null;
  }

  public recordGameResult(
    profileId: string,
    gameId: string,
    worldId: string,
    stars: number,
    score: number,
    timeSpentSeconds: number,
    isSuccess: boolean
  ): { previousStars: number; newStars: number; isNewRecord: boolean } {
    const list = this.getProgressList(profileId);
    const existingIndex = list.findIndex(p => p.gameId === gameId);
    let previousStars = 0;
    let isNewRecord = false;

    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      previousStars = existing.stars;
      isNewRecord = stars > existing.stars;
      list[existingIndex] = {
        ...existing,
        stars: Math.max(existing.stars, stars),
        bestScore: Math.max(existing.bestScore, score),
        attemptsCount: existing.attemptsCount + 1,
        successCount: existing.successCount + (isSuccess ? 1 : 0),
        lastPlayedAt: Date.now(),
        timeSpentSeconds: existing.timeSpentSeconds + timeSpentSeconds
      };
    } else {
      previousStars = 0;
      isNewRecord = stars > 0;
      list.push({
        gameId,
        worldId,
        stars,
        bestScore: score,
        attemptsCount: 1,
        successCount: isSuccess ? 1 : 0,
        lastPlayedAt: Date.now(),
        timeSpentSeconds
      });
    }

    try {
      localStorage.setItem(`${PROGRESS_KEY_PREFIX}${profileId}`, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    // Add session play time to active child
    const profile = this.getActiveProfile();
    if (profile && profile.id === profileId) {
      profile.todayPlayTimeSeconds += timeSpentSeconds;
      profile.totalPlayTimeSeconds += timeSpentSeconds;
      this.updateProfile(profile);
    }

    // Auto unlock stickers based on milestones
    this.checkMilestoneStickers(profileId, list);

    return { previousStars, newStars: Math.max(previousStars, stars), isNewRecord };
  }

  /**
   * Stickers system
   */
  public getUnlockedStickers(profileId: string): Sticker[] {
    try {
      const key = `${STICKERS_KEY_PREFIX}${profileId}`;
      const raw = localStorage.getItem(key);
      if (!raw) {
        // Unlock first 2 stickers by default for new player
        const initial = INITIAL_STICKERS.slice(0, 2).map(s => ({ ...s, unlockedAt: Date.now() }));
        this.saveUnlockedStickers(profileId, initial);
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_STICKERS.slice(0, 2);
    }
  }

  public saveUnlockedStickers(profileId: string, stickers: Sticker[]): void {
    try {
      localStorage.setItem(`${STICKERS_KEY_PREFIX}${profileId}`, JSON.stringify(stickers));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public unlockSticker(profileId: string, stickerId: string): Sticker | null {
    const unlocked = this.getUnlockedStickers(profileId);
    if (unlocked.some(s => s.id === stickerId)) return null;

    const target = INITIAL_STICKERS.find(s => s.id === stickerId);
    if (!target) return null;

    const newSticker = { ...target, unlockedAt: Date.now() };
    unlocked.push(newSticker);
    this.saveUnlockedStickers(profileId, unlocked);
    return newSticker;
  }

  private checkMilestoneStickers(profileId: string, list: GameProgress[]): void {
    const totalStars = list.reduce((sum, item) => sum + item.stars, 0);
    if (totalStars >= 3) {
      this.unlockSticker(profileId, 'stk_dino_star');
    }
    if (totalStars >= 6) {
      this.unlockSticker(profileId, 'stk_honey_bee');
    }
    if (totalStars >= 10) {
      this.unlockSticker(profileId, 'stk_globe_trotter');
    }
    if (totalStars >= 15) {
      this.unlockSticker(profileId, 'stk_math_wizard');
    }
    if (totalStars >= 20) {
      this.unlockSticker(profileId, 'stk_golden_crown');
    }
  }

  /**
   * Parent Settings
   */
  public getParentSettings(): ParentSettings {
    try {
      const raw = localStorage.getItem(PARENT_SETTINGS_KEY);
      if (!raw) return DEFAULT_PARENT_SETTINGS;
      return { ...DEFAULT_PARENT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PARENT_SETTINGS;
    }
  }

  public saveParentSettings(settings: ParentSettings): void {
    try {
      localStorage.setItem(PARENT_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  /**
   * Calculate aggregated progress metrics for parent dashboard
   */
  public getAggregatedStats(profileId: string) {
    const foundProfile = this.getProfiles().find(p => p.id === profileId);
    const profile: ChildProfile = foundProfile || {
      id: profileId || 'guest',
      name: 'Explorer',
      age: 5,
      ageGroup: '5-7',
      avatar: '🦁',
      createdAt: Date.now(),
      dailyTimeLimitMinutes: 45,
      todayPlayTimeSeconds: 0,
      totalPlayTimeSeconds: 0
    };
    const progressList = this.getProgressList(profileId);
    const unlockedStickers = this.getUnlockedStickers(profileId);

    const totalStars = progressList.reduce((acc, curr) => acc + curr.stars, 0);
    const totalAttempts = progressList.reduce((acc, curr) => acc + curr.attemptsCount, 0);
    const totalSuccess = progressList.reduce((acc, curr) => acc + curr.successCount, 0);
    const accuracyPercent = totalAttempts > 0 ? Math.round((totalSuccess / totalAttempts) * 100) : 100;

    const subjectStats: Record<SubjectArea, { stars: number; gamesPlayed: number; timeSeconds: number }> = {
      math: { stars: 0, gamesPlayed: 0, timeSeconds: 0 },
      phonics: { stars: 0, gamesPlayed: 0, timeSeconds: 0 },
      geography: { stars: 0, gamesPlayed: 0, timeSeconds: 0 },
      science: { stars: 0, gamesPlayed: 0, timeSeconds: 0 },
      logic: { stars: 0, gamesPlayed: 0, timeSeconds: 0 }
    };

    progressList.forEach(p => {
      let subj: SubjectArea = 'math';
      if (p.worldId.includes('math')) subj = 'math';
      else if (p.worldId.includes('phonics')) subj = 'phonics';
      else if (p.worldId.includes('geography')) subj = 'geography';
      else if (p.worldId.includes('science')) subj = 'science';
      else if (p.worldId.includes('logic')) subj = 'logic';

      subjectStats[subj].stars += p.stars;
      subjectStats[subj].gamesPlayed += 1;
      subjectStats[subj].timeSeconds += p.timeSpentSeconds;
    });

    return {
      profile,
      totalStars,
      totalGamesPlayed: progressList.length,
      accuracyPercent,
      unlockedStickersCount: unlockedStickers.length,
      totalStickersCount: INITIAL_STICKERS.length,
      todayPlayTimeMinutes: profile ? Math.round(profile.todayPlayTimeSeconds / 60) : 0,
      totalPlayTimeMinutes: profile ? Math.round(profile.totalPlayTimeSeconds / 60) : 0,
      subjectStats
    };
  }

  public resetProfileProgress(profileId: string): void {
    try {
      localStorage.removeItem(`${PROGRESS_KEY_PREFIX}${profileId}`);
      localStorage.removeItem(`${STICKERS_KEY_PREFIX}${profileId}`);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  /**
   * Export all family data into a clean JSON string for local backup
   */
  public exportAllData(): string {
    const profiles = this.getProfiles();
    const progressMap: Record<string, GameProgress[]> = {};
    const stickersMap: Record<string, Sticker[]> = {};

    profiles.forEach(p => {
      progressMap[p.id] = this.getProgressList(p.id);
      stickersMap[p.id] = this.getUnlockedStickers(p.id);
    });

    const backup = {
      app: 'WonderWorldKids',
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      profiles,
      activeProfileId: this.getActiveProfileId(),
      progressMap,
      stickersMap,
      parentSettings: this.getParentSettings()
    };

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Import family data from a JSON backup string with validation
   */
  public importAllData(jsonStr: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid JSON file format.' };
      }
      if (!Array.isArray(data.profiles)) {
        return { success: false, error: 'Backup does not contain valid child profiles.' };
      }

      this.saveProfiles(data.profiles);
      if (data.activeProfileId) {
        this.setActiveProfileId(data.activeProfileId);
      } else if (data.profiles.length > 0) {
        this.setActiveProfileId(data.profiles[0].id);
      }

      if (data.progressMap && typeof data.progressMap === 'object') {
        Object.keys(data.progressMap).forEach(profileId => {
          try {
            localStorage.setItem(`${PROGRESS_KEY_PREFIX}${profileId}`, JSON.stringify(data.progressMap[profileId]));
          } catch {}
        });
      }

      if (data.stickersMap && typeof data.stickersMap === 'object') {
        Object.keys(data.stickersMap).forEach(profileId => {
          try {
            localStorage.setItem(`${STICKERS_KEY_PREFIX}${profileId}`, JSON.stringify(data.stickersMap[profileId]));
          } catch {}
        });
      }

      if (data.parentSettings) {
        this.saveParentSettings(data.parentSettings);
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: `Import failed: ${(err as Error)?.message || 'Invalid data'}` };
    }
  }

  /**
   * Factory reset all local storage data
   */
  public factoryReset(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('wonder_world_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Factory reset error:', e);
    }
  }
}

export const storageService = new StorageService();
