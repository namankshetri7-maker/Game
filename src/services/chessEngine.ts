/**
 * Wonder World Offline Chess Engine
 * 100% Client-side, zero network dependencies, authentic Chess rules.
 *
 * Capabilities:
 * - 8x8 Standard Chess & 6x6 Junior Mini-Chess
 * - Full piece move generation (Pawns, Knights, Bishops, Rooks, Queens, Kings)
 * - Castling (Kingside & Queenside), En Passant, Pawn Promotion
 * - Check, Checkmate & Stalemate detection
 * - Illegal move filtering (King cannot move into check or remain in check)
 * - Move history with standard Algebraic Notation (SAN)
 * - Move Undo capability
 * - Offline Minimax Bot AI with 3 kid-friendly levels (Pip, Barnaby, Luna)
 */

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface ChessPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export type BoardSquare = ChessPiece | null;
export type ChessBoard = BoardSquare[][];

export interface ChessMove {
  from: [number, number];
  to: [number, number];
  piece: ChessPiece;
  captured?: ChessPiece;
  isEnPassant?: boolean;
  isCastling?: 'kingside' | 'queenside';
  promotionType?: PieceType;
  san?: string; // e.g. "e4", "Nf3", "Bxf7+", "O-O"
}

export interface ChessGameState {
  board: ChessBoard;
  turn: PieceColor;
  mode: 'standard' | 'junior'; // 'standard' = 8x8, 'junior' = 6x6
  moveHistory: ChessMove[];
  capturedWhite: ChessPiece[];
  capturedBlack: ChessPiece[];
  enPassantTarget: [number, number] | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: PieceColor | 'draw' | null;
}

// Piece material values for heuristic evaluation
export const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

export class ChessEngine {
  /**
   * Create an initial chess board for either 8x8 standard or 6x6 junior mode
   */
  static createInitialBoard(mode: 'standard' | 'junior' = 'standard'): ChessBoard {
    if (mode === 'junior') {
      // 6x6 Board:
      // Row 0 (Black): Rook, Knight, Queen, King, Bishop, Rook
      // Row 1 (Black): Pawns
      // Row 4 (White): Pawns
      // Row 5 (White): Rook, Knight, Queen, King, Bishop, Rook
      const board: ChessBoard = Array(6).fill(null).map(() => Array(6).fill(null));
      const backRank: PieceType[] = ['r', 'n', 'q', 'k', 'b', 'r'];

      for (let c = 0; c < 6; c++) {
        board[0][c] = { id: `b_${backRank[c]}_${c}`, type: backRank[c], color: 'b', hasMoved: false };
        board[1][c] = { id: `b_p_${c}`, type: 'p', color: 'b', hasMoved: false };
        board[4][c] = { id: `w_p_${c}`, type: 'p', color: 'w', hasMoved: false };
        board[5][c] = { id: `w_${backRank[c]}_${c}`, type: backRank[c], color: 'w', hasMoved: false };
      }
      return board;
    }

    // Standard 8x8 Board
    const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRank: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

    for (let c = 0; c < 8; c++) {
      board[0][c] = { id: `b_${backRank[c]}_${c}`, type: backRank[c], color: 'b', hasMoved: false };
      board[1][c] = { id: `b_p_${c}`, type: 'p', color: 'b', hasMoved: false };
      board[6][c] = { id: `w_p_${c}`, type: 'p', color: 'w', hasMoved: false };
      board[7][c] = { id: `w_${backRank[c]}_${c}`, type: backRank[c], color: 'w', hasMoved: false };
    }
    return board;
  }

  /**
   * Deep clone a board grid
   */
  static cloneBoard(board: ChessBoard): ChessBoard {
    return board.map(row => row.map(sq => (sq ? { ...sq } : null)));
  }

  /**
   * Find the coordinates of the King of given color
   */
  static findKing(board: ChessBoard, color: PieceColor): [number, number] | null {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === color) {
          return [r, c];
        }
      }
    }
    return null;
  }

  /**
   * Check if square [r, c] is attacked by any piece of attackerColor
   */
  static isSquareAttacked(
    board: ChessBoard,
    r: number,
    c: number,
    attackerColor: PieceColor
  ): boolean {
    const rows = board.length;
    const cols = board[0].length;
    const pawnDir = attackerColor === 'w' ? -1 : 1;

    // 1. Pawn attacks
    for (const dc of [-1, 1]) {
      const pr = r - pawnDir;
      const pc = c + dc;
      if (pr >= 0 && pr < rows && pc >= 0 && pc < cols) {
        const p = board[pr][pc];
        if (p && p.color === attackerColor && p.type === 'p') return true;
      }
    }

    // 2. Knight attacks
    const knightHops = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightHops) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const p = board[nr][nc];
        if (p && p.color === attackerColor && p.type === 'n') return true;
      }
    }

    // 3. Straight lines (Rook / Queen)
    const straightDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of straightDirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'r' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 4. Diagonals (Bishop / Queen)
    const diagDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const [dr, dc] of diagDirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const p = board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'b' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 5. King attacks (adjacent 1 square)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const p = board[nr][nc];
          if (p && p.color === attackerColor && p.type === 'k') return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the King of given color is currently in check
   */
  static isKingInCheck(board: ChessBoard, color: PieceColor): boolean {
    const kingPos = this.findKing(board, color);
    if (!kingPos) return false;
    const opponent: PieceColor = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(board, kingPos[0], kingPos[1], opponent);
  }

  /**
   * Generate raw pseudo-legal moves for a specific piece (ignoring check)
   */
  static getPseudoMoves(
    board: ChessBoard,
    r: number,
    c: number,
    enPassantTarget: [number, number] | null = null
  ): ChessMove[] {
    const piece = board[r][c];
    if (!piece) return [];
    const moves: ChessMove[] = [];
    const rows = board.length;
    const cols = board[0].length;
    const isWhite = piece.color === 'w';
    const forward = isWhite ? -1 : 1;
    const startRow = isWhite ? rows - 2 : 1;

    // --- PAWN ---
    if (piece.type === 'p') {
      // 1-step forward
      const f1 = r + forward;
      if (f1 >= 0 && f1 < rows && !board[f1][c]) {
        const isPromo = isWhite ? f1 === 0 : f1 === rows - 1;
        moves.push({
          from: [r, c],
          to: [f1, c],
          piece,
          promotionType: isPromo ? 'q' : undefined
        });

        // 2-step forward from starting rank
        const f2 = r + forward * 2;
        if (r === startRow && !board[f2][c]) {
          moves.push({ from: [r, c], to: [f2, c], piece });
        }
      }

      // Diagonal captures
      for (const dc of [-1, 1]) {
        const tr = r + forward;
        const tc = c + dc;
        if (tr >= 0 && tr < rows && tc >= 0 && tc < cols) {
          const target = board[tr][tc];
          if (target && target.color !== piece.color) {
            const isPromo = isWhite ? tr === 0 : tr === rows - 1;
            moves.push({
              from: [r, c],
              to: [tr, tc],
              piece,
              captured: target,
              promotionType: isPromo ? 'q' : undefined
            });
          } else if (enPassantTarget && enPassantTarget[0] === tr && enPassantTarget[1] === tc) {
            // En Passant capture
            const capturedPawn = board[r][tc];
            if (capturedPawn && capturedPawn.color !== piece.color && capturedPawn.type === 'p') {
              moves.push({
                from: [r, c],
                to: [tr, tc],
                piece,
                captured: capturedPawn,
                isEnPassant: true
              });
            }
          }
        }
      }
    }

    // --- KNIGHT ---
    if (piece.type === 'n') {
      const knightHops = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightHops) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const target = board[nr][nc];
          if (!target || target.color !== piece.color) {
            moves.push({ from: [r, c], to: [nr, nc], piece, captured: target || undefined });
          }
        }
      }
    }

    // --- BISHOP & QUEEN (Diagonals) ---
    if (piece.type === 'b' || piece.type === 'q') {
      const diagDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of diagDirs) {
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ from: [r, c], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [r, c], to: [nr, nc], piece, captured: target });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
    }

    // --- ROOK & QUEEN (Straights) ---
    if (piece.type === 'r' || piece.type === 'q') {
      const straightDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of straightDirs) {
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ from: [r, c], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [r, c], to: [nr, nc], piece, captured: target });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
    }

    // --- KING ---
    if (piece.type === 'k') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const target = board[nr][nc];
            if (!target || target.color !== piece.color) {
              moves.push({ from: [r, c], to: [nr, nc], piece, captured: target || undefined });
            }
          }
        }
      }

      // Castling (Standard 8x8 only)
      if (rows === 8 && !piece.hasMoved && !this.isKingInCheck(board, piece.color)) {
        const opponent: PieceColor = isWhite ? 'b' : 'w';

        // Kingside castling (to c = 6)
        const kingsideRook = board[r][7];
        if (
          kingsideRook &&
          kingsideRook.type === 'r' &&
          !kingsideRook.hasMoved &&
          !board[r][5] &&
          !board[r][6] &&
          !this.isSquareAttacked(board, r, 5, opponent) &&
          !this.isSquareAttacked(board, r, 6, opponent)
        ) {
          moves.push({
            from: [r, c],
            to: [r, 6],
            piece,
            isCastling: 'kingside'
          });
        }

        // Queenside castling (to c = 2)
        const queensideRook = board[r][0];
        if (
          queensideRook &&
          queensideRook.type === 'r' &&
          !queensideRook.hasMoved &&
          !board[r][1] &&
          !board[r][2] &&
          !board[r][3] &&
          !this.isSquareAttacked(board, r, 2, opponent) &&
          !this.isSquareAttacked(board, r, 3, opponent)
        ) {
          moves.push({
            from: [r, c],
            to: [r, 2],
            piece,
            isCastling: 'queenside'
          });
        }
      }
    }

    return moves;
  }

  /**
   * Get all strictly legal moves for a piece (filtering out moves that leave king in check)
   */
  static getLegalMovesForPiece(
    board: ChessBoard,
    r: number,
    c: number,
    enPassantTarget: [number, number] | null = null
  ): ChessMove[] {
    const pseudo = this.getPseudoMoves(board, r, c, enPassantTarget);
    return pseudo.filter(m => {
      const simulated = this.simulateMove(board, m);
      return !this.isKingInCheck(simulated, m.piece.color);
    });
  }

  /**
   * Get all strictly legal moves for all pieces of a color
   */
  static getAllLegalMoves(
    board: ChessBoard,
    color: PieceColor,
    enPassantTarget: [number, number] | null = null
  ): ChessMove[] {
    const allMoves: ChessMove[] = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const piece = board[r][c];
        if (piece && piece.color === color) {
          const moves = this.getLegalMovesForPiece(board, r, c, enPassantTarget);
          allMoves.push(...moves);
        }
      }
    }
    return allMoves;
  }

  /**
   * Simulate a move on a cloned board
   */
  static simulateMove(board: ChessBoard, move: ChessMove): ChessBoard {
    const clone = this.cloneBoard(board);
    const [fr, fc] = move.from;
    const [tr, tc] = move.to;

    const movingPiece: ChessPiece = {
      ...move.piece,
      hasMoved: true,
      type: move.promotionType || move.piece.type
    };

    clone[tr][tc] = movingPiece;
    clone[fr][fc] = null;

    // En Passant capture cleanup
    if (move.isEnPassant) {
      clone[fr][tc] = null;
    }

    // Castling rook reposition
    if (move.isCastling === 'kingside') {
      const rook = clone[fr][7];
      if (rook) {
        clone[fr][5] = { ...rook, hasMoved: true };
        clone[fr][7] = null;
      }
    } else if (move.isCastling === 'queenside') {
      const rook = clone[fr][0];
      if (rook) {
        clone[fr][3] = { ...rook, hasMoved: true };
        clone[fr][0] = null;
      }
    }

    return clone;
  }

  /**
   * Make a move and return complete next game state
   */
  static executeMove(
    state: ChessGameState,
    move: ChessMove
  ): ChessGameState {
    const nextBoard = this.simulateMove(state.board, move);
    const nextTurn: PieceColor = state.turn === 'w' ? 'b' : 'w';

    // Track captured pieces
    const nextCapturedWhite = [...state.capturedWhite];
    const nextCapturedBlack = [...state.capturedBlack];

    if (move.captured) {
      if (move.captured.color === 'w') {
        nextCapturedWhite.push(move.captured);
      } else {
        nextCapturedBlack.push(move.captured);
      }
    }

    // Update en passant target if double pawn push
    let nextEnPassant: [number, number] | null = null;
    if (move.piece.type === 'p' && Math.abs(move.to[0] - move.from[0]) === 2) {
      nextEnPassant = [(move.from[0] + move.to[0]) / 2, move.from[1]];
    }

    // Check check / checkmate / stalemate for opponent
    const isCheck = this.isKingInCheck(nextBoard, nextTurn);
    const opponentLegalMoves = this.getAllLegalMoves(nextBoard, nextTurn, nextEnPassant);

    const isCheckmate = isCheck && opponentLegalMoves.length === 0;
    const isStalemate = !isCheck && opponentLegalMoves.length === 0;

    let winner: PieceColor | 'draw' | null = null;
    if (isCheckmate) {
      winner = state.turn; // moving player won!
    } else if (isStalemate) {
      winner = 'draw';
    }

    // Generate Standard Algebraic Notation
    const san = this.generateSAN(move, isCheck, isCheckmate, state.board);
    const moveWithSAN: ChessMove = { ...move, san };

    return {
      board: nextBoard,
      turn: nextTurn,
      mode: state.mode,
      moveHistory: [...state.moveHistory, moveWithSAN],
      capturedWhite: nextCapturedWhite,
      capturedBlack: nextCapturedBlack,
      enPassantTarget: nextEnPassant,
      isCheck,
      isCheckmate,
      isStalemate,
      winner
    };
  }

  /**
   * Generate SAN string (e.g. "Nf3", "e4", "Bxf7+", "O-O")
   */
  static generateSAN(
    move: ChessMove,
    isCheck: boolean,
    isCheckmate: boolean,
    prevBoard: ChessBoard
  ): string {
    if (move.isCastling === 'kingside') return isCheckmate ? 'O-O#' : isCheck ? 'O-O+' : 'O-O';
    if (move.isCastling === 'queenside') return isCheckmate ? 'O-O-O#' : isCheck ? 'O-O-O+' : 'O-O-O';

    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = prevBoard.length;
    const toSquare = `${cols[move.to[1]]}${rows - move.to[0]}`;

    let piecePrefix = '';
    if (move.piece.type !== 'p') {
      piecePrefix = move.piece.type.toUpperCase();
    }

    const captureChar = move.captured ? (move.piece.type === 'p' ? `${cols[move.from[1]]}x` : 'x') : '';
    const promo = move.promotionType ? `=${move.promotionType.toUpperCase()}` : '';
    const checkSign = isCheckmate ? '#' : isCheck ? '+' : '';

    return `${piecePrefix}${captureChar}${toSquare}${promo}${checkSign}`;
  }

  /**
   * Offline Minimax Bot Evaluation
   * Evaluates board material and position
   */
  static evaluateBoard(board: ChessBoard, color: PieceColor): number {
    let score = 0;
    const rows = board.length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const p = board[r][c];
        if (p) {
          let val = PIECE_VALUES[p.type];

          // Positional bonuses:
          // Center control bonus
          const centerDist = Math.abs(r - rows / 2 + 0.5) + Math.abs(c - board[r].length / 2 + 0.5);
          val += (4 - centerDist) * 5;

          // Advancing pawns bonus
          if (p.type === 'p') {
            const progress = p.color === 'w' ? rows - 1 - r : r;
            val += progress * 10;
          }

          if (p.color === color) {
            score += val;
          } else {
            score -= val;
          }
        }
      }
    }
    return score;
  }

  /**
   * Minimax search with Alpha-Beta pruning for offline Bot turns
   */
  static minimax(
    board: ChessBoard,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    botColor: PieceColor,
    enPassant: [number, number] | null
  ): number {
    const currentColor = isMaximizing ? botColor : (botColor === 'w' ? 'b' : 'w');
    const legalMoves = this.getAllLegalMoves(board, currentColor, enPassant);

    if (depth === 0 || legalMoves.length === 0) {
      if (legalMoves.length === 0) {
        if (this.isKingInCheck(board, currentColor)) {
          // Checkmate: huge penalty or bonus
          return isMaximizing ? -50000 : 50000;
        }
        return 0; // Stalemate
      }
      return this.evaluateBoard(board, botColor);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const m of legalMoves) {
        const nextB = this.simulateMove(board, m);
        const evalScore = this.minimax(nextB, depth - 1, alpha, beta, false, botColor, null);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of legalMoves) {
        const nextB = this.simulateMove(board, m);
        const evalScore = this.minimax(nextB, depth - 1, alpha, beta, true, botColor, null);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  /**
   * Choose Best Bot Move based on difficulty
   * - 'pip' (Easy): Friendly, prefers captures, makes fun minor blunders
   * - 'barnaby' (Medium): Looks 2 moves ahead, solid defense
   * - 'luna' (Hard): Minimax depth 3 with alpha-beta pruning
   */
  static getBestBotMove(
    state: ChessGameState,
    difficulty: 'pip' | 'barnaby' | 'luna' = 'pip'
  ): ChessMove | null {
    const legalMoves = this.getAllLegalMoves(state.board, state.turn, state.enPassantTarget);
    if (legalMoves.length === 0) return null;

    if (difficulty === 'pip') {
      // Sort: Captures first, then advancing moves with gentle randomness
      const scored = legalMoves.map(m => {
        let score = Math.random() * 20;
        if (m.captured) score += PIECE_VALUES[m.captured.type];
        if (m.promotionType) score += 800;
        return { move: m, score };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored[0].move;
    }

    const depth = difficulty === 'luna' ? 3 : 2;
    let bestScore = -Infinity;
    let bestMove = legalMoves[0];

    for (const m of legalMoves) {
      const nextBoard = this.simulateMove(state.board, m);
      const score = this.minimax(
        nextBoard,
        depth - 1,
        -Infinity,
        Infinity,
        false,
        state.turn,
        null
      );

      // Add a tiny random jitter for natural play
      const jitterScore = score + Math.random() * 5;
      if (jitterScore > bestScore) {
        bestScore = jitterScore;
        bestMove = m;
      }
    }

    return bestMove;
  }
}
