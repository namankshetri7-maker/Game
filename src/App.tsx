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
import { PWAInstallModal } from './components/PWAInstallModal';
import { usePWA } from './hooks/usePWA';
import { storageService } from './services/storageService';
import { soundEngine } from './services/soundEngine';
import { ChildProfile } from './types/game';
import { WorldThemeProvider, useWorldTheme, WorldThemeId } from './services/WorldThemeContext';

const ThemeSyncEffect: React.FC<{ worldId: string }> = ({ worldId }) => {
  const { setTheme } = useWorldTheme();
  useEffect(() => {
    if (worldId) {
      setTheme(worldId as WorldThemeId);
    }
  }, [worldId, setTheme]);
  return null;
};

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
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // PWA Offline and Install Hook
  const {
    isOnline,
    isStandalone,
    canInstallPrompt,
    isIOS,
    isAndroid,
    promptInstall,
    showIOSInstructions,
    closeIOSInstructions,
  } = usePWA();

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.getMuted());

  // Refresh active profile whenever it changes
  const refreshActiveProfile = () => {
    setActiveProfile(storageService.getActiveProfile());
  };

  const handleLaunchGame = (gameId: string, level: number = 1) => {
    const meta = MINI_GAMES_MATRIX.find(g => g.id === gameId);
    if (meta) {
      setSelectedWorldId(meta.worldId);
    }
    setActiveGameId(gameId);
    setSelectedGameLevel(Math.min(5, Math.max(1, level)) as 1 | 2 | 3 | 4 | 5);
    setCurrentView('game');
  };

  const handleNextGameSequence = () => {
    // Move to the next game in the active thematic world
    const currentWorldGames = MINI_GAMES_MATRIX.filter(g => g.worldId === selectedWorldId);
    const currentIndex = currentWorldGames.findIndex(g => g.id === activeGameId);
    if (currentIndex !== -1 && currentIndex < currentWorldGames.length - 1) {
      setActiveGameId(currentWorldGames[currentIndex + 1].id);
      setSelectedGameLevel(1);
    } else {
      // Completed all games in this world! Return to island levels view
      soundEngine.playVictory();
      setCurrentView('world_detail');
    }
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
    <WorldThemeProvider>
      <ThemeSyncEffect worldId={selectedWorldId} />
      <DeviceFrameWrapper
        currentView={currentView}
        onNavigateHome={() => setCurrentView('world_map')}
        onNavigateWorld={() => setCurrentView('world_detail')}
        onOpenParentGate={() => setIsParentGateOpen(true)}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        childAvatar={activeProfile.avatar}
        childName={activeProfile.name}
        childAge={activeProfile.age}
        isOnline={isOnline}
        isStandalone={isStandalone}
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
              key={`dino_${selectedGameLevel}`}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onBackToWorld={() => setCurrentView('world_detail')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_word_builder_bee' && (
            <WordBuilderBee
              key={`wordbee_${selectedGameLevel}`}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onBackToWorld={() => setCurrentView('world_detail')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_continent_jigsaw' && (
            <ContinentJigsaw
              key={`jigsaw_${selectedGameLevel}`}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onBackToWorld={() => setCurrentView('world_detail')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_animal_sound_memory' && (
            <AnimalSoundMemory
              key={`animalsound_${selectedGameLevel}`}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onBackToWorld={() => setCurrentView('world_detail')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_color_shadow_match' && (
            <ColorShadowMatch
              key={`colorshadow_${selectedGameLevel}`}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onBackToWorld={() => setCurrentView('world_detail')}
              onNextGame={handleNextGameSequence}
            />
          )}

          {activeGameId === 'game_shape_sorter_express' && (
            <ShapeSorterGame
              key={`shapesorter_${selectedGameLevel}`}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onBackToWorld={() => setCurrentView('world_detail')}
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
              key={`${activeGameId}_${selectedGameLevel}`}
              gameId={activeGameId}
              ageGroup={activeProfile.ageGroup}
              activeProfileId={activeProfile.id}
              initialLevel={selectedGameLevel}
              onHome={() => setCurrentView('world_map')}
              onBackToWorld={() => setCurrentView('world_detail')}
              onNextGame={handleNextGameSequence}
            />
          )}
        </div>
      )}
    </DeviceFrameWrapper>

    {/* COPPA Parent Gate Modal (Rendered at root for true z-[100] viewport positioning) */}
    <ParentGateModal
      isOpen={isParentGateOpen}
      onSuccess={() => {
        setIsParentGateOpen(false);
        setIsParentDashboardOpen(true);
      }}
      onCancel={() => setIsParentGateOpen(false)}
    />

    {/* Parent Dashboard & Learning Analytics (Rendered at root for true z-[100] viewport positioning) */}
    <ParentDashboard
      isOpen={isParentDashboardOpen}
      onClose={() => setIsParentDashboardOpen(false)}
      onProfileSwitched={refreshActiveProfile}
      onOpenInstallModal={() => setIsInstallModalOpen(true)}
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

    {/* PWA Offline & Install Guide Modal (Android & iOS) */}
    <PWAInstallModal
      isOpen={isInstallModalOpen || showIOSInstructions}
      onClose={() => {
        setIsInstallModalOpen(false);
        closeIOSInstructions();
      }}
      onNativeInstall={promptInstall}
      canInstallNative={canInstallPrompt}
      isIOS={isIOS}
      isAndroid={isAndroid}
      isStandalone={isStandalone}
    />
    </WorldThemeProvider>
  );
}
