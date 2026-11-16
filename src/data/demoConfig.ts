/**
 * Wonder World Kids Learning - Demo Restrictions Configuration
 * Defines the 2 free demo games per world (10 games total) and max level limits (Level 1 & 2 preview).
 */

export const ALLOWED_DEMO_GAMES_BY_WORLD: Record<string, string[]> = {
  world_math: ['game_dino_addition', 'game_shape_sorter_express'],
  world_phonics: ['game_word_builder_bee', 'game_phonics_popsicle'],
  world_geography: ['game_continent_jigsaw', 'game_flag_runner'],
  world_science: ['game_animal_sound_memory', 'game_footprint_detective'],
  world_logic: ['game_color_shadow_match', 'game_memory_card_flip']
};

export const ALLOWED_DEMO_GAMES: string[] = Object.values(ALLOWED_DEMO_GAMES_BY_WORLD).flat();

export const isGameAllowedInDemo = (gameId: string): boolean => {
  return ALLOWED_DEMO_GAMES.includes(gameId);
};

export const isLevelAllowedInDemo = (level: number): boolean => {
  return level <= 2;
};
