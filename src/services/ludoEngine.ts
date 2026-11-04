/**
 * Wonder World Offline Ludo Engine
 * 100% Client-side, zero network dependencies, authentic Ludo game rules.
 *
 * Board Architecture:
 * - 4 Color Quadrants: Red (0), Green (1), Yellow (2), Blue (3)
 * - 52 Main Circuit Track Steps (0 to 51)
 * - 4 Home Stretches (5 steps each) + 4 Goal Castles
 * - 8 Safe Star Positions (Starting squares 0, 13, 26, 39 + Milestone stars 8, 21, 34, 47)
 * - Kid-friendly options: "Roll 6 to Hatch" or "Roll 1 or 6 to Hatch"
 * - Smart offline heuristic bot with collision capture priorities
 */

export type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

export interface LudoToken {
  id: number; // 0..3
  color: LudoColor;
  state: 'yard' | 'track' | 'home_stretch' | 'goal';
  position: number; // 0..51 for track, 0..4 for home_stretch, 5 = goal
  trackStepsTraveled: number; // 0..56 (51 on track + 5 on stretch + 1 for goal)
}

export interface LudoPlayer {
  id: number;
  name: string;
  avatar: string;
  color: LudoColor;
  hex: string;
  isBot: boolean;
  tokens: LudoToken[];
  hasWon: boolean;
}

export interface LudoMove {
  tokenId: number;
  fromState: 'yard' | 'track' | 'home_stretch';
  fromPos: number;
  toState: 'track' | 'home_stretch' | 'goal';
  toPos: number;
  isCapture: boolean;
  capturedPlayerId?: number;
  capturedTokenId?: number;
  isGoal: boolean;
}

// Starting tile index on the 52-tile circuit for each player
export const LUDO_START_POSITIONS: Record<LudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

// Tile index where each player exits the 52-tile circuit into their Home Stretch
export const LUDO_HOME_ENTRY_POSITIONS: Record<LudoColor, number> = {
  red: 50,
  green: 11,
  yellow: 24,
  blue: 37
};

// 8 Safe Star positions on the 52-tile circuit (tokens cannot be captured here)
export const LUDO_SAFE_TILES = [0, 8, 13, 21, 26, 34, 39, 47];

// Standard 15x15 Ludo Grid Coordinates for the 52 track steps (0 to 14)
export const LUDO_CIRCUIT_COORDS: Array<{ x: number; y: number }> = [
  // Red side to Green (0 to 12)
  { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
  { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
  { x: 7, y: 0 },
  { x: 8, y: 0 },
  // Green side to Yellow (13 to 25)
  { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 },
  { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
  { x: 14, y: 7 },
  { x: 14, y: 8 },
  // Yellow side to Blue (26 to 38)
  { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 },
  { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 },
  { x: 7, y: 14 },
  { x: 6, y: 14 },
  // Blue side back to Red (39 to 51)
  { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 },
  { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 },
  { x: 0, y: 7 },
  { x: 0, y: 6 }
];

// Home stretch runway coordinates (5 steps leading into center triangle)
export const LUDO_HOME_STRETCH_COORDS: Record<LudoColor, Array<{ x: number; y: number }>> = {
  red: [
    { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }
  ],
  green: [
    { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }
  ],
  yellow: [
    { x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }
  ],
  blue: [
    { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }
  ]
};

// Yard (Home Base) coordinates for 4 tokens in each quadrant
export const LUDO_YARD_COORDS: Record<LudoColor, Array<{ x: number; y: number }>> = {
  red: [
    { x: 2, y: 2 }, { x: 3.5, y: 2 }, { x: 2, y: 3.5 }, { x: 3.5, y: 3.5 }
  ],
  green: [
    { x: 11, y: 2 }, { x: 12.5, y: 2 }, { x: 11, y: 3.5 }, { x: 12.5, y: 3.5 }
  ],
  yellow: [
    { x: 11, y: 11 }, { x: 12.5, y: 11 }, { x: 11, y: 12.5 }, { x: 12.5, y: 12.5 }
  ],
  blue: [
    { x: 2, y: 11 }, { x: 3.5, y: 11 }, { x: 2, y: 12.5 }, { x: 3.5, y: 12.5 }
  ]
};

// Center Goal Coordinates
export const LUDO_GOAL_COORDS: Record<LudoColor, { x: number; y: number }> = {
  red: { x: 6.2, y: 7 },
  green: { x: 7, y: 6.2 },
  yellow: { x: 7.8, y: 7 },
  blue: { x: 7, y: 7.8 }
};

export class LudoEngine {
  /**
   * Calculate all valid moves for a player given a dice roll
   */
  static getValidMoves(
    player: LudoPlayer,
    allPlayers: LudoPlayer[],
    diceRoll: number,
    easyHatch: boolean = true // allows rolling 1 or 6 to hatch for young children
  ): LudoMove[] {
    const validMoves: LudoMove[] = [];
    const canHatch = easyHatch ? (diceRoll === 6 || diceRoll === 1) : (diceRoll === 6);

    player.tokens.forEach(token => {
      // 1. Token in Yard
      if (token.state === 'yard') {
        if (canHatch) {
          const startTile = LUDO_START_POSITIONS[player.color];
          // Check if start tile already has own token
          const ownAtStart = player.tokens.some(t => t.state === 'track' && t.position === startTile);
          if (!ownAtStart) {
            // Check if opponent token is on start tile (capturable)
            let captureTarget: { playerId: number; tokenId: number } | undefined;
            allPlayers.forEach(other => {
              if (other.id !== player.id) {
                other.tokens.forEach(ot => {
                  if (ot.state === 'track' && ot.position === startTile) {
                    captureTarget = { playerId: other.id, tokenId: ot.id };
                  }
                });
              }
            });

            validMoves.push({
              tokenId: token.id,
              fromState: 'yard',
              fromPos: -1,
              toState: 'track',
              toPos: startTile,
              isCapture: !!captureTarget,
              capturedPlayerId: captureTarget?.playerId,
              capturedTokenId: captureTarget?.tokenId,
              isGoal: false
            });
          }
        }
        return;
      }

      // 2. Token on Main Circuit Track
      if (token.state === 'track') {
        const totalTraveledIfMove = token.trackStepsTraveled + diceRoll;

        // If move stays on track before home stretch (needs 51 steps to enter home stretch)
        if (totalTraveledIfMove <= 50) {
          const targetPos = (token.position + diceRoll) % 52;

          // Check if own token already on target
          const ownAtTarget = player.tokens.some(
            t => t.id !== token.id && t.state === 'track' && t.position === targetPos
          );

          if (!ownAtTarget) {
            const isSafe = LUDO_SAFE_TILES.includes(targetPos);
            let captureTarget: { playerId: number; tokenId: number } | undefined;

            if (!isSafe) {
              allPlayers.forEach(other => {
                if (other.id !== player.id) {
                  other.tokens.forEach(ot => {
                    if (ot.state === 'track' && ot.position === targetPos) {
                      captureTarget = { playerId: other.id, tokenId: ot.id };
                    }
                  });
                }
              });
            }

            validMoves.push({
              tokenId: token.id,
              fromState: 'track',
              fromPos: token.position,
              toState: 'track',
              toPos: targetPos,
              isCapture: !!captureTarget,
              capturedPlayerId: captureTarget?.playerId,
              capturedTokenId: captureTarget?.tokenId,
              isGoal: false
            });
          }
        } else if (totalTraveledIfMove <= 56) {
          // Entering Home Stretch (steps 51 to 55) or Goal (step 56)
          const homeIndex = totalTraveledIfMove - 51; // 0..5

          if (homeIndex === 5) {
            // Exact landing in Goal Castle!
            validMoves.push({
              tokenId: token.id,
              fromState: 'track',
              fromPos: token.position,
              toState: 'goal',
              toPos: 5,
              isCapture: false,
              isGoal: true
            });
          } else if (homeIndex < 5) {
            // In Home Stretch
            const ownAtHome = player.tokens.some(
              t => t.id !== token.id && t.state === 'home_stretch' && t.position === homeIndex
            );
            if (!ownAtHome) {
              validMoves.push({
                tokenId: token.id,
                fromState: 'track',
                fromPos: token.position,
                toState: 'home_stretch',
                toPos: homeIndex,
                isCapture: false,
                isGoal: false
              });
            }
          }
        }
        return;
      }

      // 3. Token already in Home Stretch
      if (token.state === 'home_stretch') {
        const nextHomePos = token.position + diceRoll;
        if (nextHomePos === 5) {
          // Goal!
          validMoves.push({
            tokenId: token.id,
            fromState: 'home_stretch',
            fromPos: token.position,
            toState: 'goal',
            toPos: 5,
            isCapture: false,
            isGoal: true
          });
        } else if (nextHomePos < 5) {
          const ownAtHome = player.tokens.some(
            t => t.id !== token.id && t.state === 'home_stretch' && t.position === nextHomePos
          );
          if (!ownAtHome) {
            validMoves.push({
              tokenId: token.id,
              fromState: 'home_stretch',
              fromPos: token.position,
              toState: 'home_stretch',
              toPos: nextHomePos,
              isCapture: false,
              isGoal: false
            });
          }
        }
      }
    });

    return validMoves;
  }

  /**
   * Apply a move and return the updated player list
   */
  static applyMove(
    players: LudoPlayer[],
    activePlayerId: number,
    move: LudoMove,
    diceRoll: number
  ): {
    nextPlayers: LudoPlayer[];
    captured: boolean;
    reachedGoal: boolean;
    extraTurn: boolean;
  } {
    let captured = false;
    let reachedGoal = false;

    const nextPlayers = players.map(p => {
      // 1. Update active player's moving token
      if (p.id === activePlayerId) {
        const updatedTokens = p.tokens.map(t => {
          if (t.id === move.tokenId) {
            const nextTraveled =
              move.fromState === 'yard' ? 0 : t.trackStepsTraveled + diceRoll;
            if (move.toState === 'goal') {
              reachedGoal = true;
            }
            return {
              ...t,
              state: move.toState,
              position: move.toPos,
              trackStepsTraveled: nextTraveled
            };
          }
          return t;
        });

        const hasWon = updatedTokens.every(t => t.state === 'goal');
        return { ...p, tokens: updatedTokens, hasWon };
      }

      // 2. Handle captured token if applicable
      if (move.isCapture && p.id === move.capturedPlayerId) {
        captured = true;
        const resetTokens = p.tokens.map(t => {
          if (t.id === move.capturedTokenId) {
            return {
              ...t,
              state: 'yard' as const,
              position: -1,
              trackStepsTraveled: 0
            };
          }
          return t;
        });
        return { ...p, tokens: resetTokens };
      }

      return p;
    });

    // An extra turn is awarded on rolling a 6 OR capturing an opponent's token OR reaching goal
    const extraTurn = diceRoll === 6 || captured || reachedGoal;

    return { nextPlayers, captured, reachedGoal, extraTurn };
  }

  /**
   * Heuristic Bot Decision Maker for Offline AI
   */
  static chooseBotMove(
    validMoves: LudoMove[],
    player: LudoPlayer,
    allPlayers: LudoPlayer[]
  ): LudoMove {
    if (validMoves.length === 1) return validMoves[0];

    let bestScore = -Infinity;
    let bestMove = validMoves[0];

    validMoves.forEach(m => {
      let score = 0;

      // 1. Top Priority: Reaching Goal (+120)
      if (m.isGoal) {
        score += 120;
      }

      // 2. High Priority: Capturing opponent (+100)
      if (m.isCapture) {
        score += 100;
      }

      // 3. High Priority: Entering Home Stretch (cannot be captured anymore) (+60)
      if (m.toState === 'home_stretch' && m.fromState === 'track') {
        score += 60;
      }

      // 4. Landing on a Safe Star (+45)
      if (m.toState === 'track' && LUDO_SAFE_TILES.includes(m.toPos)) {
        score += 45;
      }

      // 5. Hatching from yard (+40 if few tokens on track)
      if (m.fromState === 'yard') {
        const tokensOnTrack = player.tokens.filter(t => t.state === 'track').length;
        score += tokensOnTrack === 0 ? 55 : 35;
      }

      // 6. Progress on track: prefer advancing token further along
      if (m.fromState === 'track') {
        const token = player.tokens.find(t => t.id === m.tokenId);
        if (token) {
          score += Math.floor(token.trackStepsTraveled * 0.5);
        }
      }

      // 7. Check if destination tile is dangerously in range of opponent token behind it (1 to 6 steps)
      if (m.toState === 'track' && !LUDO_SAFE_TILES.includes(m.toPos)) {
        let inDanger = false;
        allPlayers.forEach(other => {
          if (other.id !== player.id) {
            other.tokens.forEach(ot => {
              if (ot.state === 'track') {
                const dist = (m.toPos - ot.position + 52) % 52;
                if (dist >= 1 && dist <= 6) {
                  inDanger = true;
                }
              }
            });
          }
        });
        if (inDanger) {
          score -= 25;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    });

    return bestMove;
  }
}
