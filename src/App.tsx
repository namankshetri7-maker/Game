/**
 * Wonder World Kids Learning & Gaming Website Suite
 * 100% Offline Educational Game Suite (Ages 3–10) + Complete Multi-Page Website
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

// Website Pages
import { Navbar } from './components/website/Navbar';
import { Footer } from './components/website/Footer';
import { HomePage } from './components/website/HomePage';
import { ExploreWorldsPage } from './components/website/ExploreWorldsPage';
import { WorldDetailPage } from './components/website/WorldDetailPage';
import { FreeDemoPage } from './components/website/FreeDemoPage';
import { PricingPage } from './components/website/PricingPage';
import { PurchaseSuccessPage } from './components/website/PurchaseSuccessPage';
import { MyPurchasedGamesPage } from './components/website/MyPurchasedGamesPage';
import { DownloadInstructionsPage } from './components/website/DownloadInstructionsPage';
import { ParentInfoPage } from './components/website/ParentInfoPage';
import { PrivacyPolicyPage } from './components/website/PrivacyPolicyPage';
import { ContactSupportPage } from './components/website/ContactSupportPage';

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

import { ALLOWED_DEMO_GAMES, isGameAllowedInDemo, isLevelAllowedInDemo } from './data/demoConfig';
import { DemoLimitModal } from './components/DemoLimitModal';
import { DemoHeaderBar } from './components/DemoHeaderBar';

export type AppRoute =
  | 'home'
  | 'worlds'
  | 'world_detail'
  | 'demo'
  | 'pricing'
  | 'success'
  | 'my_games'
  | 'downloads'
  | 'parents'
  | 'about'
  | 'privacy'
  | 'contact'
  | 'world_map'
  | 'world_detail_game'
  | 'game';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world_math');
  const [selectedGameLevel, setSelectedGameLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeGameId, setActiveGameId] = useState<string>('game_dino_addition');
  
  // Check local purchase state on startup
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('wwk_purchased') !== 'true';
  });
  const [isDemoLimitOpen, setIsDemoLimitOpen] = useState<boolean>(false);

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

  const refreshActiveProfile = () => {
    setActiveProfile(storageService.getActiveProfile());
  };

  // Helper to launch game app (evaluates purchase status)
  const handleEnterGameApp = (targetRoute: AppRoute = 'world_map', worldId?: string) => {
    const hasPaid = localStorage.getItem('wwk_purchased') === 'true';
    setIsDemoMode(!hasPaid);
    if (worldId) setSelectedWorldId(worldId);
    setRoute(targetRoute);
  };

  const handleLaunchGame = (gameId: string, level: number = 1) => {
    // If in demo mode, restrict to 2 allowed demo games per world and level 1 & 2 only
    if (isDemoMode) {
      if (!isGameAllowedInDemo(gameId) || !isLevelAllowedInDemo(level)) {
        setIsDemoLimitOpen(true);
        return;
      }
    }

    const meta = MINI_GAMES_MATRIX.find(g => g.id === gameId);
    if (meta) {
      setSelectedWorldId(meta.worldId);
    }
    setActiveGameId(gameId);
    setSelectedGameLevel(Math.min(5, Math.max(1, level)) as 1 | 2 | 3 | 4 | 5);
    setRoute('game');
  };

  const handleLaunchDemoMode = (gameId: string = 'game_dino_addition') => {
    const hasPaid = localStorage.getItem('wwk_purchased') === 'true';
    setIsDemoMode(!hasPaid);
    if (!hasPaid && !isGameAllowedInDemo(gameId)) {
      setIsDemoLimitOpen(true);
      return;
    }
    setActiveGameId(gameId);
    setSelectedGameLevel(1);
    const meta = MINI_GAMES_MATRIX.find(g => g.id === gameId);
    if (meta) setSelectedWorldId(meta.worldId);
    setRoute('game');
  };

  const handleNextGameSequence = () => {
    if (isDemoMode) {
      if (selectedGameLevel === 1) {
        setSelectedGameLevel(2);
      } else {
        setIsDemoLimitOpen(true);
      }
      return;
    }

    const currentWorldGames = MINI_GAMES_MATRIX.filter(g => g.worldId === selectedWorldId);
    const currentIndex = currentWorldGames.findIndex(g => g.id === activeGameId);
    if (currentIndex !== -1 && currentIndex < currentWorldGames.length - 1) {
      setActiveGameId(currentWorldGames[currentIndex + 1].id);
      setSelectedGameLevel(1);
    } else {
      soundEngine.playVictory();
      setRoute('world_detail_game');
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    soundEngine.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  // Helper to determine if we are inside the interactive game app or website
  const isInGameApp = ['world_map', 'world_detail_game', 'game'].includes(route);

  return (
    <WorldThemeProvider>
      <ThemeSyncEffect worldId={selectedWorldId} />

      {isDemoMode && isInGameApp && (
        <DemoHeaderBar
          onReturnToWebsite={() => {
            setRoute('home');
          }}
          onUnlockFull={() => {
            setRoute('pricing');
          }}
        />
      )}

      {isInGameApp ? (
        <DeviceFrameWrapper
          currentView={route === 'world_map' ? 'world_map' : route === 'world_detail_game' ? 'world_detail' : 'game'}
          onNavigateHome={() => setRoute('world_map')}
          onNavigateWorld={() => setRoute('world_detail_game')}
          onOpenParentGate={() => setIsParentGateOpen(true)}
          onOpenDirectory={() => {
            if (isDemoMode) {
              setIsDemoLimitOpen(true);
            } else {
              setIsDirectoryOpen(true);
            }
          }}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          childAvatar={activeProfile.avatar}
          childName={activeProfile.name}
          childAge={activeProfile.age}
          isOnline={isOnline}
          isStandalone={isStandalone}
        >
          {route === 'world_map' && (
            <WorldMap
              activeProfileId={activeProfile.id}
              onSelectWorld={(wId) => {
                setSelectedWorldId(wId);
                setRoute('world_detail_game');
              }}
              onOpenDirectory={() => {
                if (isDemoMode) {
                  setIsDemoLimitOpen(true);
                  return;
                }
                setIsDirectoryOpen(true);
              }}
              onOpenStickerBook={() => {
                if (isDemoMode) {
                  setIsDemoLimitOpen(true);
                  return;
                }
                setIsStickerBookOpen(true);
              }}
            />
          )}

          {route === 'world_detail_game' && (
            <WorldDetailView
              worldId={selectedWorldId}
              activeProfileId={activeProfile.id}
              onBackToMap={() => setRoute('world_map')}
              onLaunchGameLevel={(gameId, level) => handleLaunchGame(gameId, level)}
              isDemoMode={isDemoMode}
              onShowDemoLimit={() => setIsDemoLimitOpen(true)}
            />
          )}

          {route === 'game' && (
            <div className="w-full h-full">
              {activeGameId === 'game_dino_addition' && (
                <DinoAdditionGame
                  key={`dino_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_map')}
                  onBackToWorld={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}

              {activeGameId === 'word_builder_bee' && (
                <WordBuilderBee
                  key={`wordbee_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_map')}
                  onBackToWorld={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}

              {activeGameId === 'game_word_builder_bee' && (
                <WordBuilderBee
                  key={`wordbee_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_map')}
                  onBackToWorld={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}

              {activeGameId === 'game_continent_jigsaw' && (
                <ContinentJigsaw
                  key={`jigsaw_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => setRoute('world_map')}
                  onBackToWorld={() => setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}

              {activeGameId === 'game_animal_sound_memory' && (
                <AnimalSoundMemory
                  key={`animalsound_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => setRoute('world_map')}
                  onBackToWorld={() => setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}

              {activeGameId === 'game_color_shadow_match' && (
                <ColorShadowMatch
                  key={`colorshadow_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => setRoute('world_map')}
                  onBackToWorld={() => setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}

              {activeGameId === 'game_shape_sorter_express' && (
                <ShapeSorterGame
                  key={`shapesorter_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_map')}
                  onBackToWorld={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}

              {![
                'game_dino_addition',
                'game_word_builder_bee',
                'word_builder_bee',
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
                  onHome={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_map')}
                  onBackToWorld={() => isDemoMode ? setIsDemoLimitOpen(true) : setRoute('world_detail_game')}
                  onNextGame={handleNextGameSequence}
                />
              )}
            </div>
          )}
        </DeviceFrameWrapper>
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
          <Navbar
            currentRoute={route}
            onNavigate={(newRoute) => setRoute(newRoute as AppRoute)}
            onEnterGame={() => handleEnterGameApp('world_map')}
          />

          <main className="flex-1">
            {route === 'home' && (
              <HomePage
                onNavigate={(r, wId) => {
                  if (wId) setSelectedWorldId(wId);
                  setRoute(r as AppRoute);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'worlds' && (
              <ExploreWorldsPage
                onNavigate={(r, wId) => {
                  if (wId) setSelectedWorldId(wId);
                  setRoute(r as AppRoute);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'world_detail' && (
              <WorldDetailPage
                worldId={selectedWorldId}
                onNavigate={(r, wId) => {
                  if (wId) setSelectedWorldId(wId);
                  setRoute(r as AppRoute);
                }}
                onEnterGame={() => handleEnterGameApp('world_detail_game', selectedWorldId)}
              />
            )}
            {route === 'demo' && (
              <FreeDemoPage
                onEnterGame={() => handleEnterGameApp('world_map')}
                onLaunchDemoGame={(gameId) => handleLaunchDemoMode(gameId)}
                onNavigate={(r) => setRoute(r as AppRoute)}
              />
            )}
            {route === 'pricing' && (
              <PricingPage
                onNavigate={(r) => setRoute(r as AppRoute)}
                onUnlockSuccess={() => {
                  setIsDemoMode(false);
                }}
              />
            )}
            {route === 'success' && (
              <PurchaseSuccessPage
                onNavigate={(r) => setRoute(r as AppRoute)}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'my_games' && (
              <MyPurchasedGamesPage
                onNavigate={(r) => setRoute(r as AppRoute)}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'downloads' && (
              <DownloadInstructionsPage
                onNavigate={(r) => setRoute(r as AppRoute)}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'parents' && (
              <ParentInfoPage
                onNavigate={(r) => setRoute(r as AppRoute)}
              />
            )}
            {route === 'about' && (
              <HomePage
                onNavigate={(r, wId) => {
                  if (wId) setSelectedWorldId(wId);
                  setRoute(r as AppRoute);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'privacy' && (
              <PrivacyPolicyPage
                onNavigate={(r) => setRoute(r as AppRoute)}
              />
            )}
            {route === 'contact' && (
              <ContactSupportPage
                onNavigate={(r) => setRoute(r as AppRoute)}
              />
            )}
          </main>

          <Footer onNavigate={(r) => setRoute(r as AppRoute)} />
        </div>
      )}

      {/* Modals */}
      <DemoLimitModal
        isOpen={isDemoLimitOpen}
        onClose={() => setIsDemoLimitOpen(false)}
        onUnlockFull={() => {
          setIsDemoLimitOpen(false);
          setIsDemoMode(false);
          setRoute('pricing');
        }}
        onReturnToWebsite={() => {
          setIsDemoLimitOpen(false);
          setIsDemoMode(false);
          setRoute('home');
        }}
      />

      <ParentGateModal
        isOpen={isParentGateOpen}
        onSuccess={() => {
          setIsParentGateOpen(false);
          setIsParentDashboardOpen(true);
        }}
        onCancel={() => setIsParentGateOpen(false)}
      />

      <ParentDashboard
        isOpen={isParentDashboardOpen}
        onClose={() => setIsParentDashboardOpen(false)}
        onProfileSwitched={refreshActiveProfile}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      <GameDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onLaunchGame={handleLaunchGame}
      />

      <StickerBookModal
        isOpen={isStickerBookOpen}
        activeProfileId={activeProfile.id}
        onClose={() => setIsStickerBookOpen(false)}
      />

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
