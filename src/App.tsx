/**
 * Wonder World Kids Learning
 * 100% Offline Educational Game Suite (Ages 3–10)
 *
 * Architecture:
 * - Offline Web Audio Synthesizer (Zero network requests, procedural sound)
 * - Dynamic Difficulty Engine (3-4 Easy, 5-7 Medium, 8-10 Hard)
 * - LocalStorage / Offline Persistence for 4 child profiles & stars
 * - COPPA Compliant Parent Gate
 * - 45 Mini-Games Matrix across 5 Thematic Worlds
 * - Production playable implementations: Dino Addition, Word Builder Bee, Continent Jigsaw, Shape Sorter
 */

import React, { useState, useEffect } from 'react';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';
import { WorldMap } from './components/WorldMap';
import { WorldDetailView } from './components/WorldDetailView';
import { DinoAdditionGame } from './games/DinoAdditionGame';
import { WordBuilderBee } from './games/WordBuilderBee';
import { ContinentJigsaw } from './games/ContinentJigsaw';
import { AnimalSoundMemory } from './games/AnimalSoundMemory';
import { ColorShadowMatch } from './games/ColorShadowMatch';
import { ShapeSorterGame } from './games/ShapeSorterGame';
import { UniversalMiniGameRunner } from './games/UniversalMiniGameRunner';
import { MINI_GAMES_MATRIX } from './data/gameMatrix';
import { ParentGateModal } from './components/ParentGateModal';
import { ParentDashboard } from './components/ParentDashboard';
import { GameDirectoryModal } from './components/GameDirectoryModal';
import { StickerBookModal } from './components/StickerBookModal';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { MobilePackagesModal } from './components/MobilePackagesModal';
import { storageService } from './services/storageService';
import { soundEngine } from './services/soundEngine';
import { ChildProfile } from './types/game';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'world_map' | 'world_detail' | 'game'>('world_map');
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world_math');
  const [selectedGameLevel, setSelectedGameLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeGameId, setActiveGameId] = useState<string>('game_dino_addition');

  // Active child profile state
  const [activeProfile, setActiveProfile] = useState<ChildProfile>(() => storageService.getActiveProfile());

  // Modal states
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.getMuted());

  // Refresh active profile whenever it changes
  const refreshActiveProfile = () => {
    setActiveProfile(storageService.getActiveProfile());
  };

  const handleLaunchGame = (gameId: string, level: number = 1) => {
    setActiveGameId(gameId);
    setSelectedGameLevel(Math.min(5, Math.max(1, level)) as 1 | 2 | 3 | 4 | 5);
    setCurrentView('game');
  };

  const handleNextGameSequence = () => {
    // Sequence through all 45 games in the educational matrix
    const allGameIds = MINI_GAMES_MATRIX.map(g => g.id);
    const currentIndex = allGameIds.indexOf(activeGameId);
    const nextGame = allGameIds[(currentIndex + 1) % allGameIds.length];
    setActiveGameId(nextGame);
    setSelectedGameLevel(1);
  };

  const handleSelectWorld = (worldId: string) => {
    soundEngine.playPop();
    setSelectedWorldId(worldId);
    setCurrentView('world_detail');
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    soundEngine.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <DeviceFrameWrapper
      onOpenParentGate={() => setIsParentGateOpen(true)}
      onOpenArchitecture={() => setIsArchitectureOpen(true)}
      onOpenDirectory={() => setIsDirectoryOpen(true)}
      onOpenApkModal={() => setIsApkModalOpen(true)}
      isMuted={isMuted}
      onToggleMute={toggleMute}
      childAvatar={activeProfile.avatar}
      childName={activeProfile.name}
      childAge={activeProfile.age}
    >
      {/* View routing: World Map vs World Detail & Levels vs Active Mini-Game */}
      {currentView === 'world_map' && (
        <WorldMap
          activeProfileId={activeProfile.id}
          onSelectWorld={handleSelectWorld}
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          onOpenStickerBook={() => setIsStickerBookOpen(true)}
        />
      )}

      {currentView === 'world_detail' && (
        <WorldDetailView
          worldId={selectedWorldId}
          activeProfileId={activeProfile.id}
          onBackToMap={() => setCurrentView('world_map')}
          onLaunchGameLevel={(gameId, level) => handleLaunchGame(gameId, level)}
        />
      )}

      {currentView === 'game' && (
        <div className="w-full h-full">
          {activeGameId === 'game_dino_addition' && (
            <DinoAdditionGame
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_word_builder_bee' && (
            <WordBuilderBee
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_continent_jigsaw' && (
            <ContinentJigsaw
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_animal_sound_memory' && (
            <AnimalSoundMemory
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_color_shadow_match' && (
            <ColorShadowMatch
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_shape_sorter_express' && (
            <ShapeSorterGame
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {/* Universal Runner handles all other 39 mini-games in the 45-game catalog */}
          {![
            'game_dino_addition',
            'game_word_builder_bee',
            'game_continent_jigsaw',
            'game_animal_sound_memory',
            'game_color_shadow_match',
            'game_shape_sorter_express'
          ].includes(activeGameId) && (
            <UniversalMiniGameRunner
              gameId={activeGameId}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onNextGame={handleNextGameSequence}
            />
          )}
        </div>
      )}

      {/* COPPA Parent Gate Modal */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onSuccess={() => {
          setIsParentGateOpen(false);
          setIsParentDashboardOpen(true);
        }}
        onCancel={() => setIsParentGateOpen(false)}
      />

      {/* Parent Dashboard & Offline Learning Analytics */}
      <ParentDashboard
        isOpen={isParentDashboardOpen}
        onClose={() => setIsParentDashboardOpen(false)}
        onProfileSwitched={refreshActiveProfile}
        onOpenApkBundle={() => {
          setIsParentDashboardOpen(false);
          setIsApkModalOpen(true);
        }}
      />

      {/* 45 Mini-Game Matrix Directory Modal */}
      <GameDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onLaunchGame={handleLaunchGame}
      />

      {/* Sticker Album Scrapbook Modal */}
      <StickerBookModal
        isOpen={isStickerBookOpen}
        activeProfileId={activeProfile.id}
        onClose={() => setIsStickerBookOpen(false)}
      />

      {/* Architecture & Code Blueprint Viewer Modal */}
      <ArchitectureViewer
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Mobile Packages Modal (Android APK & iOS IPA Bundles) */}
      <MobilePackagesModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </DeviceFrameWrapper>
  );
}
