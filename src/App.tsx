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
import { StorePage } from './components/website/StorePage';
import { AboutPage } from './components/website/AboutPage';
import { ProductDetailPage } from './components/website/ProductDetailPage';
import { StoreCartDrawer } from './components/website/StoreCartDrawer';
import { StoreProductManagerModal } from './components/website/StoreProductManagerModal';
import {
  StoreProduct,
  getStoreProducts,
  upsertStoreProduct,
  toggleStoreProductStatus,
  deleteCustomStoreProduct,
  resetStoreCatalog,
  getSavedBagIds,
  saveBagIds,
} from './data/storeCatalog';

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
  | 'store'
  | 'store_product'
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

function parseInitialLocation(): {
  route: AppRoute;
  worldId: string;
  productSlug: string;
  openUnlockModal: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      route: 'home',
      worldId: 'world_math',
      productSlug: 'wonder-world-kids-learning-app',
      openUnlockModal: false,
    };
  }
  const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();
  const pageParam = (params.get('page') || params.get('mode') || '').toLowerCase();
  const worldId = params.get('world') || 'world_math';
  const productSlug = params.get('product') || 'wonder-world-kids-learning-app';

  // Clean multi-page URL path resolution (for Google indexing & direct links)
  if (pathname.startsWith('/worlds/')) {
    const slug = pathname.split('/')[2] || 'world_math';
    return { route: 'world_detail', worldId: slug, productSlug, openUnlockModal: false };
  }
  if (pathname.startsWith('/store/')) {
    const slug = pathname.slice('/store/'.length).replace(/\/+$/, '');
    return {
      route: 'store_product',
      worldId,
      productSlug: slug || 'wonder-world-kids-learning-app',
      openUnlockModal: false,
    };
  }
  if (pathname === '/store') return { route: 'store', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/worlds') return { route: 'worlds', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/demo') return { route: 'demo', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/pricing') return { route: 'pricing', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/downloads') return { route: 'downloads', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/parents') return { route: 'parents', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/about') return { route: 'about', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/faq') return { route: 'faq', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/privacy') return { route: 'privacy', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/contact') return { route: 'contact', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/my-games') return { route: 'my_games', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/success') return { route: 'success', worldId, productSlug, openUnlockModal: false };
  if (pathname === '/activate') return { route: 'pricing', worldId, productSlug, openUnlockModal: !params.get('license') };

  // Legacy query-param / hash fallbacks
  if (pageParam === 'activate' || params.get('unlock') === 'true') {
    return { route: 'pricing', worldId, productSlug, openUnlockModal: !params.get('license') };
  }
  if (pageParam === 'store') return { route: 'store', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'store_product') return { route: 'store_product', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'worlds' || hash.includes('worlds')) return { route: 'worlds', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'world_detail' || hash.includes('world_detail')) return { route: 'world_detail', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'demo' || hash.includes('demo')) return { route: 'demo', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'pricing' || hash.includes('pricing') || hash.includes('buy')) return { route: 'pricing', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'downloads' || hash.includes('downloads') || hash.includes('install')) return { route: 'downloads', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'parents' || hash.includes('parents')) return { route: 'parents', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'about' || hash.includes('about')) return { route: 'about', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'faq' || hash.includes('faq')) return { route: 'faq', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'privacy' || hash.includes('privacy')) return { route: 'privacy', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'contact' || hash.includes('contact')) return { route: 'contact', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'my_games' || hash.includes('my_games')) return { route: 'my_games', worldId, productSlug, openUnlockModal: false };
  if (pageParam === 'success' || hash.includes('success')) return { route: 'success', worldId, productSlug, openUnlockModal: false };

  const isDirectGame = params.get('mode') === 'game' || params.get('play') === 'true' || hash.includes('game') || hash.includes('play');
  const isStandalonePWA =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)')?.matches ||
      (window.navigator as Navigator & { standalone?: boolean })?.standalone === true);

  if (isDirectGame || isStandalonePWA) {
    return { route: 'world_map', worldId, productSlug, openUnlockModal: false };
  }

  return { route: 'home', worldId, productSlug, openUnlockModal: false };
}

export default function App() {
  const initialLocation = parseInitialLocation();
  const [route, setRoute] = useState<AppRoute>(initialLocation.route);
  const [selectedWorldId, setSelectedWorldId] = useState<string>(initialLocation.worldId);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(initialLocation.productSlug);
  const [selectedGameLevel, setSelectedGameLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeGameId, setActiveGameId] = useState<string>('game_dino_addition');

  // Store catalog & multi-marketplace saved bag state
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(() => getStoreProducts(true));
  const [bagIds, setBagIds] = useState<string[]>(() => getSavedBagIds());
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [isStoreManagerOpen, setIsStoreManagerOpen] = useState<boolean>(false);
  
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
  const [initialLicenseKey, setInitialLicenseKey] = useState<string>('');
  const [initialLicenseError, setInitialLicenseError] = useState<string | null>(null);

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
  const navigateTo = (targetRoute: AppRoute, param?: string) => {
    const resolvedParam =
      targetRoute === 'store_product'
        ? param || selectedProductSlug
        : param || selectedWorldId;

    if (targetRoute === 'store_product' && param) {
      setSelectedProductSlug(param);
    } else if (param) {
      setSelectedWorldId(param);
    }

    setRoute(targetRoute);

    if (!['world_map', 'world_detail_game', 'game'].includes(targetRoute)) {
      const targetPath = getRoutePath(targetRoute, resolvedParam);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ route: targetRoute, param: resolvedParam }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Browser Back/Forward button synchronization
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseInitialLocation();
      setSelectedWorldId(parsed.worldId);
      setSelectedProductSlug(parsed.productSlug);
      setRoute(parsed.route);
      setIsLicenseModalOpen(parsed.openUnlockModal);
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

    // Auto-verify License Key from URL if provided (?license=XXXXX or ?page=activate&license=XXXXX)
    if (licenseParam) {
      setInitialLicenseKey(licenseParam);
      licenseService.verifyGumroadLicense(licenseParam).then((res) => {
        if (res.success) {
          setIsDemoMode(false);
          setIsLicenseModalOpen(false);
          setInitialLicenseError(null);
          setRoute('world_map');
          if (typeof window !== 'undefined') {
            window.history.replaceState({ route: 'world_map' }, '', '/?mode=game');
          }
          soundEngine.playVictory();
        } else {
          setInitialLicenseError(res.message || 'License key not recognized for Wonder World Kids.');
          setIsLicenseModalOpen(true);
        }
      });
      return;
    }

    const wantsUnlockModal =
      pathname === '/activate' ||
      pageParam === 'activate' ||
      params.get('unlock') === 'true' ||
      params.has('license') ||
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

    if (directGameMode) {
      try {
        localStorage.setItem('wwk_view_preference', 'app_only');
      } catch {
        // Ignore storage errors
      }
      setRoute('world_map');
    }
  }, []);

  // Dynamic Page Title, Meta Description, OpenGraph & JSON-LD Sync
  useEffect(() => {
    applyRouteSEO(route, route === 'store_product' ? selectedProductSlug : selectedWorldId);
  }, [route, selectedWorldId, selectedProductSlug]);

  // Store & Shopping Bag Helpers
  const activeStoreProducts = storeProducts.filter((p) => p.status === 'active');
  const bagItems = activeStoreProducts.filter((p) => bagIds.includes(p.id));

  const handleToggleBagItem = (productId: string) => {
    setBagIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      saveBagIds(next);
      return next;
    });
  };

  const handleRemoveBagItem = (productId: string) => {
    setBagIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      saveBagIds(next);
      return next;
    });
  };

  const handleClearBag = () => {
    setBagIds([]);
    saveBagIds([]);
  };

  const handleViewStoreProduct = (slug: string) => {
    navigateTo('store_product', slug);
  };

  const handleSaveStoreProduct = (product: StoreProduct) => {
    setStoreProducts(upsertStoreProduct(product));
  };

  const handleToggleStoreProductStatus = (productId: string) => {
    setStoreProducts(toggleStoreProductStatus(productId));
  };

  const handleDeleteStoreProduct = (productId: string) => {
    setStoreProducts(deleteCustomStoreProduct(productId));
    handleRemoveBagItem(productId);
  };

  const handleResetStoreDefaults = () => {
    setStoreProducts(resetStoreCatalog());
  };

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
    const hasPaid = licenseService.isUnlocked();
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
    const hasPaid = licenseService.isUnlocked();
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

  const handleNextGameSequence = (fromLevel?: number) => {
    if (isDemoMode) {
      const effectiveLevel = fromLevel ?? selectedGameLevel;
      if (effectiveLevel === 1) {
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
    let isAppOnly = false;
    try {
      isAppOnly = typeof localStorage !== 'undefined' && localStorage.getItem('wwk_view_preference') === 'app_only';
    } catch {
      isAppOnly = false;
    }

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
    const hasPaid = licenseService.isUnlocked();
    
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
                if (!licenseService.isUnlocked()) {
                  setIsDemoLimitOpen(true);
                } else {
                  setIsDirectoryOpen(true);
                }
              }}
              onOpenStickerBook={() => {
                if (!licenseService.isUnlocked()) {
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
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
                  onShowDemoLimit={() => setIsDemoLimitOpen(true)}
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
                  onGetFullVersion={() => navigateTo('pricing')}
                  onOpenKeyModal={() => setIsLicenseModalOpen(true)}
                  isDemoMode={isDemoMode}
                />
              )}
            </div>
          )}
        </DeviceFrameWrapper>
      ) : (
        <div className="min-h-screen flex flex-col bg-[#F8FCFF] text-slate-900">
          <Navbar
            currentRoute={route}
            onNavigate={(newRoute) => navigateTo(newRoute as AppRoute)}
            onEnterGame={() => handleEnterGameApp('world_map')}
            bagCount={bagItems.length}
            onOpenBag={() => setIsBagOpen(true)}
          />

          <main className="flex-1">
            {route === 'home' && (
              <HomePage
                onNavigate={(r, wId) => navigateTo(r as AppRoute, wId)}
                onEnterGame={() => handleEnterGameApp('world_map')}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
                storeProducts={activeStoreProducts}
                allStoreProducts={storeProducts}
                bagIds={bagIds}
                onToggleBagItem={handleToggleBagItem}
                onOpenBag={() => setIsBagOpen(true)}
                onViewProduct={handleViewStoreProduct}
                onOpenStoreManager={() => setIsStoreManagerOpen(true)}
              />
            )}
            {route === 'store' && (
              <StorePage
                products={activeStoreProducts}
                allProductsWithInactive={storeProducts}
                bagIds={bagIds}
                onToggleBagItem={handleToggleBagItem}
                onOpenBag={() => setIsBagOpen(true)}
                onViewProduct={handleViewStoreProduct}
                onNavigate={(r, wId) => navigateTo(r as AppRoute, wId)}
                onOpenManager={() => setIsStoreManagerOpen(true)}
              />
            )}
            {route === 'store_product' && (
              <ProductDetailPage
                product={activeStoreProducts.find(
                  (p) => p.slug.toLowerCase() === selectedProductSlug.toLowerCase()
                )}
                relatedProducts={activeStoreProducts.filter(
                  (p) => p.slug.toLowerCase() !== selectedProductSlug.toLowerCase()
                )}
                bagIds={bagIds}
                onToggleBagItem={handleToggleBagItem}
                onOpenBag={() => setIsBagOpen(true)}
                onViewProduct={handleViewStoreProduct}
                onNavigate={(r, wId) => navigateTo(r as AppRoute, wId)}
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
                onUnlockSuccess={() => setIsDemoMode(false)}
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
              <AboutPage
                onNavigate={(r, wId) => {
                  resetAppPlayState();
                  navigateTo(r as AppRoute, wId);
                }}
                onEnterGame={() => handleEnterGameApp('world_map')}
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
        initialKey={initialLicenseKey}
        initialError={initialLicenseError}
        onClose={() => {
          setIsLicenseModalOpen(false);
          setInitialLicenseError(null);
          if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            if (
              window.location.pathname.replace(/\/+$/, '').toLowerCase() === '/activate' ||
              searchParams.get('page')?.toLowerCase() === 'activate' ||
              searchParams.get('unlock') === 'true'
            ) {
              window.history.replaceState({ route }, '', getRoutePath(route, selectedWorldId));
            }
          }
        }}
        onSuccess={() => {
          setIsLicenseModalOpen(false);
          setInitialLicenseError(null);
          setIsDemoMode(false);
          setRoute('world_map');
          if (typeof window !== 'undefined') {
            window.history.replaceState({ route: 'world_map' }, '', '/?mode=game');
          }
        }}
      />

      <StoreCartDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={handleClearBag}
        onViewProduct={(slug) => {
          setIsBagOpen(false);
          handleViewStoreProduct(slug);
        }}
      />

      <StoreProductManagerModal
        isOpen={isStoreManagerOpen}
        onClose={() => setIsStoreManagerOpen(false)}
        products={storeProducts}
        onSaveProduct={handleSaveStoreProduct}
        onToggleStatus={handleToggleStoreProductStatus}
        onDeleteProduct={handleDeleteStoreProduct}
        onResetDefaults={handleResetStoreDefaults}
      />
    </WorldThemeProvider>
  );
}
