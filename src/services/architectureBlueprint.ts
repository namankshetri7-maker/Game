/**
 * Wonder World Kids Learning - Architecture Blueprint
 * Principal Mobile Game Architect & Senior Flutter/Flame / Unity Engineer Specifications
 */

export const ARCHITECTURE_BLUEPRINT = {
  appName: 'Wonder World Kids Learning',
  targetPlatforms: ['Android (Phones & Tablets)', 'iOS (iPads & iPhones)', 'Web (Preview & PWA)'],
  aspectRatiosSupported: ['16:9 (Standard Phones/Tablets)', '4:3 (iPads)', '16:10 (Android Tablets)', '19.5:9 (Modern Bezel-less)'],
  bundleTargetSize: '< 180 MB',

  folderStructureFlutter: `
wonder_world_app/
├── android/                   # Native Android wrapper, NDK, ProGuard rules
├── ios/                       # Xcode project, iPad target, Asset Catalogs
├── assets/
│   ├── audio/
│   │   ├── sfx/               # OGG/Opus compressed sound fx (pop, snap, fanfare)
│   │   └── music/             # Low-bitrate loopable ambient audio (<256kbps)
│   ├── images/
│   │   ├── vector/            # SVG icons, world map vector paths
│   │   └── sprites/           # WebP compressed sprite atlases (2x, 3x)
│   ├── fonts/                 # WOFF2/TTF Fredoka & Quicksand
│   └── data/                  # Bundled offline JSON dictionaries & math curricula
├── lib/
│   ├── main.dart              # App bootstrap & orientation lock
│   ├── core/
│   │   ├── architecture/      # Clean architecture abstractions
│   │   │   ├── base_bloc.dart
│   │   │   └── base_repository.dart
│   │   ├── audio/
│   │   │   ├── sound_engine.dart # Procedural synthesizers & audioplayers
│   │   │   └── audio_feedback_manager.dart
│   │   ├── coppa/
│   │   │   ├── parent_gate_service.dart
│   │   │   └── screen_time_watchdog.dart
│   │   ├── difficulty/
│   │   │   └── dynamic_difficulty_engine.dart
│   │   ├── storage/
│   │   │   ├── sqlite_database.dart # Local SQLite schema & migrations
│   │   │   └── local_storage_service.dart
│   │   └── theme/
│   │       ├── app_colors.dart
│   │       └── kid_typography.dart
│   ├── engine/
│   │   ├── base_mini_game.dart # Abstract BaseMiniGame controller
│   │   ├── flame_game_bridge.dart # Flame GameWidget viewport & canvas
│   │   ├── touch_hit_test.dart # 20dp finger padding & 35px snap detector
│   │   └── particle_engine.dart # Starbursts, confetti, sparkle bursts
│   ├── features/
│   │   ├── home_map/          # 2D Interactive World Map
│   │   │   ├── presentation/
│   │   │   └── domain/
│   │   ├── parent_dashboard/  # Offline analytics, profiles & COPPA lock
│   │   │   ├── presentation/
│   │   │   └── domain/
│   │   ├── profile_selector/  # Child switcher (up to 4 children)
│   │   ├── sticker_book/      # Reward room & interactive sticker canvas
│   │   └── mini_games/        # The 5 Thematic Worlds (45 mini-games)
│   │       ├── world1_math/
│   │       │   ├── dino_addition/
│   │       │   ├── shape_sorter/
│   │       │   └── ...
│   │       ├── world2_phonics/
│   │       │   ├── word_builder_bee/
│   │       │   └── ...
│   │       ├── world3_geography/
│   │       │   ├── continent_jigsaw/
│   │       │   └── ...
│   │       ├── world4_science/
│   │       │   ├── animal_sound_memory/
│   │       │   └── ...
│   │       └── world5_logic/
│   └── shared_widgets/
│       ├── universal_win_modal.dart
│       ├── pause_dialog.dart
│       └── draggable_game_item.dart
└── test/                      # Offline unit and widget tests
`,

  cleanArchitectureLayers: [
    {
      layer: 'Presentation Layer',
      responsibility: 'Flame Canvas / React Canvas UI, responsive scaling with aspect ratio letterboxing/fitting, animated particles, large touch targets (+20dp padding).'
    },
    {
      layer: 'Engine Domain Layer',
      responsibility: 'BaseMiniGame state machine, DynamicDifficultyEngine rules per age bracket (3-4, 5-7, 8-10), snap calculation (distance <= 35px).'
    },
    {
      layer: 'Data & Storage Layer',
      responsibility: '100% offline persistence (SQLite/localStorage), PlayerProfile repository, GameProgress logs, zero network permissions.'
    },
    {
      layer: 'Safety & Compliance Layer',
      responsibility: 'COPPA Parent Gate barrier with randomized questions, zero advertising SDKs, screen time limits watchdog.'
    }
  ],

  bundleOptimizationStrategies: [
    'Vector Graphics (SVG) for map paths & UI icons instead of high-res PNGs saves ~60MB',
    'Compressed WebP texture atlases with mipmapping for game sprites',
    'Procedural Web Audio synthesizers / synthesized waveforms reduce SFX asset requirements to zero',
    'Offline level definitions stored as structured JSON/SQLite tables',
    'ProGuard/R8 code shrinking & dead-code stripping configured for production builds'
  ]
};
