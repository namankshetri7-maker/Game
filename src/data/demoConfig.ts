/**
 * Wonder World Kids Learning - Demo Restrictions Configuration
 * Defines the 2 free demo games per world (10 games total) and max level limits (Level 1 & 2 preview).
 */

export const ALLOWED_DEMO_GAMES_BY_WORLD: Record<string, string[]> = {
  world_math: ['game_dino_addition', 'game_shape_sorter_express'],
  world_phonics: ['game_word_builder_bee', 'game_abc_phonics_pop'],
  world_geography: ['game_continent_jigsaw', 'game_flag_match_explorer'],
  world_science: ['game_animal_sound_memory', 'game_color_shadow_match'],
  world_logic: ['game_pattern_block_builder', 'game_memory_match_matrix']
};

export const ALLOWED_DEMO_GAMES: string[] = Object.values(ALLOWED_DEMO_GAMES_BY_WORLD).flat();

export const isGameAllowedInDemo = (gameId: string): boolean => {
  return ALLOWED_DEMO_GAMES.includes(gameId);
};

export const isLevelAllowedInDemo = (level: number): boolean => {
  return level <= 2;
};
