import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Volume2, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, Compass, Eye } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface FootprintDetectiveGameProps {
  currentLevel: 1 | 2 | 3 | 4 | 5;
  onCorrect: (points?: number) => void;
  onIncorrect: (hint?: string) => void;
}

interface AnimalTrackCase {
  id: string;
  caseNumber: string;
  title: string;
  environment: string;
  bgColor: string;
  animalName: string;
  emoji: string;
  trackType: 'bear' | 'duck' | 'horse' | 'eagle' | 'elephant' | 'tiger' | 'wolf' | 'rabbit' | 'deer' | 'frog';
  clues: {
    anatomy: string;
    habitat: string;
    diet: string;
    inspectData: {
      claws: string;
      toes: string;
      webbing: string;
      size: string;
    };
  };
  options: Array<{
    name: string;
    emoji: string;
    feature: string;
  }>;
  audioFreq: number;
}

// 10 Comprehensive Animal Track Cases scaled across 5 difficulty levels
const CASES_DATABASE: Record<number, AnimalTrackCase[]> = {
  1: [
    {
      id: 'case_bear',
      caseNumber: 'Case #101',
      title: 'Muddy Forest Trail Mystery',
      environment: '🌲 Deep Pine Forest Mud',
      bgColor: 'from-amber-800/20 via-orange-950/10 to-amber-900/20',
      animalName: 'Grizzly Bear',
      emoji: '🐻',
      trackType: 'bear',
      clues: {
        anatomy: '5 distinct toe pads with long, sharp claw marks extending forward.',
        habitat: 'Found near salmon rivers, pine forests, and mountain caves.',
        diet: 'Omnivore: Loves salmon, berries, roots, and wild honey.',
        inspectData: { claws: 'Exposed & Long', toes: '5 Toe Pads', webbing: 'None', size: 'Large (Heavy)' }
      },
      options: [
        { name: 'Grizzly Bear', emoji: '🐻', feature: '5 Claws & Broad Heel Pad' },
        { name: 'Mallard Duck', emoji: '🦆', feature: 'Webbed Paddles' },
        { name: 'Wild Horse', emoji: '🐎', feature: 'Solid Horseshoe Hoof' }
      ],
      audioFreq: 180
    },
    {
      id: 'case_duck',
      caseNumber: 'Case #102',
      title: 'Pond Bank Mud Impression',
      environment: '🌾 Marshy Lake Shore',
      bgColor: 'from-emerald-800/20 via-teal-950/10 to-cyan-900/20',
      animalName: 'Mallard Duck',
      emoji: '🦆',
      trackType: 'duck',
      clues: {
        anatomy: '3 long forward-facing toes joined by thin paddle-like skin webbing.',
        habitat: 'Found by freshwater ponds, rivers, and quiet wetlands.',
        diet: 'Herbivore/Omnivore: Dabbling in pond weeds, seeds, and aquatic bugs.',
        inspectData: { claws: 'Small Tips', toes: '3 Forward + Webbing', webbing: 'Fully Webbed', size: 'Small Light' }
      },
      options: [
        { name: 'Grizzly Bear', emoji: '🐻', feature: '5 Heavy Claws' },
        { name: 'Mallard Duck', emoji: '🦆', feature: '3 Webbed Toes for Swimming' },
        { name: 'Bengal Tiger', emoji: '🐯', feature: 'Padded Paw (No Claws)' }
      ],
      audioFreq: 520
    }
  ],
  2: [
    {
      id: 'case_tiger',
      caseNumber: 'Case #201',
      title: 'Jungle Riverbed Mystery',
      environment: '🌴 Tropical Jungle River',
      bgColor: 'from-orange-800/20 via-amber-950/10 to-red-900/20',
      animalName: 'Bengal Tiger',
      emoji: '🐯',
      trackType: 'tiger',
      clues: {
        anatomy: 'Large 3-lobed main heel pad with 4 rounded toe prints. Notice NO claw marks!',
        habitat: 'Dense tropical forests, tall grasslands, and river banks.',
        diet: 'Carnivore: Hunts deer and wild boar in stealth.',
        inspectData: { claws: 'Retracted (Hidden)', toes: '4 Round Pads', webbing: 'None', size: 'Large Padded' }
      },
      options: [
        { name: 'Bengal Tiger', emoji: '🐯', feature: 'Soft Paw (Claws Retracted)' },
        { name: 'Gray Wolf', emoji: '🐺', feature: 'Claw Marks Always Visible' },
        { name: 'African Elephant', emoji: '🐘', feature: 'Giant Round Foot' },
        { name: 'Golden Eagle', emoji: '🦅', feature: 'Sharp Needle Talons' }
      ],
      audioFreq: 140
    },
    {
      id: 'case_elephant',
      caseNumber: 'Case #202',
      title: 'Savannah Dust Crater',
      environment: '🦁 Sunbaked Savannah Plain',
      bgColor: 'from-yellow-800/20 via-amber-900/10 to-orange-900/20',
      animalName: 'African Elephant',
      emoji: '🐘',
      trackType: 'elephant',
      clues: {
        anatomy: 'Enormous round, cushion-like footprint with deep radial cracks and front toenail arches.',
        habitat: 'African savannahs, woodlands, and desert river valleys.',
        diet: 'Herbivore: Eats grasses, tree bark, leaves, and fruits.',
        inspectData: { claws: 'Toenail Arches', toes: 'Cushioned Flat Sole', webbing: 'None', size: 'Huge (>40cm)' }
      },
      options: [
        { name: 'Bengal Tiger', emoji: '🐯', feature: 'Padded Cat Paw' },
        { name: 'African Elephant', emoji: '🐘', feature: 'Huge Round Cushioned Track' },
        { name: 'Gray Wolf', emoji: '🐺', feature: 'Canine Paw Print' },
        { name: 'Mountain Goat', emoji: '🐐', feature: 'Cloven Split Hoof' }
      ],
      audioFreq: 110
    }
  ],
  3: [
    {
      id: 'case_wolf',
      caseNumber: 'Case #301',
      title: 'Snowy Ridge Paw Print',
      environment: '❄️ Snowy Mountain Pass',
      bgColor: 'from-slate-700/20 via-blue-950/10 to-cyan-900/20',
      animalName: 'Gray Wolf',
      emoji: '🐺',
      trackType: 'wolf',
      clues: {
        anatomy: 'Symmetrical oval paw with 4 toe pads and distinct non-retractable claw indents at top.',
        habitat: 'Tundra, northern forests, and rocky mountains.',
        diet: 'Carnivore: Packs hunt elk, deer, and moose.',
        inspectData: { claws: 'Non-Retractable Dots', toes: '4 Oval Toe Pads', webbing: 'None', size: 'Medium-Large' }
      },
      options: [
        { name: 'Bengal Tiger', emoji: '🐯', feature: 'No Claw Marks Left' },
        { name: 'Gray Wolf', emoji: '🐺', feature: '4 Toes with Claw Indents' },
        { name: 'Snowy Owl', emoji: '🦉', feature: '3 Curved Talons' },
        { name: 'Red Fox', emoji: '🦊', feature: 'Tiny Narrow Paw' }
      ],
      audioFreq: 320
    },
    {
      id: 'case_eagle',
      caseNumber: 'Case #302',
      title: 'Cliffside Perch Scratch Track',
      environment: '⛰️ High Alpine Cliff',
      bgColor: 'from-sky-800/20 via-indigo-950/10 to-slate-900/20',
      animalName: 'Golden Eagle',
      emoji: '🦅',
      trackType: 'eagle',
      clues: {
        anatomy: '3 long forward-pointing talons with needle-sharp claw tips, plus 1 strong rear talon.',
        habitat: 'High mountains, open ridges, and desert canyons.',
        diet: 'Carnivore: Soars high to catch hares, marmots, and fish.',
        inspectData: { claws: 'Sharp Curved Needle Talons', toes: '3 Front + 1 Back', webbing: 'None', size: 'Spreading Talon' }
      },
      options: [
        { name: 'Golden Eagle', emoji: '🦅', feature: '3 Talon Claws + 1 Rear Spur' },
        { name: 'Mallard Duck', emoji: '🦆', feature: 'Webbed Paddles for Swimming' },
        { name: 'Grizzly Bear', emoji: '🐻', feature: '5 Heavy Paw Toes' },
        { name: 'Mountain Lion', emoji: '🦁', feature: '4 Round Soft Toe Pads' }
      ],
      audioFreq: 680
    }
  ],
  4: [
    {
      id: 'case_deer',
      caseNumber: 'Case #401',
      title: 'Woodland Glade Hoof Print',
      environment: '🌳 Forest Meadow Soil',
      bgColor: 'from-green-800/20 via-emerald-950/10 to-teal-900/20',
      animalName: 'White-Tailed Deer',
      emoji: '🦌',
      trackType: 'deer',
      clues: {
        anatomy: 'Two heart-shaped, symmetrical cloven hoof halves pointing forward.',
        habitat: 'Deciduous forests, brushy fields, and farmland edges.',
        diet: 'Herbivore: Browses leaves, acorns, twigs, and apples.',
        inspectData: { claws: 'Cloven Split Hoof', toes: '2 Heart Halves', webbing: 'None', size: 'Narrow Clean' }
      },
      options: [
        { name: 'White-Tailed Deer', emoji: '🦌', feature: '2 Cloven Heart-Shaped Hoof Halves' },
        { name: 'Wild Horse', emoji: '🐎', feature: 'Solid 1-Piece Horseshoe' },
        { name: 'Grizzly Bear', emoji: '🐻', feature: '5 Paw Toes' },
        { name: 'Gray Wolf', emoji: '🐺', feature: '4-Padded Paw' }
      ],
      audioFreq: 440
    },
    {
      id: 'case_rabbit',
      caseNumber: 'Case #402',
      title: 'Meadow Snow Hop Track',
      environment: '❄️ Winter Meadow Snow',
      bgColor: 'from-blue-800/20 via-slate-900/10 to-indigo-900/20',
      animalName: 'Cotton-Tail Rabbit',
      emoji: '🐇',
      trackType: 'rabbit',
      clues: {
        anatomy: 'Paired long elongated hind foot tracks side-by-side with two smaller front prints staggered behind.',
        habitat: 'Grassy fields, hedges, and woodland clearings.',
        diet: 'Herbivore: Chews clover, grass blades, and bark.',
        inspectData: { claws: 'Furry Toes', toes: 'Long Hind + Small Front', webbing: 'None', size: 'Leaping Pair' }
      },
      options: [
        { name: 'Cotton-Tail Rabbit', emoji: '🐇', feature: 'Long Hind Leaping Footprints' },
        { name: 'Gray Wolf', emoji: '🐺', feature: 'Single Line Canine Track' },
        { name: 'Mallard Duck', emoji: '🦆', feature: 'Webbed Waddling Footprints' },
        { name: 'White-Tailed Deer', emoji: '🦌', feature: 'Cloven Split Hoof' }
      ],
      audioFreq: 580
    }
  ],
  5: [
    {
      id: 'case_frog',
      caseNumber: 'Case #501',
      title: 'Rainforest Creek Print',
      environment: '🐸 Tropical Creek Bank',
      bgColor: 'from-emerald-800/20 via-lime-950/10 to-teal-900/20',
      animalName: 'Tree Frog',
      emoji: '🐸',
      trackType: 'frog',
      clues: {
        anatomy: 'Hand-like 4-toed front print paired with longer 5-toed hind foot having bulbous suction pads.',
        habitat: 'Rainforest leaves, creek banks, and humid foliage.',
        diet: 'Insectivore: Catches flies, moths, and crickets with sticky tongue.',
        inspectData: { claws: 'Suction Disc Tips', toes: '4 Front / 5 Hind Discs', webbing: 'Partial', size: 'Tiny Disc' }
      },
      options: [
        { name: 'Tree Frog', emoji: '🐸', feature: 'Bulbous Toe Discs for Climbing' },
        { name: 'Mallard Duck', emoji: '🦆', feature: 'Fully Webbed Flat Paddles' },
        { name: 'Bengal Tiger', emoji: '🐯', feature: 'Heavy Padded Cat Paw' },
        { name: 'Golden Eagle', emoji: '🦅', feature: 'Sharp Talon Claws' },
        { name: 'White-Tailed Deer', emoji: '🦌', feature: 'Split Cloven Hoof' }
      ],
      audioFreq: 750
    }
  ]
};

export const FootprintDetectiveGame: React.FC<FootprintDetectiveGameProps> = ({
  currentLevel,
  onCorrect,
  onIncorrect
}) => {
  const levelCases = CASES_DATABASE[currentLevel] || CASES_DATABASE[1];
  const [caseIndex, setCaseIndex] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'anatomy' | 'habitat' | 'diet'>('anatomy');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentCase = levelCases[caseIndex % levelCases.length];

  const handlePlaySoundClue = () => {
    soundEngine.playLetterTone('F');
    setTimeout(() => soundEngine.playPop(), 120);
  };

  const handleSelectOption = (name: string) => {
    setSelectedOption(name);
    if (name === currentCase.animalName) {
      soundEngine.playCorrect();
      onCorrect(120);
      setTimeout(() => {
        setSelectedOption(null);
        setCaseIndex(prev => prev + 1);
      }, 1000);
    } else {
      soundEngine.playError();
      const hint = `Look closely at the ${activeTab} clue! ${currentCase.animalName} has ${currentCase.clues.inspectData.toes} and ${currentCase.clues.inspectData.claws}.`;
      onIncorrect(hint);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-between p-3 sm:p-5 rounded-3xl bg-gradient-to-b ${currentCase.bgColor} border-4 border-amber-300/40 shadow-2xl font-body select-none transition-all duration-300`}>
      
      {/* Detective Header & Badge */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-amber-400/30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            🕵️‍♂️
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
              {currentCase.caseNumber} • Level {currentLevel} Wildlife Investigation
            </span>
            <h2 className="text-sm sm:text-base font-black font-fun text-white flex items-center gap-1.5">
              <span>{currentCase.title}</span>
            </h2>
          </div>
        </div>

        {/* Environment Tag */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-200 font-bold flex items-center gap-1 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {currentCase.environment}
          </span>
          <button
            onClick={handlePlaySoundClue}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition"
            title="Listen to Sound Clue"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Audio Clue</span>
          </button>
        </div>
      </div>

      {/* Main Investigation Split Panel */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch mb-4">
        
        {/* LEFT PANEL: Interactive Footprint Canvas & Visualizer */}
        <div className="relative flex flex-col items-center justify-between bg-slate-950/90 rounded-2xl p-4 border-2 border-slate-800 shadow-inner overflow-hidden min-h-[260px]">
          {/* Header Bar */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              Mud Cast #00{currentLevel}
            </span>
            <button
              onClick={() => {
                soundEngine.playPop();
                setIsInspecting(!isInspecting);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black font-fun transition flex items-center gap-1 shadow-sm ${
                isInspecting ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {isInspecting ? 'Hide Scanner' : '🔍 Inspect Details'}
            </button>
          </div>

          {/* Footprint SVG Render Center */}
          <div className="relative my-3 w-44 h-44 flex items-center justify-center">
            <RenderFootprintSVG type={currentCase.trackType} isInspecting={isInspecting} />

            {/* Scanning Overlay Grid when Inspecting */}
            {isInspecting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 border-2 border-amber-400/60 rounded-full pointer-events-none flex flex-col items-center justify-between p-2 bg-amber-500/5 animate-pulse"
              >
                <div className="w-full flex justify-between text-[9px] font-mono text-amber-300 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded">
                  <span>CLAW: {currentCase.clues.inspectData.claws}</span>
                  <span>TOES: {currentCase.clues.inspectData.toes}</span>
                </div>
                <div className="w-full flex justify-between text-[9px] font-mono text-amber-300 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded">
                  <span>WEB: {currentCase.clues.inspectData.webbing}</span>
                  <span>SIZE: {currentCase.clues.inspectData.size}</span>
                </div>
              </motion.div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 text-center font-medium z-10">
            Tap <span className="text-amber-300 font-bold font-fun">Inspect Details</span> to scan toe pads & claw marks!
          </p>
        </div>

        {/* RIGHT PANEL: Clue Tabs & Detective Notebook */}
        <div className="flex flex-col justify-between bg-slate-900/90 rounded-2xl p-4 border-2 border-amber-400/20 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1 font-fun">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                Detective Evidence Clues
              </span>
            </div>

            {/* Clue Category Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 mb-3 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => { soundEngine.playPop(); setActiveTab('anatomy'); }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold font-fun transition ${
                  activeTab === 'anatomy' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🦶 Foot Anatomy
              </button>
              <button
                onClick={() => { soundEngine.playPop(); setActiveTab('habitat'); }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold font-fun transition ${
                  activeTab === 'habitat' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌲 Habitat
              </button>
              <button
                onClick={() => { soundEngine.playPop(); setActiveTab('diet'); }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold font-fun transition ${
                  activeTab === 'diet' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🍎 Diet & Habit
              </button>
            </div>

            {/* Clue Content Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30 text-slate-200 text-xs sm:text-sm font-semibold leading-relaxed min-h-[95px] flex items-center gap-2 shadow-inner">
              <div className="text-2xl shrink-0">
                {activeTab === 'anatomy' ? '🔬' : activeTab === 'habitat' ? '🗺️' : '🥗'}
              </div>
              <div>
                <span className="text-amber-400 font-bold block mb-0.5 uppercase text-[10px] tracking-wider font-fun">
                  {activeTab === 'anatomy' ? 'Clue #1: Track Structure' : activeTab === 'habitat' ? 'Clue #2: Trail Location' : 'Clue #3: Animal Habits'}
                </span>
                <p className="text-slate-100 font-medium">{currentCase.clues[activeTab]}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs font-bold text-amber-300 font-fun uppercase tracking-wider block">
              Identify the Mystery Animal Suspect Below:
            </span>
          </div>
        </div>
      </div>

      {/* Animal Suspect Cards Matrix */}
      <div className={`w-full grid gap-2.5 ${
        currentCase.options.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : currentCase.options.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-5'
      }`}>
        {currentCase.options.map((opt, idx) => {
          const isSelected = selectedOption === opt.name;
          const isCorrectChoice = opt.name === currentCase.animalName;

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt.name)}
              className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center transition-all duration-200 shadow-md active:scale-95 ${
                isSelected && isCorrectChoice
                  ? 'bg-emerald-500 text-white border-emerald-300 ring-4 ring-emerald-400/50 scale-105'
                  : isSelected && !isCorrectChoice
                  ? 'bg-rose-600 text-white border-rose-300 ring-4 ring-rose-400/50 animate-shake'
                  : 'bg-white hover:bg-amber-50 text-slate-900 border-slate-200 hover:border-amber-400'
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-1 drop-shadow-sm">{opt.emoji}</span>
              <span className="font-black font-fun text-sm sm:text-base leading-tight">
                {opt.name}
              </span>
              <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {opt.feature}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Vector Footprint Graphics Visualizer
const RenderFootprintSVG: React.FC<{ type: FootprintDetectiveGameProps['currentLevel'] extends number ? string : string; isInspecting: boolean }> = ({ type, isInspecting }) => {
  const highlightClass = isInspecting ? 'stroke-amber-400 stroke-2 fill-amber-400/20' : '';

  switch (type) {
    case 'bear':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Main Sole Pad */}
          <path d="M 30,55 C 20,65 25,90 50,90 C 75,90 80,65 70,55 C 60,48 40,48 30,55 Z" fill="#422006" className={highlightClass} />
          {/* 5 Toe Pads */}
          <ellipse cx="25" cy="38" rx="6" ry="8" fill="#422006" />
          <ellipse cx="37" cy="30" rx="6.5" ry="9" fill="#422006" />
          <ellipse cx="50" cy="28" rx="7" ry="9.5" fill="#422006" />
          <ellipse cx="63" cy="30" rx="6.5" ry="9" fill="#422006" />
          <ellipse cx="75" cy="38" rx="6" ry="8" fill="#422006" />
          {/* Extended Claws */}
          <path d="M 25,30 L 22,18" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
          <path d="M 37,21 L 35,10" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
          <path d="M 50,18.5 L 50,7" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 63,21 L 65,10" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
          <path d="M 75,30 L 78,18" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'duck':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Thin Webbed Paddle Skin */}
          <path d="M 50,75 L 18,30 C 30,42 40,40 50,38 C 60,40 70,42 82,30 Z" fill="#047857" opacity="0.6" className={highlightClass} />
          {/* 3 Long Toes */}
          <path d="M 50,75 L 18,30 M 50,75 L 50,22 M 50,75 L 82,30" stroke="#064E3B" strokeWidth="5" strokeLinecap="round" />
          {/* Small Rear Spur */}
          <path d="M 50,75 L 50,85" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'tiger':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* 3-lobed heel pad (NO CLAWS) */}
          <path d="M 32,55 C 20,65 30,88 50,88 C 70,88 80,65 68,55 C 60,48 40,48 32,55 Z" fill="#7C2D12" className={highlightClass} />
          {/* 4 Soft Round Toe Pads */}
          <circle cx="28" cy="40" r="8" fill="#7C2D12" />
          <circle cx="42" cy="30" r="9" fill="#7C2D12" />
          <circle cx="58" cy="30" r="9" fill="#7C2D12" />
          <circle cx="72" cy="40" r="8" fill="#7C2D12" />
        </svg>
      );

    case 'elephant':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Enormous Circular Cushioned Sole */}
          <circle cx="50" cy="52" r="38" fill="#78350F" className={highlightClass} />
          {/* Radial Cracks Pattern */}
          <path d="M 50,20 L 50,84 M 20,52 L 80,52 M 30,32 L 70,72 M 30,72 L 70,32" stroke="#451A03" strokeWidth="2.5" />
          {/* 4 Front Toenail Arches */}
          <path d="M 28,18 C 30,14 36,14 38,18" stroke="#FEF08A" strokeWidth="3" fill="none" />
          <path d="M 44,15 C 46,11 54,11 56,15" stroke="#FEF08A" strokeWidth="3" fill="none" />
          <path d="M 62,18 C 64,14 70,14 72,18" stroke="#FEF08A" strokeWidth="3" fill="none" />
        </svg>
      );

    case 'wolf':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Triangular Heel Pad */}
          <path d="M 35,60 C 30,72 40,82 50,82 C 60,82 70,72 65,60 C 58,52 42,52 35,60 Z" fill="#334155" className={highlightClass} />
          {/* 4 Toe Pads with Claw Dots */}
          <ellipse cx="30" cy="45" rx="6" ry="8" fill="#334155" />
          <ellipse cx="44" cy="35" rx="6.5" ry="9" fill="#334155" />
          <ellipse cx="56" cy="35" rx="6.5" ry="9" fill="#334155" />
          <ellipse cx="70" cy="45" rx="6" ry="8" fill="#334155" />
          {/* Claw Dot Marks */}
          <circle cx="30" cy="33" r="2.5" fill="#FDE047" />
          <circle cx="44" cy="22" r="2.5" fill="#FDE047" />
          <circle cx="56" cy="22" r="2.5" fill="#FDE047" />
          <circle cx="70" cy="33" r="2.5" fill="#FDE047" />
        </svg>
      );

    case 'eagle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* 3 Forward Needle Talons + 1 Rear */}
          <path d="M 50,60 L 20,25 M 50,60 L 50,15 M 50,60 L 80,25 M 50,60 L 50,88" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
          {/* Sharp Needle Claw Tips */}
          <circle cx="18" cy="22" r="3" fill="#EF4444" />
          <circle cx="50" cy="12" r="3" fill="#EF4444" />
          <circle cx="82" cy="22" r="3" fill="#EF4444" />
          <circle cx="50" cy="91" r="3" fill="#EF4444" />
        </svg>
      );

    case 'deer':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Two Heart-Shaped Cloven Hoof Halves */}
          <path d="M 46,25 C 46,25 25,45 30,75 C 33,85 46,85 46,65 Z" fill="#15803D" className={highlightClass} />
          <path d="M 54,25 C 54,25 75,45 70,75 C 67,85 54,85 54,65 Z" fill="#15803D" className={highlightClass} />
        </svg>
      );

    case 'rabbit':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Paired Elongated Hind Feet */}
          <ellipse cx="35" cy="40" rx="9" ry="25" fill="#1E40AF" className={highlightClass} />
          <ellipse cx="65" cy="40" rx="9" ry="25" fill="#1E40AF" className={highlightClass} />
          {/* Staggered Front Feet */}
          <ellipse cx="42" cy="78" rx="6" ry="10" fill="#1E40AF" />
          <ellipse cx="58" cy="84" rx="6" ry="10" fill="#1E40AF" />
        </svg>
      );

    case 'frog':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* 5-toed hind print with disc tips */}
          <path d="M 50,70 L 20,40 M 50,70 L 35,28 M 50,70 L 50,22 M 50,70 L 65,28 M 50,70 L 80,40" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <circle cx="18" cy="38" r="4" fill="#A3E635" />
          <circle cx="33" cy="25" r="4" fill="#A3E635" />
          <circle cx="50" cy="18" r="4" fill="#A3E635" />
          <circle cx="67" cy="25" r="4" fill="#A3E635" />
          <circle cx="82" cy="38" r="4" fill="#A3E635" />
        </svg>
      );

    default: // horse
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Solid U-Shaped Horseshoe Hoof */}
          <path d="M 22,75 C 18,35 40,20 50,20 C 60,20 82,35 78,75 L 62,75 C 64,45 55,32 50,32 C 45,32 36,45 38,75 Z" fill="#9A3412" className={highlightClass} />
          {/* Central Frog Wedge */}
          <polygon points="50,45 38,72 62,72" fill="#7C2D12" />
        </svg>
      );
  }
};
