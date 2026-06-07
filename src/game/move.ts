import { Square, RANK_1, RANK_2, RANK_7, RANK_8 } from "@/game/square";
import { Piece, PieceType } from "@/game/piece";
import { Board } from "@/game/board";
import { Player } from "@/game/player";
import { Position } from "@/game/position";


export class Move {
  public readonly originSquare: Square;
  public readonly targetSquare: Square;
  public readonly promotion?: PieceType;

  public constructor(originSquare: Square, targetSquare: Square, promotion?: PieceType) {
    this.originSquare = originSquare;
    this.targetSquare = targetSquare;
    this.promotion = promotion;
  }

  public rankDelta(): number {
    return Math.abs(this.targetSquare.rank - this.originSquare.rank);
  }
}

/**
 * Helper function to generate squares attacked by pieces that move in straight lines (rooks, bishops, queens).
 * @param attacker The player who owns the piece.
 * @param board The current state of the chess board.
 * @param originSquare The square from which the piece is moving.
 * @param directions An array of [fileDelta, rankDelta] pairs representing the directions the piece can move.
 * @returns An array of squares that the piece can attack.
 */
function getLinearAttackedSquares(attacker: Player,board: Board, originSquare: Square, directions: [number, number][]): Square[] {
  const attackedSquares: Square[] = [];
  const opponent = attacker.opponent();

  for (const [fileDelta, rankDelta] of directions) {
    for (let i = 1; i < 8; i++) {
      const targetSquare = originSquare.addDelta([fileDelta * i, rankDelta * i]);
      if (targetSquare.isOutOfBounds()) {
        break;
      }
      const targetPiece = board.pieceAt(targetSquare);
      // If square is occupied
      if (targetPiece) {
        // Piece belongs to opponent, so it's a capture move
        if (targetPiece.owner.is(opponent)) {
          attackedSquares.push(targetSquare);
        }
        // After encountering any piece, we stop looking further in this direction
        break;
      } else {
        // If square is empty, it's a normal move
        attackedSquares.push(targetSquare);
      }
    }
  }

  return attackedSquares;
}


/**
 * Helper function to generate squares attacked by pieces that attack in discrete steps (knights, kings, pawns).
 * @param attacker The player who owns the piece.
 * @param board The current state of the chess board.
 * @param originSquare The square from which the piece is moving.
 * @param offsets An array of [fileDelta, rankDelta] pairs representing the possible squares the piece can attack.
 * @returns An array of squares that the piece can attack.
 */
function getSingleAttackedSquares(attacker: Player, board: Board, originSquare: Square, offsets: [number, number][]): Square[] {
  const attackedSquares: Square[] = [];
  const opponent = attacker.opponent();

  for (const [fileDelta, rankDelta] of offsets) {
    const targetSquare = originSquare.addDelta([fileDelta, rankDelta]);
    if (targetSquare.isOutOfBounds()) {
      continue;
    }
    const targetPiece = board.pieceAt(targetSquare);
    if (!targetPiece || targetPiece.owner.is(opponent)) {
      // If the target square is empty or occupied by an opponent's piece, it's a possible move
      attackedSquares.push(targetSquare);
    }
  }

  return attackedSquares;
}


// Pseudo-move generation


export class RookMove {
  private static readonly DIRECTIONS: [number, number][] = [
    [ 0,  1], // Up
    [ 0, -1], // Down
    [ 1,  0], // Right
    [-1,  0], // Left
  ];

  public static readonly KINGSIDE_STARTING_SQUARES: Record<string, Square> = {
    [Player.WHITE.toString()]: Square.H1,
    [Player.BLACK.toString()]: Square.H8,
  };

  public static readonly QUEENSIDE_STARTING_SQUARES: Record<string, Square> = {
    [Player.WHITE.toString()]: Square.A1,
    [Player.BLACK.toString()]: Square.A8,
  };

  public static readonly KINGSIDE_CASTLE_TARGETS: Record<string, Square> = {
    [Player.WHITE.toString()]: Square.F1,
    [Player.BLACK.toString()]: Square.F8,
  };

  public static readonly QUEENSIDE_CASTLE_TARGETS: Record<string, Square> = {
    [Player.WHITE.toString()]: Square.D1,
    [Player.BLACK.toString()]: Square.D8,
  };

  public static attackedSquares(player: Player, board: Board, originSquare: Square): Square[] {
    return getLinearAttackedSquares(player, board, originSquare, RookMove.DIRECTIONS);
  }

  public static generate(position: Position, originSquare: Square): Move[] {
    const moves: Move[] = [];
    const piece = position.board.pieceAt(originSquare);

    if (!piece) {
      return moves;
    }

    const attackedSquares = getLinearAttackedSquares(piece.owner, position.board, originSquare, RookMove.DIRECTIONS);
    for (const targetSquare of attackedSquares) {
      moves.push(new Move(originSquare, targetSquare));
    }

    return moves;
  }
}


export class BishopMove {
  private static readonly DIRECTIONS: [number, number][] = [
    [ 1,  1], // Up-Right
    [ 1, -1], // Down-Right
    [-1,  1], // Up-Left
    [-1, -1], // Down-Left
  ];

  public static attackedSquares(player: Player, board: Board, originSquare: Square): Square[] {
    return getLinearAttackedSquares(player, board, originSquare, BishopMove.DIRECTIONS);
  }

  public static generate(position: Position, originSquare: Square): Move[] {
    const moves: Move[] = [];
    const piece = position.board.pieceAt(originSquare);

    if (!piece) {
      return moves;
    }

    const attackedSquares = getLinearAttackedSquares(piece.owner, position.board, originSquare, BishopMove.DIRECTIONS);
    for (const targetSquare of attackedSquares) {
      moves.push(new Move(originSquare, targetSquare));
    }

    return moves;
  }
}


export class QueenMove {
  private static readonly DIRECTIONS: [number, number][] = [
    [ 0,  1], // Up
    [ 0, -1], // Down
    [ 1,  0], // Right
    [-1,  0], // Left
    [ 1,  1], // Up-Right
    [ 1, -1], // Down-Right
    [-1,  1], // Up-Left
    [-1, -1], // Down-Left
  ];

  public static attackedSquares(player: Player, board: Board, originSquare: Square): Square[] {
    return getLinearAttackedSquares(player, board, originSquare, QueenMove.DIRECTIONS);
  }

  public static generate(position: Position, originSquare: Square): Move[] {
    const moves: Move[] = [];
    const piece = position.board.pieceAt(originSquare);

    if (!piece) {
      return moves;
    }

    const attackedSquares = getLinearAttackedSquares(piece.owner, position.board, originSquare, QueenMove.DIRECTIONS);
    for (const targetSquare of attackedSquares) {
      moves.push(new Move(originSquare, targetSquare));
    }

    return moves;
  }
}


export class KnightMove {
  private static readonly OFFSETS: [number, number][] = [
    [ 1,  2], // Up 2, Right 1
    [ 1, -2], // Down 2, Right 1
    [-1,  2], // Up 2, Left 1
    [-1, -2], // Down 2, Left 1
    [ 2,  1], // Up 1, Right 2
    [ 2, -1], // Down 1, Right 2
    [-2,  1], // Up 1, Left 2
    [-2, -1], // Down 1, Left 2
  ];

  public static attackedSquares(player: Player, board: Board, originSquare: Square): Square[] {
    return getSingleAttackedSquares(player, board, originSquare, KnightMove.OFFSETS);
  }

  public static generate(position: Position, originSquare: Square): Move[] {
    const moves: Move[] = [];
    const piece = position.board.pieceAt(originSquare);

    if (!piece) {
      return moves;
    }

    const attackedSquares = getSingleAttackedSquares(piece.owner, position.board, originSquare, KnightMove.OFFSETS);
    for (const targetSquare of attackedSquares) {
      moves.push(new Move(originSquare, targetSquare));
    }

    return moves;
  }
}


export class KingMove {
  private static readonly OFFSETS: [number, number][] = [
    [ 0,  1], // Up
    [ 0, -1], // Down
    [ 1,  0], // Right
    [-1,  0], // Left
    [ 1,  1], // Up-Right
    [ 1, -1], // Down-Right
    [-1,  1], // Up-Left
    [-1, -1], // Down-Left
  ];

  public static readonly STARTING_SQUARES: Record<string, Square> = {
    [Player.WHITE.toString()]: Square.E1,
    [Player.BLACK.toString()]: Square.E8,
  };

  public static readonly KINGSIDE_CASTLE_TARGETS: Record<string, Square> = {
    [Player.WHITE.toString()]: Square.G1,
    [Player.BLACK.toString()]: Square.G8,
  };

  public static readonly QUEENSIDE_CASTLE_TARGETS: Record<string, Square> = {
    [Player.WHITE.toString()]: Square.C1,
    [Player.BLACK.toString()]: Square.C8,
  };

  public static attackedSquares(player: Player, board: Board, originSquare: Square): Square[] {
    return getSingleAttackedSquares(player, board, originSquare, KingMove.OFFSETS);
  }

  public static generate(position: Position, originSquare: Square): Move[] {
    const moves: Move[] = [];
    const piece = position.board.pieceAt(originSquare);

    if (!piece) {
      return moves;
    }

    const attackedSquares = getSingleAttackedSquares(piece.owner, position.board, originSquare, KingMove.OFFSETS);
    for (const targetSquare of attackedSquares) {
      moves.push(new Move(originSquare, targetSquare));
    }

    const player = piece.owner.toString();
    const opponent = piece.owner.opponent();

    // Castling
    // We check for castling rights
    // We check that the squares between the king and rook are empty
    // We check that the king is not currently in check, and does not pass through or end up in check

    const kingPiece = Piece.getKingPiece(piece.owner);
    const rookPiece = Piece.getRookPiece(piece.owner);
    
    const kingStartingSquare = KingMove.STARTING_SQUARES[player];
    const kingsideRookStartingSquare = RookMove.KINGSIDE_STARTING_SQUARES[player];
    const queensideRookStartingSquare = RookMove.QUEENSIDE_STARTING_SQUARES[player];

    const isKingOnOriginalSquare = position.board.pieceAt(kingStartingSquare) === kingPiece;
    const isKingInCheck = () => position.isSquareAttackedBy(piece.owner.opponent(), kingStartingSquare);
    const hasKingMoved = () => position.moveHistory.some(move => move.originSquare === kingStartingSquare);

    if (isKingOnOriginalSquare && !hasKingMoved() && !isKingInCheck()) {
      // Check kingside castling
      const isKingsideRookOnOriginalSquare = position.board.pieceAt(kingsideRookStartingSquare) === rookPiece;
      const hasKingsideRookMovedOrCaptured = () => position.moveHistory.some(move => move.originSquare === kingsideRookStartingSquare || move.targetSquare === kingsideRookStartingSquare);
      if (isKingsideRookOnOriginalSquare && !hasKingsideRookMovedOrCaptured()) {
        const squaresBetween = [
          kingStartingSquare.addDelta([1, 0]), // Square immediately to the right of the king
          kingStartingSquare.addDelta([2, 0]), // Square two spaces to the right of the king (where the king would end up after castling)
        ];
        const areSquaresBetweenEmpty = squaresBetween.every(square => !position.board.pieceAt(square));
        const areSquaresAttacked = squaresBetween.some(square => position.isSquareAttackedBy(opponent, square));
        if (areSquaresBetweenEmpty && !areSquaresAttacked) {
          moves.push(new Move(kingStartingSquare, kingStartingSquare.addDelta([2, 0])));
        }
      }
      // Check queenside castling
      const isQueensideRookOnOriginalSquare = position.board.pieceAt(queensideRookStartingSquare) === rookPiece;
      const hasQueensideRookMovedOrCaptured = () => position.moveHistory.some(move => move.originSquare === queensideRookStartingSquare || move.targetSquare === queensideRookStartingSquare);
      if (isQueensideRookOnOriginalSquare && !hasQueensideRookMovedOrCaptured()) {
        const squaresBetween = [
          kingStartingSquare.addDelta([-1, 0]), // Square immediately to the left of the king
          kingStartingSquare.addDelta([-2, 0]), // Square two spaces to the left of the king (where the king would end up after castling)
          kingStartingSquare.addDelta([-3, 0]), // Square three spaces to the left of the king (between the rook and the squares the king moves through)
        ];
        const areSquaresBetweenEmpty = squaresBetween.every(square => !position.board.pieceAt(square));
        const areSquaresAttacked = squaresBetween.slice(0, 2).some(square => position.isSquareAttackedBy(opponent, square));
        if (areSquaresBetweenEmpty && !areSquaresAttacked) {
          moves.push(new Move(kingStartingSquare, kingStartingSquare.addDelta([-2, 0])));
        }
      }
    }

    return moves;
  }
}


export class PawnMove {
  private static readonly CAPTURE_OFFSETS: Record<string, [number, number][]> = {
    [Player.WHITE.toString()]: [
      [ 1,  1], // Capture right
      [-1,  1], // Capture left
    ],
    [Player.BLACK.toString()]: [
      [ 1, -1], // Capture right
      [-1, -1], // Capture left
    ],
  };

  private static readonly SINGLE_FORWARD_OFFSETS: Record<string, [number, number]> = {
    [Player.WHITE.toString()]: [0,  1], // Move up
    [Player.BLACK.toString()]: [0, -1], // Move down
  };

  public static readonly STARTING_RANK: Record<string, number> = {
    [Player.WHITE.toString()]: RANK_2,
    [Player.BLACK.toString()]: RANK_7,
  };

  public static readonly PROMOTION_RANK: Record<string, number> = {
    [Player.WHITE.toString()]: RANK_8,
    [Player.BLACK.toString()]: RANK_1,
  };

  private static readonly DOUBLE_FORWARD_OFFSETS: Record<string, [number, number]> = {
    [Player.WHITE.toString()]: [0,  2], // Move up 2 squares from starting position
    [Player.BLACK.toString()]: [0, -2], // Move down 2 squares from starting position
  };

  private static readonly ENPASSANT_CAPTURE_OFFSETS: Record<string, [number, number]> = {
    [Player.WHITE.toString()]: [0,  1], // Capture up (en passant)
    [Player.BLACK.toString()]: [0, -1], // Capture down (en passant)
  };

  public static attackedSquares(player: Player, board: Board, originSquare: Square): Square[] {
    return getSingleAttackedSquares(player, board, originSquare, PawnMove.CAPTURE_OFFSETS[player.toString()]);
  }

  public static generate(position: Position, originSquare: Square): Move[] {
    const moves: Move[] = [];
    const piece = position.board.pieceAt(originSquare);

    if (!piece) {
      return moves;
    }

    const player = piece.owner.toString();

    // Handle capture moves
    const attackedSquares = getSingleAttackedSquares(piece.owner, position.board, originSquare, PawnMove.CAPTURE_OFFSETS[player]);
    for (const targetSquare of attackedSquares) {
      if (position.board.pieceAt(targetSquare)?.owner.is(piece.owner.opponent())) {
        moves.push(new Move(originSquare, targetSquare));
      }
    }

    // Handle forward moves (not captures)
    const singleForwardOffset = PawnMove.SINGLE_FORWARD_OFFSETS[player];
    const singleForwardTargetSquare = originSquare.addDelta(singleForwardOffset);
    const singleForwardTargetPiece = position.board.pieceAt(singleForwardTargetSquare);
    // If the square directly in front of the pawn is empty, it's a valid move (either normal or promotion)
    if (!singleForwardTargetPiece) {
      const promotionRank = PawnMove.PROMOTION_RANK[player];
      if (singleForwardTargetSquare.rank === promotionRank) {
        // Handle forward move that results in promotion
        for (const promotionType of PieceType.promotions) {
          // Include every promotion option as a separate move
          moves.push(new Move(originSquare, singleForwardTargetSquare, promotionType));
        }
      } else {
        // Non-promotion forward move
        moves.push(new Move(originSquare, singleForwardTargetSquare));
      }
    }

    // Handle double forward move from starting position
    const doubleForwardOffset = PawnMove.DOUBLE_FORWARD_OFFSETS[player];
    const doubleForwardTargetSquare = originSquare.addDelta(doubleForwardOffset);
    const doubleForwardTargetPiece = position.board.pieceAt(doubleForwardTargetSquare);
    // If the square two spaces in front of the pawn is empty, and the pawn is on its starting rank, it's a valid double move
    if (!doubleForwardTargetPiece && !singleForwardTargetPiece) {
      const startingRank = PawnMove.STARTING_RANK[player];
      if (originSquare.rank === startingRank) {
        moves.push(new Move(originSquare, doubleForwardTargetSquare));
      }
    }

    // Detect and handle en passant moves
    // Assumption: Last move is the opponent's move, origin square is the player's pawn
    const lastMove = position.moveHistory[position.moveHistory.length - 1];
    if (lastMove) {
      const lastMovePiece = position.board.pieceAt(lastMove.targetSquare);
      const opponent = piece.owner.opponent().toString();
      const opponentPawnStartingRank = PawnMove.STARTING_RANK[opponent];
      if (lastMovePiece
        && lastMovePiece.type === PieceType.PAWN
        && lastMove.originSquare.rank === opponentPawnStartingRank
        && lastMove.rankDelta() === 2) {
        // The opponent's last move was a double pawn advance
        // We still don't know the enemy pawn that just moved is adjacent to our pawn
        const LEFT:  [number, number] = [-1, 0];
        const RIGHT: [number, number] = [ 1, 0];
        const adjacentSquares = [originSquare.addDelta(LEFT), originSquare.addDelta(RIGHT)];
        // If the player's pawn is adjacent to the enemy pawn, then en passant capture is possible
        if (adjacentSquares.some(adjacentSquare => adjacentSquare === lastMove.targetSquare)) {
          const enPassantCaptureOffset = PawnMove.ENPASSANT_CAPTURE_OFFSETS[player];
          const enPassantTargetSquare = lastMove.targetSquare.addDelta(enPassantCaptureOffset);
          moves.push(new Move(originSquare, enPassantTargetSquare));
        }
      }
    }
    return moves;
  }

}