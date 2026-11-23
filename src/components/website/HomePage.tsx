/**
 * Wonder World Kids Website - Interactive & Colourful Kids Learning Space
 * Features interactive Parent & Kid colour theme switcher, Kids/Parents mode view,
 * hands-on homepage mini-learning playground, authentic gameplay previews, 5 Worlds,
 * Printable Books Studio, and Wonder World Kids Store.
 */

import React, { useMemo, useState } from 'react';
import {
  Play,
  Compass,
  Shield,
  ChevronRight,
  Lock,
  Globe,
  KeyRound,
  ShoppingBag,
  BookOpen,
  Star,
  Volume2,
  RefreshCw,
  Check,
  Sparkles,
  Users,
  Smile,
} from 'lucide-react';
import { WORLDS, MINI_GAMES_MATRIX } from '../../data/gameMatrix';
import {
  StoreProduct,
  getStoreProducts,
  ORIGINAL_GAME_SCREENSHOTS,
} from '../../data/storeCatalog';
import { StoreSection } from './StoreSection';
import { WorldEmblem } from './WorldEmblem';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';

interface HomePageProps {
  onNavigate: (route: string, worldId?: string) => void;
  onEnterGame: () => void;
  onOpenLicenseModal?: () => void;
  storeProducts?: StoreProduct[];
  allStoreProducts?: StoreProduct[];
  bagIds?: string[];
  onToggleBagItem?: (productId: string) => void;
  onOpenBag?: () => void;
  onViewProduct?: (slug: string) => void;
  onOpenStoreManager?: () => void;
}

type HomePaletteId = 'sky' | 'jungle' | 'rainbow' | 'cozy';
type AudienceView = 'kids' | 'parents';

interface HomePaletteTheme {
  id: HomePaletteId;
  label: string;
  swatchClass: string;
  pageBg: string;
  heroBg: string;
  heroBorder: string;
  kickerText: string;
  highlightOne: string;
  highlightTwo: string;
  cardBorder: string;
  playgroundBg: string;
  playgroundBorder: string;
}

const HOME_PALETTES: Record<HomePaletteId, HomePaletteTheme> = {
  sky: {
    id: 'sky',
    label: 'Sunny Sky',
    swatchClass: 'bg-sky-400 border-sky-600',
    pageBg: 'bg-[#F6FBFF]',
    heroBg: 'bg-gradient-to-b from-sky-100 via-[#ECF8FF] to-[#F6FBFF]',
    heroBorder: 'border-sky-200',
    kickerText: 'text-sky-700',
    highlightOne: 'text-amber-600',
    highlightTwo: 'text-rose-600',
    cardBorder: 'border-sky-200',
    playgroundBg: 'bg-gradient-to-br from-sky-50 via-white to-amber-50/70',
    playgroundBorder: 'border-sky-200',
  },
  jungle: {
    id: 'jungle',
    label: 'Jungle Safari',
    swatchClass: 'bg-emerald-500 border-emerald-700',
    pageBg: 'bg-[#F4FCF7]',
    heroBg: 'bg-gradient-to-b from-emerald-100 via-[#ECFAF2] to-[#F4FCF7]',
    heroBorder: 'border-emerald-200',
    kickerText: 'text-emerald-800',
    highlightOne: 'text-amber-600',
    highlightTwo: 'text-emerald-700',
    cardBorder: 'border-emerald-200',
    playgroundBg: 'bg-gradient-to-br from-emerald-50 via-white to-lime-50/70',
    playgroundBorder: 'border-emerald-200',
  },
  rainbow: {
    id: 'rainbow',
    label: 'Starlight Berry',
    swatchClass: 'bg-violet-500 border-violet-700',
    pageBg: 'bg-[#FBF8FF]',
    heroBg: 'bg-gradient-to-b from-violet-100 via-fuchsia-50 to-[#FBF8FF]',
    heroBorder: 'border-violet-200',
    kickerText: 'text-violet-800',
    highlightOne: 'text-rose-600',
    highlightTwo: 'text-violet-700',
    cardBorder: 'border-violet-200',
    playgroundBg: 'bg-gradient-to-br from-violet-50 via-white to-rose-50/70',
    playgroundBorder: 'border-violet-200',
  },
  cozy: {
    id: 'cozy',
    label: 'Cozy Peach',
    swatchClass: 'bg-amber-400 border-amber-600',
    pageBg: 'bg-[#FFFBF5]',
    heroBg: 'bg-gradient-to-b from-amber-100 via-orange-50 to-[#FFFBF5]',
    heroBorder: 'border-amber-200',
    kickerText: 'text-amber-800',
    highlightOne: 'text-orange-600',
    highlightTwo: 'text-teal-700',
    cardBorder: 'border-amber-200',
    playgroundBg: 'bg-gradient-to-br from-amber-50 via-white to-orange-50/70',
    playgroundBorder: 'border-amber-200',
  },
};

const WORLD_CARD_PALETTES = [
  {
    surface: 'bg-sky-50 border-sky-200 hover:border-sky-400',
    accentText: 'text-sky-950',
    tagText: 'text-sky-700',
    cta: 'text-sky-700 hover:text-sky-950',
  },
  {
    surface: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    accentText: 'text-emerald-950',
    tagText: 'text-emerald-700',
    cta: 'text-emerald-700 hover:text-emerald-950',
  },
  {
    surface: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    accentText: 'text-amber-950',
    tagText: 'text-amber-800',
    cta: 'text-amber-800 hover:text-amber-950',
  },
  {
    surface: 'bg-rose-50 border-rose-200 hover:border-rose-400',
    accentText: 'text-rose-950',
    tagText: 'text-rose-700',
    cta: 'text-rose-700 hover:text-rose-950',
  },
  {
    surface: 'bg-violet-50 border-violet-200 hover:border-violet-400',
    accentText: 'text-violet-950',
    tagText: 'text-violet-700',
    cta: 'text-violet-700 hover:text-violet-950',
  },
];

const PHONICS_CARDS = [
  {
    letter: 'A',
    word: 'Apple',
    soundCue: '/ae/ as in crunchy red Apple',
    colorClass: 'bg-rose-500 text-white border-rose-600',
    fact: 'Apples float in water because 25% of an apple is air!',
  },
  {
    letter: 'D',
    word: 'Dinosaur',
    soundCue: '/d/ as in friendly Dino explorer',
    colorClass: 'bg-emerald-500 text-white border-emerald-600',
    fact: 'Triceratops had three horns and loved crunching green leaves.',
  },
  {
    letter: 'M',
    word: 'Moon',
    soundCue: '/m/ as in bright silvery Moon',
    colorClass: 'bg-indigo-500 text-white border-indigo-600',
    fact: 'The Moon orbits Earth every 27 days and lights up night skies.',
  },
  {
    letter: 'R',
    word: 'Rainbow',
    soundCue: '/r/ as in sunny Rainbow arch',
    colorClass: 'bg-amber-400 text-amber-950 border-amber-500',
    fact: 'Sunlight passing through raindrops creates 7 bright rainbow colours.',
  },
  {
    letter: 'S',
    word: 'Starfish',
    soundCue: '/s/ as in ocean Starfish',
    colorClass: 'bg-sky-500 text-white border-sky-600',
    fact: 'Most starfish have 5 arms and live along coastal ocean floors.',
  },
];

const MATH_PUZZLES = [
  { left: 2, right: 3, themeWord: 'stars' },
  { left: 4, right: 2, themeWord: 'eggs' },
  { left: 3, right: 5, themeWord: 'apples' },
  { left: 1, right: 4, themeWord: 'shells' },
];

const PARENT_AGE_TRACKS = [
  {
    age: 'Ages 3–4 · Preschool',
    focus: 'Counting 1–10, letter recognition, shapes, colours & printable tracing pages.',
    badgeBg: 'bg-sky-50 border-sky-200',
  },
  {
    age: 'Ages 5–6 · Kindergarten',
    focus: 'Early addition & subtraction, phonics blends, sight words & creative colouring.',
    badgeBg: 'bg-emerald-50 border-emerald-200',
  },
  {
    age: 'Ages 7–8 · Grades 1–2',
    focus: 'Multiplication blitz, continents & cultures, animal science & spatial logic.',
    badgeBg: 'bg-amber-50 border-amber-200',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenLicenseModal,
  storeProducts,
  allStoreProducts,
  bagIds = [],
  onToggleBagItem = () => {},
  onOpenBag = () => {},
  onViewProduct,
  onOpenStoreManager = () => {},
}) => {
  const [paletteId, setPaletteId] = useState<HomePaletteId>(() => {
    try {
      const saved = localStorage.getItem('wwk_home_palette') as HomePaletteId | null;
      return saved && HOME_PALETTES[saved] ? saved : 'sky';
    } catch {
      return 'sky';
    }
  });
  const [audienceView, setAudienceView] = useState<AudienceView>('kids');
  const [selectedHeroIdx, setSelectedHeroIdx] = useState(0);

  // Interactive Homepage Kids Playground state
  const [mathPuzzleIdx, setMathPuzzleIdx] = useState(0);
  const [mathPicked, setMathPicked] = useState<number | null>(null);
  const [starsEarned, setStarsEarned] = useState(0);
  const [activePhonicsIdx, setActivePhonicsIdx] = useState(1); // D · Dinosaur

  const activeTheme = HOME_PALETTES[paletteId];
  const resolvedProducts = storeProducts || getStoreProducts(false);
  const resolvedAllProducts = allStoreProducts || getStoreProducts(true);
  const printableBooks = resolvedProducts.filter((p) => p.category !== 'Learning Games');
  const activeHeroShot = ORIGINAL_GAME_SCREENSHOTS[selectedHeroIdx] || ORIGINAL_GAME_SCREENSHOTS[0];

  const currentPuzzle = MATH_PUZZLES[mathPuzzleIdx % MATH_PUZZLES.length];
  const puzzleAnswer = currentPuzzle.left + currentPuzzle.right;

  const mathChoices = useMemo(() => {
    const raw = [Math.max(1, puzzleAnswer - 1), puzzleAnswer, puzzleAnswer + 2];
    const rot = mathPuzzleIdx % 3;
    return [...raw.slice(rot), ...raw.slice(0, rot)];
  }, [puzzleAnswer, mathPuzzleIdx]);

  const handleSelectPalette = (id: HomePaletteId) => {
    soundEngine.playPop();
    setPaletteId(id);
    try {
      localStorage.setItem('wwk_home_palette', id);
    } catch {
      // ignore storage failure
    }
  };

  const handlePickMathChoice = (choice: number) => {
    setMathPicked(choice);
    if (choice === puzzleAnswer) {
      soundEngine.playVictory();
      setStarsEarned((prev) => prev + 1);
    } else {
      soundEngine.playSnap();
    }
  };

  const handleNextMathPuzzle = () => {
    soundEngine.playPop();
    setMathPicked(null);
    setMathPuzzleIdx((prev) => (prev + 1) % MATH_PUZZLES.length);
  };

  const handleAnchorNav = (e: React.MouseEvent, route: string, worldId?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, worldId);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen text-[#0F294A] font-body selection:bg-amber-300 selection:text-amber-950 transition-colors duration-200 ${activeTheme.pageBg}`}
    >
      {/* 1. Interactive Kids & Parents Colour Studio + Storybook Split Hero */}
      <section
        className={`relative border-b py-8 sm:py-12 lg:py-16 px-4 sm:px-8 transition-colors duration-200 ${activeTheme.heroBg} ${activeTheme.heroBorder}`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Interactive Theme & Audience Bar for Kids and Parents */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-black/10">
            {/* Colour Theme Picker */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold font-fun text-[#0F294A] mr-1 whitespace-nowrap">
                Pick Room Colour:
              </span>
              {(Object.keys(HOME_PALETTES) as HomePaletteId[]).map((key) => {
                const pal = HOME_PALETTES[key];
                const isSelected = key === paletteId;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPalette(key)}
                    className={`h-9 px-3 rounded-xl border text-xs font-fun font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-white border-[#0F294A] text-[#0F294A] shadow-xs ring-2 ring-amber-300'
                        : 'bg-white/75 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border shrink-0 ${pal.swatchClass}`}
                      aria-hidden="true"
                    />
                    <span>{pal.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Kids / Parents Interactive Mode Switch */}
            <div
              role="group"
              aria-label="Choose Kids or Parents view"
              className="inline-flex items-center p-1 bg-white/90 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0"
            >
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setAudienceView('kids');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-fun font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  audienceView === 'kids'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0F294A]'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Kids Space</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setAudienceView('parents');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-fun font-black flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  audienceView === 'parents'
                    ? 'bg-[#0F294A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0F294A]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Parents Guide</span>
              </button>
            </div>
          </div>

          {/* Main Hero Split (logo removed cleanly per request) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Hero Headline & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className={`text-xs sm:text-sm font-bold font-fun tracking-wide mb-3 ${activeTheme.kickerText}`}>
                Early Learning Space · Ages 3–8 · Kids &amp; Parents Hub
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-black font-fun tracking-tight text-[#0F294A] leading-[1.1] mb-5 text-balance">
                Interactive{' '}
                <span className={activeTheme.highlightOne}>Learning Games</span>, Colouring Books &amp;{' '}
                <span className={activeTheme.highlightTwo}>5 Discovery Worlds</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 font-medium max-w-2xl mb-8 leading-relaxed">
                {audienceView === 'kids'
                  ? 'Pick your favourite colour room, solve puzzles below, and explore math, phonics, world geography, science, and printable colouring adventures!'
                  : 'Designed for calm, focused early learning across preschool through Grade 2—combining 45 offline digital games with screen-free printable PDF books.'}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-7">
                <a
                  href={getRoutePath('demo')}
                  onClick={(e) => handleAnchorNav(e, 'demo')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-green-600 hover:from-emerald-300 hover:to-green-500 text-white font-fun font-black text-sm sm:text-base shadow-[0_4px_0_#15803d] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap border border-emerald-300/60"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>Try Free Demo</span>
                </a>

                <a
                  href={getRoutePath('store')}
                  onClick={(e) => handleAnchorNav(e, 'store')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-amber-950 font-fun font-black text-sm sm:text-base shadow-[0_4px_0_#d97706] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap border border-amber-200"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Games &amp; Printables Store</span>
                </a>

                <a
                  href={getRoutePath('worlds')}
                  onClick={(e) => handleAnchorNav(e, 'worlds')}
                  className="px-5 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-[#0F294A] font-fun font-bold text-sm sm:text-base border-2 border-sky-200 flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>Explore 5 Worlds</span>
                </a>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-slate-600 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="tabular-nums">45 Offline Learning Games</span>
                <span aria-hidden="true">·</span>
                <span>Printable PDF Books</span>
                <span aria-hidden="true">·</span>
                <span>100% Kid-Safe &amp; Ad-Free</span>
              </div>
            </div>

            {/* Right Interactive Showcase (Adapts smoothly between Kids Mode and Parents Mode) */}
            <div className="lg:col-span-5 flex">
              {audienceView === 'kids' ? (
                <div
                  className={`w-full rounded-3xl bg-white border-2 shadow-md p-4 sm:p-5 flex flex-col justify-between gap-4 ${activeTheme.cardBorder}`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold font-fun text-[#0F294A]">
                    <span>Real Game Preview · {activeHeroShot.label}</span>
                    <a
                      href={getRoutePath('demo')}
                      onClick={(e) => handleAnchorNav(e, 'demo')}
                      className="text-emerald-700 hover:underline whitespace-nowrap"
                    >
                      Play Demo →
                    </a>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-stretch flex-1">
                    <div className="col-span-8 rounded-2xl overflow-hidden bg-sky-50 border border-sky-200 flex items-center justify-center">
                      <img
                        src={activeHeroShot.src}
                        alt={activeHeroShot.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full max-h-[340px] object-contain"
                      />
                    </div>

                    <div className="col-span-4 flex flex-col gap-2 justify-between">
                      {ORIGINAL_GAME_SCREENSHOTS.map((shot, idx) => {
                        const isSelected = idx === selectedHeroIdx;
                        return (
                          <button
                            key={shot.src}
                            type="button"
                            onClick={() => {
                              soundEngine.playPop();
                              setSelectedHeroIdx(idx);
                            }}
                            className={`rounded-xl overflow-hidden border-2 transition cursor-pointer bg-sky-50 flex-1 flex items-center justify-center p-0.5 ${
                              isSelected
                                ? 'border-amber-400 ring-2 ring-amber-200'
                                : 'border-sky-100 hover:border-sky-300 opacity-85 hover:opacity-100'
                            }`}
                            aria-label={`Preview ${shot.label}`}
                            title={shot.label}
                          >
                            <img
                              src={shot.src}
                              alt={shot.alt}
                              referrerPolicy="no-referrer"
                              className="w-full h-16 object-cover object-top rounded-lg"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full rounded-3xl bg-white border-2 shadow-md p-5 sm:p-6 flex flex-col justify-between gap-4 ${activeTheme.cardBorder}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h2 className="text-lg font-black font-fun text-[#0F294A]">
                        Parent Curriculum &amp; Safety Snapshot
                      </h2>
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                    </div>
                    <div className="space-y-2.5">
                      {PARENT_AGE_TRACKS.map((track) => (
                        <div
                          key={track.age}
                          className={`p-3 rounded-2xl border ${track.badgeBg}`}
                        >
                          <div className="text-xs font-black font-fun text-[#0F294A] mb-0.5">
                            {track.age}
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{track.focus}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={getRoutePath('parents')}
                      onClick={(e) => handleAnchorNav(e, 'parents')}
                      className="text-xs font-black font-fun text-sky-700 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Open Parents &amp; Progress Guide</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={getRoutePath('downloads')}
                      onClick={(e) => handleAnchorNav(e, 'downloads')}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs whitespace-nowrap"
                    >
                      Offline Install Guide
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Kids Learning Playground (Hands-on tactile practice on homepage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-14 w-full">
        <div
          className={`rounded-3xl border-2 p-6 sm:p-8 shadow-xs transition-colors duration-200 ${activeTheme.playgroundBg} ${activeTheme.playgroundBorder}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider font-fun mb-1 ${activeTheme.kickerText}`}>
                Interactive Kids Learning Corner
              </p>
              <h2 className="text-2xl sm:text-3xl font-black font-fun text-[#0F294A]">
                Tap, Count &amp; Explore Right Here
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-xs font-fun font-black text-amber-900 flex items-center gap-1.5 tabular-nums">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{starsEarned} Stars Earned</span>
              </div>
              <a
                href={getRoutePath('demo')}
                onClick={(e) => handleAnchorNav(e, 'demo')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs transition whitespace-nowrap inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Full Demo Lab</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity 1: Quick Math Counter */}
            <div className="bg-white rounded-2xl border border-sky-200 p-5 sm:p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-sky-700 font-fun">
                    Mini Math Warm-Up
                  </span>
                  <h3 className="text-lg font-black font-fun text-[#0F294A]">
                    Count &amp; Add Together
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleNextMathPuzzle}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-fun font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap border border-sky-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Sum</span>
                </button>
              </div>

              {/* Visual Counter Display */}
              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex flex-wrap items-center justify-center gap-3 text-center">
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-sky-200">
                  {Array.from({ length: currentPuzzle.left }).map((_, idx) => (
                    <Star
                      key={`l-${idx}`}
                      className="w-5 h-5 text-amber-500 fill-amber-400"
                    />
                  ))}
                  <span className="ml-1.5 font-fun font-black text-base text-[#0F294A] tabular-nums">
                    {currentPuzzle.left}
                  </span>
                </div>

                <span className="font-fun font-black text-xl text-sky-700">+</span>

                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-sky-200">
                  {Array.from({ length: currentPuzzle.right }).map((_, idx) => (
                    <Star
                      key={`r-${idx}`}
                      className="w-5 h-5 text-rose-500 fill-rose-400"
                    />
                  ))}
                  <span className="ml-1.5 font-fun font-black text-base text-[#0F294A] tabular-nums">
                    {currentPuzzle.right}
                  </span>
                </div>

                <span className="font-fun font-black text-xl text-sky-700">=</span>

                <div className="w-12 h-11 rounded-xl bg-amber-300 border-2 border-amber-500 flex items-center justify-center font-fun font-black text-xl text-amber-950 tabular-nums">
                  {mathPicked === puzzleAnswer ? puzzleAnswer : '?'}
                </div>
              </div>

              {/* Choice Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {mathChoices.map((choice) => {
                  const isPicked = mathPicked === choice;
                  const isRight = choice === puzzleAnswer;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handlePickMathChoice(choice)}
                      className={`py-3 rounded-xl font-fun font-black text-lg tabular-nums border-2 transition cursor-pointer ${
                        isPicked
                          ? isRight
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-sky-50 hover:bg-amber-100 text-[#0F294A] border-sky-200 hover:border-amber-400'
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[20px] text-xs font-bold font-fun text-center">
                {mathPicked === puzzleAnswer ? (
                  <span className="text-emerald-700 inline-flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Great job! {currentPuzzle.left} + {currentPuzzle.right} = {puzzleAnswer}. Tap New Sum to keep playing!
                  </span>
                ) : mathPicked !== null ? (
                  <span className="text-rose-700">
                    Almost! Count the gold and coral stars together and try again.
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Tap the matching total above to earn a bright star.
                  </span>
                )}
              </div>
            </div>

            {/* Activity 2: ABC Phonics Discovery Tiles */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-700 font-fun">
                    Phonics &amp; Vocabulary Board
                  </span>
                  <h3 className="text-lg font-black font-fun text-[#0F294A]">
                    Tap a Letter Tile
                  </h3>
                </div>
                <Volume2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                {PHONICS_CARDS.map((card, idx) => {
                  const isActive = idx === activePhonicsIdx;
                  return (
                    <button
                      key={card.letter}
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setActivePhonicsIdx(idx);
                      }}
                      className={`py-3 rounded-xl font-fun font-black text-lg sm:text-xl border-2 transition cursor-pointer ${
                        isActive
                          ? `${card.colorClass} scale-105 shadow-sm`
                          : 'bg-slate-50 hover:bg-emerald-50 text-[#0F294A] border-slate-200'
                      }`}
                    >
                      {card.letter}
                    </button>
                  );
                })}
              </div>

              {(() => {
                const activeCard = PHONICS_CARDS[activePhonicsIdx] || PHONICS_CARDS[0];
                return (
                  <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-fun font-black text-base text-[#0F294A]">
                        {activeCard.letter} is for {activeCard.word}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {activeCard.soundCue}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{activeCard.fact}</p>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                <span>Want 45 full animated mini-games?</span>
                <a
                  href={getRoutePath('demo')}
                  onClick={(e) => handleAnchorNav(e, 'demo')}
                  className="font-fun font-black text-emerald-700 hover:underline whitespace-nowrap"
                >
                  Open Interactive Simulator →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore the 5 Early Learning Worlds + Printable Books (Clean Vector Icons, Zero Screenshots) */}
      <section id="worlds" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-18 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className={`text-xs font-bold uppercase tracking-wider font-fun mb-1.5 ${activeTheme.kickerText}`}>
              Early Learning Curriculum · Interactive Worlds &amp; Books
            </p>
            <h2 className="text-3xl sm:text-4xl font-black font-fun text-[#0F294A] tracking-tight text-balance">
              Explore Our 5 Wonder Worlds &amp; Printable Books
            </h2>
          </div>
          <a
            href={getRoutePath('worlds')}
            onClick={(e) => handleAnchorNav(e, 'worlds')}
            className="inline-flex items-center gap-1.5 text-sm font-bold font-fun text-sky-700 hover:text-sky-900 whitespace-nowrap shrink-0"
          >
            <span>See all 45 games</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORLDS.map((world, idx) => {
            const theme = WORLD_CARD_PALETTES[idx % WORLD_CARD_PALETTES.length];
            const worldGames = MINI_GAMES_MATRIX.filter((g) => g.worldId === world.id).slice(0, 3);

            return (
              <a
                key={world.id}
                href={getRoutePath('world_detail', world.id)}
                onClick={(e) => handleAnchorNav(e, 'world_detail', world.id)}
                className={`rounded-3xl p-6 border-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5 cursor-pointer group ${theme.surface}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <WorldEmblem worldId={world.id} size="md" />
                    <span className={`text-xs font-bold font-fun tabular-nums ${theme.tagText}`}>
                      World {idx + 1} · {world.gameCount} Games
                    </span>
                  </div>

                  <h3 className={`text-xl font-black font-fun mb-2 ${theme.accentText}`}>
                    {world.title}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {world.description}
                  </p>

                  <div className="text-xs text-slate-600 font-semibold leading-relaxed">
                    Includes:{' '}
                    <span className="text-slate-800">
                      {worldGames.map((g) => g.title).join(' · ')}
                    </span>
                  </div>
                </div>

                <div className={`pt-4 border-t border-black/10 flex items-center justify-between text-xs font-black font-fun ${theme.cta}`}>
                  <span>Explore {world.title}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            );
          })}

          {/* 6th Balanced Card: Printable Colouring & Activity Books Studio */}
          <a
            href={getRoutePath('store')}
            onClick={(e) => handleAnchorNav(e, 'store')}
            className="rounded-3xl p-6 border-2 border-teal-200 hover:border-teal-400 bg-teal-50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <WorldEmblem worldId="printables" size="md" />
                <span className="text-xs font-bold font-fun text-teal-800 tabular-nums">
                  {printableBooks.length} Printable Books
                </span>
              </div>

              <h3 className="text-xl font-black font-fun text-teal-950 mb-2">
                Printable Colouring &amp; Activity Books
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                Screen-free creativity at home or in the classroom! Download instant printable PDF dinosaur colouring books, ABC workbooks, and seasonal collections.
              </p>

              <div className="text-xs text-slate-600 font-semibold leading-relaxed">
                Includes:{' '}
                <span className="text-slate-800">
                  Dinosaur World · ABC Alphabet · Christmas Wonderland · My First Maths Adventure
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs font-black font-fun text-teal-800 hover:text-teal-950">
              <span>Browse Digital Printables</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>
        </div>
      </section>

      {/* 4. Wonder World Kids Store – Learn, Play & Create */}
      <StoreSection
        products={resolvedProducts}
        allProductsWithInactive={resolvedAllProducts}
        bagIds={bagIds}
        onToggleBagItem={onToggleBagItem}
        onOpenBag={onOpenBag}
        onViewProduct={(slug) =>
          onViewProduct ? onViewProduct(slug) : onNavigate('store_product', slug)
        }
        onNavigate={onNavigate}
        onOpenManager={onOpenStoreManager}
        compactHeader={true}
      />

      {/* 5. Early Learning Promise & One-Time Family Unlock */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-18 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div
            className={`lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border-2 shadow-xs flex flex-col justify-between gap-6 ${activeTheme.cardBorder}`}
          >
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider font-fun mb-2 ${activeTheme.kickerText}`}>
                Our Learning Priority
              </p>
              <h2 className="text-2xl sm:text-3xl font-black font-fun text-[#0F294A] mb-4">
                Built for Curious Kids. Trusted by Parents.
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                Wonder World Kids Learning puts genuine early childhood growth first. Whether children are counting dinosaurs on tablet play or colouring letters at the kitchen table with our printable books, every experience stays calm, encouraging, ad-free, and 100% private.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-sky-100">
              <div>
                <Shield className="w-6 h-6 text-emerald-600 mb-2" />
                <h3 className="font-fun font-bold text-sm text-[#0F294A] mb-1">Ad-Free &amp; Private</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zero third-party ads or child data tracking inside games.
                </p>
              </div>
              <div>
                <Globe className="w-6 h-6 text-sky-600 mb-2" />
                <h3 className="font-fun font-bold text-sm text-[#0F294A] mb-1">100% Offline Play</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Works on flights, road trips, and Wi-Fi-free afternoons.
                </p>
              </div>
              <div>
                <BookOpen className="w-6 h-6 text-amber-600 mb-2" />
                <h3 className="font-fun font-bold text-sm text-[#0F294A] mb-1">Games + Printables</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interactive 5-world app paired with printable PDF activity books.
                </p>
              </div>
            </div>
          </div>

          <div
            id="pricing"
            className="lg:col-span-5 bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-300 rounded-3xl p-8 sm:p-10 border-2 border-amber-200 shadow-sm text-amber-950 flex flex-col justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider font-fun text-amber-900 mb-2">
                <Lock className="w-4 h-4" />
                <span>One-Time Family License</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-fun text-amber-950 mb-3 text-balance">
                Unlock All 45 Games Across 5 Worlds
              </h2>
              <p className="text-sm font-semibold text-amber-950/90 leading-relaxed">
                Get full lifetime access to all 225 educational levels, sticker books, and offline PWA install for a single $9 USD payment—no subscriptions.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-amber-950/15">
              <a
                href={getRoutePath('pricing')}
                onClick={(e) => handleAnchorNav(e, 'pricing')}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0F294A] hover:bg-sky-900 text-white font-fun font-black text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Unlock Full Access</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              {onOpenLicenseModal && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    onOpenLicenseModal();
                  }}
                  className="w-full py-3 px-5 rounded-2xl bg-white/90 hover:bg-white text-[#0F294A] font-fun font-bold text-sm border border-amber-500/40 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-4 h-4 text-sky-700" />
                  <span>Enter Activation Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
