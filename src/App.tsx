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
import { FAQPage } from './components/website/FAQPage';
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
import { LicenseVerificationModal } from './components/LicenseVerificationModal';
import { licenseService } from './services/licenseService';
import { applyRouteSEO, getRoutePath } from './services/seoManager';

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
  | 'faq'
  | 'world_map'
  | 'world_detail_game'
  | 'game';

function parseInitialLocation(): { route: AppRoute; worldId: string; openUnlockModal: boolean } {
  const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();
  const pageParam = (params.get('page') || params.get('mode') || '').toLowerCase();
  let worldId = params.get('world') || 'world_math';

  // Clean multi-page URL path resolution (for Google indexing & direct links)
  if (pathname.startsWith('/worlds/')) {
    const slug = pathname.split('/')[2] || 'world_math';
    return { route: 'world_detail', worldId: slug, openUnlockModal: false };
  }
  if (pathname === '/worlds') return { route: 'worlds', worldId, openUnlockModal: false };
  if (pathname === '/demo') return { route: 'demo', worldId, openUnlockModal: false };
  if (pathname === '/pricing') return { route: 'pricing', worldId, openUnlockModal: false };
  if (pathname === '/downloads') return { route: 'downloads', worldId, openUnlockModal: false };
  if (pathname === '/parents') return { route: 'parents', worldId, openUnlockModal: false };
  if (pathname === '/about') return { route: 'about', worldId, openUnlockModal: false };
  if (pathname === '/faq') return { route: 'faq', worldId, openUnlockModal: false };
  if (pathname === '/privacy') return { route: 'privacy', worldId, openUnlockModal: false };
  if (pathname === '/contact') return { route: 'contact', worldId, openUnlockModal: false };
  if (pathname === '/my-games') return { route: 'my_games', worldId, openUnlockModal: false };
  if (pathname === '/success') return { route: 'success', worldId, openUnlockModal: false };
  if (pathname === '/activate') return { route: 'pricing', worldId, openUnlockModal: true };

  // Legacy query-param / hash fallbacks
  if (pageParam === 'worlds' || hash.includes('worlds')) return { route: 'worlds', worldId, openUnlockModal: false };
  if (pageParam === 'world_detail' || hash.includes('world_detail')) return { route: 'world_detail', worldId, openUnlockModal: false };
  if (pageParam === 'demo' || hash.includes('demo')) return { route: 'demo', worldId, openUnlockModal: false };
  if (pageParam === 'pricing' || hash.includes('pricing') || hash.includes('buy')) return { route: 'pricing', worldId, openUnlockModal: false };
  if (pageParam === 'downloads' || hash.includes('downloads') || hash.includes('install')) return { route: 'downloads', worldId, openUnlockModal: false };
  if (pageParam === 'parents' || hash.includes('parents')) return { route: 'parents', worldId, openUnlockModal: false };
  if (pageParam === 'about' || hash.includes('about')) return { route: 'about', worldId, openUnlockModal: false };
  if (pageParam === 'faq' || hash.includes('faq')) return { route: 'faq', worldId, openUnlockModal: false };
  if (pageParam === 'privacy' || hash.includes('privacy')) return { route: 'privacy', worldId, openUnlockModal: false };
  if (pageParam === 'contact' || hash.includes('contact')) return { route: 'contact', worldId, openUnlockModal: false };
  if (pageParam === 'my_games' || hash.includes('my_games')) return { route: 'my_games', worldId, openUnlockModal: false };
  if (pageParam === 'success' || hash.includes('success')) return { route: 'success', worldId, openUnlockModal: false };

  const isDirectGame = params.get('mode') === 'game' || params.get('play') === 'true' || hash.includes('game') || hash.includes('play');
  const isStandalonePWA =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)')?.matches ||
      (window.navigator as Navigator & { standalone?: boolean })?.standalone === true);

  if (isDirectGame || isStandalonePWA) {
    return { route: 'world_map', worldId, openUnlockModal: false };
  }

  return { route: 'home', worldId, openUnlockModal: false };
}

export default function App() {
  const initialLocation = parseInitialLocation();
  const [route, setRoute] = useState<AppRoute>(initialLocation.route);
  const [selectedWorldId, setSelectedWorldId] = useState<string>(initialLocation.worldId);
  const [selectedGameLevel, setSelectedGameLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeGameId, setActiveGameId] = useState<string>('game_dino_addition');
  
  // Purchase state: Unlocked ONLY with verified activation key or Gumroad license
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => !licenseService.isUnlocked());
  const [isDemoLimitOpen, setIsDemoLimitOpen] = useState<boolean>(false);

  // Active child profile state
  const [activeProfile, setActiveProfile] = useState<ChildProfile>(() => storageService.getActiveProfile());

  // Modal states
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(initialLocation.openUnlockModal);

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

  /**
   * Multi-page URL Navigation helper synced with History API
   */
  const navigateTo = (targetRoute: AppRoute, worldId?: string) => {
    const resolvedWorld = worldId || selectedWorldId;
    if (worldId) setSelectedWorldId(worldId);
    setRoute(targetRoute);

    if (!['world_map', 'world_detail_game', 'game'].includes(targetRoute)) {
      const targetPath = getRoutePath(targetRoute, resolvedWorld);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ route: targetRoute, worldId: resolvedWorld }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Browser Back/Forward button synchronization
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseInitialLocation();
      setSelectedWorldId(parsed.worldId);
      setRoute(parsed.route);
      if (parsed.openUnlockModal) setIsLicenseModalOpen(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * DIRECT ACCESS & LICENSE UNLOCKING
   * Detects URL parameters like ?license=XXXX or ?unlock=true or ?mode=game or /activate
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    const licenseParam = params.get('license');
    const directGameMode = params.get('mode') === 'game' || params.get('play') === 'true' || hash.includes('game') || hash.includes('play');
    const pageParam = (params.get('page') || params.get('mode') || '').toLowerCase();

    const wantsUnlockModal =
      pathname === '/activate' ||
      pageParam === 'activate' ||
      params.get('unlock') === 'true' ||
      (params.has('license') && !licenseParam) ||
      hash.includes('activate') ||
      hash.includes('unlock');

    if (wantsUnlockModal) {
      setIsLicenseModalOpen(true);
      return;
    }

    if (pageParam === 'my_games' || hash.includes('my_games')) {
      setRoute('my_games');
      return;
    }

    // Auto-verify License Key from URL if provided (?license=XXXXX)
    if (licenseParam) {
      licenseService.verifyGumroadLicense(licenseParam).then((res) => {
        if (res.success) {
          setIsDemoMode(false);
          setRoute('world_map');
          soundEngine.playVictory();
        } else {
          setIsLicenseModalOpen(true);
        }
      });
      return;
    }

    if (directGameMode) {
      localStorage.setItem('wwk_view_preference', 'app_only');
      setRoute('world_map');
    }
  }, []);

  // Dynamic Page Title, Meta Description, OpenGraph & JSON-LD Sync
  useEffect(() => {
    applyRouteSEO(route, selectedWorldId);
  }, [route, selectedWorldId]);

  const refreshActiveProfile = () => {
    setActiveProfile(storageService.getActiveProfile());
  };

  /**
   * NUCLEAR RESET: Strictly clears all internal play state.
   * Called when exiting a demo or returning to the website home to ensure
   * no accidental entry or state-leak into the premium game suite.
   */
  const resetAppPlayState = () => {
    setActiveGameId('game_dino_addition');
    setSelectedGameLevel(1);
    setSelectedWorldId('world_math');
    setIsDemoLimitOpen(false);
    setIsDirectoryOpen(false);
    setIsStickerBookOpen(false);
    setIsParentGateOpen(false);
    setIsParentDashboardOpen(false);
  };

  // Helper to launch game app (evaluates purchase status)
  const handleEnterGameApp = (targetRoute: AppRoute = 'world_map', worldId?: string) => {
    const hasPaid = localStorage.getItem('wwk_purchased') === 'true';
    setIsDemoMode(!hasPaid);
    
    // Always allow entry to maps/games, but the Demo Mode state handles the gating.
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

  // Centralized Navigation Guard
  const handleNavigation = (targetRoute: AppRoute, worldId?: string) => {
    const hasPaid = localStorage.getItem('wwk_purchased') === 'true';
    
    // In demo mode, any attempt to go "back" or "home" from within the app must lead to the website home.
    // If target is world_map or world_detail_game and NOT paid, it's effectively a "back to app entry" action.
    // However, the user specifically wants "Back" to go to the Website Home.
    
    if (worldId) setSelectedWorldId(worldId);
    setRoute(targetRoute);
  };

  const handleBackToWebsite = () => {
    try {
      localStorage.removeItem('wwk_view_preference');
    } catch {
      // Ignore storage errors
    }
    resetAppPlayState();
    navigateTo('home');
  };

  const handleBackAction = (isHomeAction: boolean = false) => {
    const isAppOnly = localStorage.getItem('wwk_view_preference') === 'app_only';

    // In demo mode (unless standalone/app-only), home action returns to website; otherwise navigate inside the game hub
    if (isDemoMode && !isAppOnly && isHomeAction) {
      handleBackToWebsite();
    } else {
      setRoute(isHomeAction ? 'world_map' : 'world_detail_game');
    }
  };

  // Helper to determine if we are inside the interactive game app or website
  const isInGameApp = ['world_map', 'world_detail_game', 'game'].includes(route);

  // Centralized Navigation Guard for Demo State Separation
  useEffect(() => {
    const hasPaid = localStorage.getItem('wwk_purchased') === 'true';
    
    // Strictly keep isDemoMode state in sync with license status
    if (isDemoMode === hasPaid) {
      setIsDemoMode(!hasPaid);
    }
    
    // Safety redirect: If someone somehow lands on a game route while having paid=false and it's NOT a demo action,
    // (This is a fallback, but the explicit back buttons are the primary fix).
  }, [route, isInGameApp, isDemoMode]);

  return (
    <WorldThemeProvider>
      <ThemeSyncEffect worldId={selectedWorldId} />

      {isDemoMode && isInGameApp && (
        <DemoHeaderBar
          onReturnToWebsite={handleBackToWebsite}
          onUnlockFull={() => navigateTo('pricing')}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
        />
      )}

      {isInGameApp ? (
        <DeviceFrameWrapper
          currentView={route === 'world_map' ? 'world_map' : route === 'world_detail_game' ? 'world_detail' : 'game'}
          onNavigateHome={() => handleBackAction(true)}
          onNavigateWorld={() => handleBackAction(false)}
          onReturnToWebsite={handleBackToWebsite}
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
          isDemoMode={isDemoMode}
        >
          {route === 'world_map' && (
            <WorldMap
              activeProfileId={activeProfile.id}
              onSelectWorld={(wId) => {
                setSelectedWorldId(wId);
                setRoute('world_detail_game');
              }}
              onOpenDirectory={() => {
                const hasPaid = localStorage.getItem('wwk_purchased') === 'true';
                if (!hasPaid) {
                  setIsDemoLimitOpen(true);
                } else {
                  setIsDirectoryOpen(true);
                }
              }}
              onOpenStickerBook={() => {
                const hasPaid = localStorage.getItem('wwk_purchased') === 'true';
                if (!hasPaid) {
                  setIsDemoLimitOpen(true);
                } else {
                  setIsStickerBookOpen(true);
                }
              }}
            />
          )}

          {route === 'world_detail_game' && (
            <WorldDetailView
              worldId={selectedWorldId}
              activeProfileId={activeProfile.id}
              onBackToMap={() => handleBackAction(true)}
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
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  isDemoMode={isDemoMode}
                />
              )}

              {activeGameId === 'word_builder_bee' && (
                <WordBuilderBee
                  key={`wordbee_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  isDemoMode={isDemoMode}
                />
              )}

              {activeGameId === 'game_word_builder_bee' && (
                <WordBuilderBee
                  key={`wordbee_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  isDemoMode={isDemoMode}
                />
              )}

              {activeGameId === 'game_continent_jigsaw' && (
                <ContinentJigsaw
                  key={`jigsaw_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  isDemoMode={isDemoMode}
                />
              )}

              {activeGameId === 'game_animal_sound_memory' && (
                <AnimalSoundMemory
                  key={`animalsound_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  isDemoMode={isDemoMode}
                />
              )}

              {activeGameId === 'game_color_shadow_match' && (
                <ColorShadowMatch
                  key={`colorshadow_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  isDemoMode={isDemoMode}
                />
              )}

              {activeGameId === 'game_shape_sorter_express' && (
                <ShapeSorterGame
                  key={`shapesorter_${selectedGameLevel}`}
                  ageGroup={activeProfile.ageGroup}
                  activeProfileId={activeProfile.id}
                  initialLevel={selectedGameLevel}
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  isDemoMode={isDemoMode}
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
                  onHome={() => handleBackAction(true)}
                  onBackToWorld={() => handleBackAction(false)}
                  onNextGame={handleNextGameSequence}
                  onGetFullVersion={() => navigateTo('pricing')}
                  onOpenKeyModal={() => setIsLicenseModalOpen(true)}
                  isDemoMode={isDemoMode}
                />
              )}
            </div>
          )}
        </DeviceFrameWrapper>
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
          <Navbar
            currentRoute={route}
            onNavigate={(newRoute) => navigateTo(newRoute as AppRoute)}
            onEnterGame={() => handleEnterGameApp('world_map')}
          />

          <main className="flex-1">
            {route === 'home' && (
              <HomePage
                onNavigate={(r, wId) => navigateTo(r as AppRoute, wId)}
                onEnterGame={() => handleEnterGameApp('world_map')}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              />
            )}
            {route === 'worlds' && (
              <ExploreWorldsPage
                onNavigate={(r, wId) => navigateTo(r as AppRoute, wId)}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'world_detail' && (
              <WorldDetailPage
                worldId={selectedWorldId}
                onNavigate={(r, wId) => navigateTo(r as AppRoute, wId)}
                onEnterGame={() => handleEnterGameApp('world_detail_game', selectedWorldId)}
              />
            )}
            {route === 'demo' && (
              <FreeDemoPage
                onEnterGame={() => handleEnterGameApp('world_map')}
                onLaunchDemoGame={(gameId) => handleLaunchDemoMode(gameId)}
                onNavigate={(r) => {
                  if (r === 'home') handleBackToWebsite();
                  else navigateTo(r as AppRoute);
                }}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              />
            )}
            {route === 'pricing' && (
              <PricingPage
                onNavigate={(r) => navigateTo(r as AppRoute)}
                onUnlockSuccess={() => {
                  setIsDemoMode(false);
                }}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              />
            )}
            {route === 'success' && (
              <PurchaseSuccessPage
                onNavigate={(r) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'my_games' && (
              <MyPurchasedGamesPage
                onNavigate={(r) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'downloads' && (
              <DownloadInstructionsPage
                onNavigate={(r) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
              />
            )}
            {route === 'parents' && (
              <ParentInfoPage
                onNavigate={(r) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute);
                }}
              />
            )}
            {route === 'about' && (
              <HomePage
                onNavigate={(r, wId) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute, wId);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
              />
            )}
            {route === 'faq' && (
              <FAQPage onNavigate={(r) => {
                resetAppPlayState();
                navigateTo(r as AppRoute);
              }} />
            )}
            {route === 'privacy' && (
              <PrivacyPolicyPage
                onNavigate={(r) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute);
                }}
              />
            )}
            {route === 'contact' && (
              <ContactSupportPage
                onNavigate={(r) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute);
                }}
              />
            )}
          </main>

          <Footer onNavigate={(r) => navigateTo(r as AppRoute)} />
        </div>
      )}

      {/* Modals */}
      <DemoLimitModal
        isOpen={isDemoLimitOpen}
        onClose={() => setIsDemoLimitOpen(false)}
        onUnlockFull={() => {
          setIsDemoLimitOpen(false);
          navigateTo('pricing');
        }}
        onReturnToWebsite={() => {
          setIsDemoLimitOpen(false);
          navigateTo('home');
        }}
        onOpenLicenseModal={() => {
          setIsDemoLimitOpen(false);
          setIsLicenseModalOpen(true);
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
        onNativeInstall={promptInstall}
        canNativeInstall={canInstallPrompt}
      />

      <GameDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onLaunchGame={handleLaunchGame}
        isDemoMode={isDemoMode}
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
        isUnlocked={!isDemoMode}
        onOpenLicenseModal={() => {
          setIsInstallModalOpen(false);
          closeIOSInstructions();
          setIsLicenseModalOpen(true);
        }}
      />

      <LicenseVerificationModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        onSuccess={() => {
          setIsLicenseModalOpen(false);
          setIsDemoMode(false);
          setRoute('world_map');
        }}
      />
    </WorldThemeProvider>
  );
}
