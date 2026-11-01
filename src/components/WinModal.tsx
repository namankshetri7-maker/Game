/**
 * Universal Win Modal / Celebration Overlay Adapter
 * Forwards to the rich visual CelebrationOverlay component with CSS animations,
 * sunburst rays, interactive party items, level-up banners, and rewarding audio.
 */

import React from 'react';
import { CelebrationOverlay, CelebrationOverlayProps } from './CelebrationOverlay';
import { Sticker } from '../types/game';

export interface WinModalProps {
  isOpen: boolean;
  stars: number; // 1 to 3
  score: number;
  timeSpentSeconds: number;
  stickerEarned?: Sticker | null;
  currentLevel?: number;
  gameTitle?: string;
  worldName?: string;
  onRestart: () => void;
  onNextLevel: () => void;
  onHome: () => void;
  onBackToWorld?: () => void;
}

export const WinModal: React.FC<WinModalProps> = (props) => {
  return <CelebrationOverlay {...props} />;
};

export { CelebrationOverlay };
