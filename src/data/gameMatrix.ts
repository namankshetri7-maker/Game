/**
 * Complete 40+ (45 Games) Mini-Game Matrix and World Definitions
 * Designed for 100% offline bundling with age group segmentation.
 */

import { MiniGameMeta, WorldMeta } from '../types/game';

export const WORLDS: WorldMeta[] = [
  {
    id: 'world_math',
    subject: 'math',
    title: 'Math Magic Valley',
    subtitle: 'Numbers, Shapes & Logic Calculations',
    themeColor: '#3B82F6',
    bgGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    icon: '🔢',
    gameCount: 10,
    description: 'Explore the mystical valley where numbers dance, dinosaurs crunch equations, and pizzas teach fractions!'
  },
  {
    id: 'world_phonics',
    subject: 'phonics',
    title: 'English & Phonics Jungle',
    subtitle: 'Letters, Sounds, Rhymes & Words',
    themeColor: '#10B981',
    bgGradient: 'from-emerald-600 via-teal-600 to-green-500',
    icon: '🦁',
    gameCount: 10,
    description: 'Swing through the lush canopy to pop phonics bubbles, build honeycomb words, and discover sight words!'
  },
  {
    id: 'world_geography',
    subject: 'geography',
    title: 'World Geography & Cultures',
    subtitle: 'Continents, Oceans, Flags & Wonders',
    themeColor: '#F59E0B',
    bgGradient: 'from-amber-500 via-orange-600 to-yellow-500',
    icon: '🌍',
    gameCount: 10,
    description: 'Travel the seven seas, assemble continents jigsaw, discover landmarks, and learn how kids dress around Earth!'
  },
  {
    id: 'world_science',
    subject: 'science',
    title: 'Animal Kingdom & Science',
    subtitle: 'Creatures, Habitats, Cycles & Nature',
    themeColor: '#EC4899',
    bgGradient: 'from-pink-600 via-rose-600 to-red-500',
    icon: '🐾',
    gameCount: 10,
    description: 'Listen to animal calls, solve footprint mysteries, match mama and babies, and trace life cycle wheels!'
  },
  {
    id: 'world_logic',
    subject: 'logic',
    title: 'Logic, Brain & Creativity',
    subtitle: 'Mazes, Shadows, Colors & Memory',
    themeColor: '#8B5CF6',
    bgGradient: 'from-purple-600 via-violet-600 to-fuchsia-500',
    icon: '🧩',
    gameCount: 5,
    description: 'Challenge your spatial reasoning with shadow matching, pixel art coloring, dot connects, and memory grids!'
  }
];

export const MINI_GAMES_MATRIX: MiniGameMeta[] = [
  // ================= WORLD 1: MATH MAGIC VALLEY =================
  {
    id: 'game_dino_addition',
    worldId: 'world_math',
    subject: 'math',
    title: 'Dino Addition',
    number: 1,
    ageRecommendation: 'Ages 3–10 (Adaptive)',
    skills: ['Addition', 'Number Sense', 'Draggable Counters'],
    icon: '🦕',
    playable: true
  },
  {
    id: 'game_number_safari',
    worldId: 'world_math',
    subject: 'math',
    title: 'Number Safari',
    number: 2,
    ageRecommendation: 'Ages 3–6',
    skills: ['Counting 1-20', 'Visual Quantity', 'Animal Spotting'],
    icon: '🦓',
    playable: true
  },
  {
    id: 'game_subtraction_bakery',
    worldId: 'world_math',
    subject: 'math',
    title: 'Subtraction Bakery',
    number: 3,
    ageRecommendation: 'Ages 4–8',
    skills: ['Subtraction', 'Cupcake Equations', 'Visual Removal'],
    icon: '🧁',
    playable: true
  },
  {
    id: 'game_shape_sorter_express',
    worldId: 'world_math',
    subject: 'math',
    title: 'Shape Sorter Express',
    number: 4,
    ageRecommendation: 'Ages 3–7',
    skills: ['2D/3D Geometry', 'Shape Matching', 'Spatial Reasoning'],
    icon: '🔷',
    playable: true
  },
  {
    id: 'game_multiplication_blitz',
    worldId: 'world_math',
    subject: 'math',
    title: 'Multiplication Blitz',
    number: 5,
    ageRecommendation: 'Ages 7–10',
    skills: ['Times Tables', 'Monster Zapping', 'Mental Math'],
    icon: '⚡',
    playable: true
  },
  {
    id: 'game_fraction_pizza_party',
    worldId: 'world_math',
    subject: 'math',
    title: 'Fraction Pizza Party',
    number: 6,
    ageRecommendation: 'Ages 5–10',
    skills: ['Fractions', 'Halves/Thirds/Quarters', 'Visual Slicing'],
    icon: '🍕',
    playable: true
  },
  {
    id: 'game_clockwork_owl',
    worldId: 'world_math',
    subject: 'math',
    title: 'Clockwork Owl',
    number: 7,
    ageRecommendation: 'Ages 5–9',
    skills: ['Analog & Digital Time', 'Hour/Minute Hands', 'Daily Schedules'],
    icon: '🦉',
    playable: true
  },
  {
    id: 'game_pattern_train',
    worldId: 'world_math',
    subject: 'math',
    title: 'Pattern Train',
    number: 8,
    ageRecommendation: 'Ages 3–8',
    skills: ['Sequencing (AB/ABC/AABB)', 'Color & Shape Logic'],
    icon: '🚂',
    playable: true
  },
  {
    id: 'game_coin_counter_market',
    worldId: 'world_math',
    subject: 'math',
    title: 'Coin Counter Market',
    number: 9,
    ageRecommendation: 'Ages 6–10',
    skills: ['Money Counting', 'Currency Values', 'Making Change'],
    icon: '🪙',
    playable: true
  },
  {
    id: 'game_greater_dragon_scales',
    worldId: 'world_math',
    subject: 'math',
    title: 'Greater Dragon Scales',
    number: 10,
    ageRecommendation: 'Ages 4–9',
    skills: ['Comparisons (>, <, =)', 'Weight & Quantity Balancing'],
    icon: '⚖️',
    playable: true
  },

  // ================= WORLD 2: ENGLISH & PHONICS JUNGLE =================
  {
    id: 'game_word_builder_bee',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Word Builder Bee',
    number: 11,
    ageRecommendation: 'Ages 3–10 (Adaptive)',
    skills: ['CVC Words', 'Spelling', 'Phonics Honeycombs'],
    icon: '🐝',
    playable: true
  },
  {
    id: 'game_phonics_popsicle',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Phonics Popsicle',
    number: 12,
    ageRecommendation: 'Ages 3–6',
    skills: ['Letter Sounds', 'Bubble Popping', 'Initial Phonemes'],
    icon: '🍧',
    playable: true
  },
  {
    id: 'game_abc_letter_trace',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'ABC Letter Trace',
    number: 13,
    ageRecommendation: 'Ages 3–5',
    skills: ['Motor Skills', 'Letter Formation', 'Particle Tracing'],
    icon: '✍️',
    playable: true
  },
  {
    id: 'game_rhyme_time_rocket',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Rhyme Time Rocket',
    number: 14,
    ageRecommendation: 'Ages 4–7',
    skills: ['Rhyming Pairs', 'Phonological Awareness', 'Auditory Clues'],
    icon: '🚀',
    playable: true
  },
  {
    id: 'game_sight_word_treasure_hunt',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Sight Word Treasure Hunt',
    number: 15,
    ageRecommendation: 'Ages 4–8',
    skills: ['High-Frequency Sight Words', 'Audio Clues', 'Treasure Chests'],
    icon: '🗝️',
    playable: true
  },
  {
    id: 'game_vowel_voyage',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Vowel Voyage',
    number: 16,
    ageRecommendation: 'Ages 5–9',
    skills: ['Short vs Long Vowels', 'Boat Cargo Sorting'],
    icon: '⛵',
    playable: true
  },
  {
    id: 'game_grammar_safari',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Grammar Safari',
    number: 17,
    ageRecommendation: 'Ages 6–10',
    skills: ['Nouns, Verbs, Adjectives', 'Leaf Sorting', 'Parts of Speech'],
    icon: '🍃',
    playable: true
  },
  {
    id: 'game_opposite_animals',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Opposite Animals',
    number: 18,
    ageRecommendation: 'Ages 3–6',
    skills: ['Antonyms', 'Big/Small, Fast/Slow', 'Card Matching'],
    icon: '🦒',
    playable: true
  },
  {
    id: 'game_sentence_builder_express',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Sentence Builder Express',
    number: 19,
    ageRecommendation: 'Ages 6–10',
    skills: ['Syntax & Punctuation', 'Sentence Block Assembly'],
    icon: '🧩',
    playable: true
  },
  {
    id: 'game_spelling_bee_match',
    worldId: 'world_phonics',
    subject: 'phonics',
    title: 'Spelling Bee Match',
    number: 20,
    ageRecommendation: 'Ages 6–10',
    skills: ['Unscrambling', 'Vocabulary Expansion', 'Timed Spelling'],
    icon: '🍯',
    playable: true
  },

  // ================= WORLD 3: WORLD GEOGRAPHY & CULTURES =================
  {
    id: 'game_continent_jigsaw',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Continent Jigsaw',
    number: 21,
    ageRecommendation: 'Ages 3–10 (Adaptive)',
    skills: ['7 Continents', 'Spatial Map Jigsaw', 'Global Geography'],
    icon: '🗺️',
    playable: true
  },
  {
    id: 'game_flag_runner',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Flag Runner',
    number: 22,
    ageRecommendation: 'Ages 5–10',
    skills: ['Country Flags', 'Silhouettes', 'Pattern Recognition'],
    icon: '🏁',
    playable: true
  },
  {
    id: 'game_landmark_builder',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Landmark Builder',
    number: 23,
    ageRecommendation: 'Ages 5–10',
    skills: ['Pyramids, Eiffel Tower, Taj Mahal', 'World Heritage'],
    icon: '🏛️',
    playable: true
  },
  {
    id: 'game_capital_city_quiz',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Capital City Quiz',
    number: 24,
    ageRecommendation: 'Ages 7–10',
    skills: ['Capital Cities', 'Interactive Tap Map', 'Trivia'],
    icon: '📍',
    playable: true
  },
  {
    id: 'game_animal_habitat_map',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Animal Habitat Map',
    number: 25,
    ageRecommendation: 'Ages 4–9',
    skills: ['Fauna Origins (Kangaroos, Pandas)', 'Continental Habitats'],
    icon: '🦘',
    playable: true
  },
  {
    id: 'game_ocean_depth_explorer',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Ocean Depth Explorer',
    number: 26,
    ageRecommendation: 'Ages 5–10',
    skills: ['5 Oceans', 'Sunlight/Twilight/Abyss Zones', 'Marine Biology'],
    icon: '🌊',
    playable: true
  },
  {
    id: 'game_globe_spinner',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Globe Spinner',
    number: 27,
    ageRecommendation: 'Ages 4–10',
    skills: ['3D Hemispheres', 'Equator & Poles', 'Axis Rotation'],
    icon: '🌐',
    playable: true
  },
  {
    id: 'game_climate_dress_up',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Climate & Dress-Up',
    number: 28,
    ageRecommendation: 'Ages 3–7',
    skills: ['Tropical vs Polar vs Desert', 'Weather & Clothing Logic'],
    icon: '🧥',
    playable: true
  },
  {
    id: 'game_world_music_tap',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'World Music Tap',
    number: 29,
    ageRecommendation: 'Ages 4–9',
    skills: ['Traditional Instruments (Didgeridoo, Sitar)', 'Rhythm'],
    icon: '🪘',
    playable: true
  },
  {
    id: 'game_compass_navigator',
    worldId: 'world_geography',
    subject: 'geography',
    title: 'Compass Navigator',
    number: 30,
    ageRecommendation: 'Ages 6–10',
    skills: ['Cardinal Directions (N, S, E, W)', 'Ship Navigation'],
    icon: '🧭',
    playable: true
  },

  // ================= WORLD 4: ANIMAL KINGDOM & SCIENCE =================
  {
    id: 'game_animal_sound_memory',
    worldId: 'world_science',
    subject: 'science',
    title: 'Animal Sound Memory',
    number: 31,
    ageRecommendation: 'Ages 3–8',
    skills: ['Auditory Memory', 'Animal Sounds', 'Concentration Grid'],
    icon: '🐮',
    playable: true
  },
  {
    id: 'game_food_chain_sorting',
    worldId: 'world_science',
    subject: 'science',
    title: 'Food Chain Sorting',
    number: 32,
    ageRecommendation: 'Ages 5–10',
    skills: ['Herbivore, Carnivore, Omnivore', 'Food Webs'],
    icon: '🌿',
    playable: true
  },
  {
    id: 'game_footprint_detective',
    worldId: 'world_science',
    subject: 'science',
    title: 'Footprint Detective',
    number: 33,
    ageRecommendation: 'Ages 4–8',
    skills: ['Paw & Hoof Matching', 'Observation', 'Tracking'],
    icon: '🐾',
    playable: true
  },
  {
    id: 'game_mama_baby_match',
    worldId: 'world_science',
    subject: 'science',
    title: 'Mama & Baby Match',
    number: 34,
    ageRecommendation: 'Ages 3–6',
    skills: ['Offspring Names (Cub, Joey, Calf)', 'Parent Connections'],
    icon: '🦆',
    playable: true
  },
  {
    id: 'game_camouflage_seek',
    worldId: 'world_science',
    subject: 'science',
    title: 'Camouflage Seek',
    number: 35,
    ageRecommendation: 'Ages 4–9',
    skills: ['Visual Acuity', 'Nature Camouflage (Chameleon, Stick Bug)'],
    icon: '🦎',
    playable: true
  },
  {
    id: 'game_life_cycle_wheel',
    worldId: 'world_science',
    subject: 'science',
    title: 'Life Cycle Wheel',
    number: 36,
    ageRecommendation: 'Ages 5–10',
    skills: ['Butterfly, Frog, Plant Metamorphosis', 'Cycle Sequencing'],
    icon: '🐛',
    playable: true
  },
  {
    id: 'game_bird_beak_match',
    worldId: 'world_science',
    subject: 'science',
    title: 'Bird Beak & Food Match',
    number: 37,
    ageRecommendation: 'Ages 6–10',
    skills: ['Biological Adaptation', 'Pelican, Hummingbird, Eagle beaks'],
    icon: '🦜',
    playable: true
  },
  {
    id: 'game_domain_classifier',
    worldId: 'world_science',
    subject: 'science',
    title: 'Domain Classifier',
    number: 38,
    ageRecommendation: 'Ages 3–7',
    skills: ['Land, Air, Water Animals', 'Sorting Categories'],
    icon: '🐬',
    playable: true
  },
  {
    id: 'game_nocturnal_diurnal',
    worldId: 'world_science',
    subject: 'science',
    title: 'Nocturnal vs Diurnal',
    number: 39,
    ageRecommendation: 'Ages 4–8',
    skills: ['Day vs Night Creature Habits', 'Bat, Owl, Sun Animals'],
    icon: '🌙',
    playable: true
  },
  {
    id: 'game_pet_care_clinic',
    worldId: 'world_science',
    subject: 'science',
    title: 'Pet Care Clinic',
    number: 40,
    ageRecommendation: 'Ages 4–8',
    skills: ['Animal Anatomy', 'Empathy', 'Basic Veterinary Care'],
    icon: '🩺',
    playable: true
  },

  // ================= WORLD 5: LOGIC, BRAIN & CREATIVITY =================
  {
    id: 'game_color_shadow_match',
    worldId: 'world_logic',
    subject: 'logic',
    title: 'Color & Shadow Match',
    number: 41,
    ageRecommendation: 'Ages 3–6',
    skills: ['Silhouette Matching', 'Visual Discrimination', 'Shapes'],
    icon: '👤',
    playable: true
  },
  {
    id: 'game_connect_the_dots',
    worldId: 'world_logic',
    subject: 'logic',
    title: 'Connect the Dots',
    number: 42,
    ageRecommendation: 'Ages 4–8',
    skills: ['Numerical Order', 'Alphabetical Order', 'Fine Motor Control'],
    icon: '✏️',
    playable: true
  },
  {
    id: 'game_pixel_art_coloring',
    worldId: 'world_logic',
    subject: 'logic',
    title: 'Pixel Art Coloring',
    number: 43,
    ageRecommendation: 'Ages 4–10',
    skills: ['Color by Number', 'Patience', 'Creative Canvas'],
    icon: '🎨',
    playable: true
  },
  {
    id: 'game_kids_maze_runner',
    worldId: 'world_logic',
    subject: 'logic',
    title: 'Kids Maze Runner',
    number: 44,
    ageRecommendation: 'Ages 4–9',
    skills: ['Spatial Navigation', 'Pathfinding', 'Obstacle Avoidance'],
    icon: '🌀',
    playable: true
  },
  {
    id: 'game_memory_card_flip',
    worldId: 'world_logic',
    subject: 'logic',
    title: 'Memory Card Flip',
    number: 45,
    ageRecommendation: 'Ages 3–10 (Adaptive)',
    skills: ['Visual Working Memory', 'Pair Matching', 'Pattern Recall'],
    icon: '🃏',
    playable: true
  }
];
