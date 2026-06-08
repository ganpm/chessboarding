import { Board } from "@/game/board";
import { Player } from "@/game/player";
import { Square } from "@/game/square";
import { Piece, PieceType } from "@/game/piece";
import {
  Move,
  RookMove,
  BishopMove,
  QueenMove,
  KnightMove,
  KingMove,
  PawnMove,
} from "@/game/move";

export class Position {

  public readonly board: Board;
  public readonly moveHistory: Move[];

  public constructor(board: Board, moveHistory: Move[] = []) {
    this.board = board;
    this.moveHistory = moveHistory;
  }

  public static init(): Position {
    return new Position(Board.init());
  }

  public currentPlayerToMove(): Player {
    return this.moveHistory.length % 2 === 0 ? Player.WHITE : Player.BLACK;
  }

  public findKingSquare(player: Player): Square {
    // TODO: optimization
    const kingPiece = Piece.getKingPiece(player);
    for (const [square, piece] of this.board.squares) {
      if (piece && piece.is(kingPiece)) {
        return square;
      }
    }
    throw new Error(`King not found for player: ${player}`);
  }

  /**
   * Determines if a given square is attacked by any piece of the given player.
   * Performs a brute force check of all squares with pieces belonging to the player.
   * @param player 
   * @param square 
   * @returns True if the given square is attacked by any piece of the given player, false otherwise
   */
  public isSquareAttackedBy(player: Player, square: Square): boolean {
    for (const [attackingSquare, piece] of this.board.squares) {
      if (!piece || piece.owner !== player) {
        continue;
      }
      switch (piece.type) {
        case PieceType.PAWN:
          if (PawnMove.attackedSquares(player, this.board, attackingSquare).some(attackedSquare => attackedSquare === square)) {
            return true;
          }
          break;
        case PieceType.KNIGHT:
          if (KnightMove.attackedSquares(player, this.board, attackingSquare).some(attackedSquare => attackedSquare === square)) {
            return true;
          }
          break;
        case PieceType.BISHOP:
          if (BishopMove.attackedSquares(player, this.board, attackingSquare).some(attackedSquare => attackedSquare === square)) {
            return true;
          }
          break;
        case PieceType.ROOK:
          if (RookMove.attackedSquares(player, this.board, attackingSquare).some(attackedSquare => attackedSquare === square)) {
            return true;
          }
          break;
        case PieceType.QUEEN:
          if (QueenMove.attackedSquares(player, this.board, attackingSquare).some(attackedSquare => attackedSquare === square)) {
            return true;
          }
          break;
        case PieceType.KING:
          if (KingMove.attackedSquares(player, this.board, attackingSquare).some(attackedSquare => attackedSquare === square)) {
            return true;
          }
          break;
        default:
          break;
      }
    }
    return false;
    /*
    const pieces = Piece.fromPlayer(player);
    for (const piece of pieces) {
      switch (piece.type) {
        case PieceType.PAWN:
          const pawnAttackedSquares = PawnMove.attackedSquares(player, this.board, square);
          if (pawnAttackedSquares.some(attackedSquare => this.board.pieceAt(attackedSquare) === piece)) {
            return true;
          }
          break;
        case PieceType.KNIGHT:
          const knightAttackedSquares = KnightMove.attackedSquares(player, this.board, square);
          if (knightAttackedSquares.some(attackedSquare => this.board.pieceAt(attackedSquare) === piece)) {
            return true;
          }
          break;
        case PieceType.BISHOP:
          const bishopAttackedSquares = BishopMove.attackedSquares(player, this.board, square);
          if (bishopAttackedSquares.some(attackedSquare => this.board.pieceAt(attackedSquare) === piece)) {
            return true;
          }
          break;
        case PieceType.ROOK:
          const rookAttackedSquares = RookMove.attackedSquares(player, this.board, square);
          if (rookAttackedSquares.some(attackedSquare => this.board.pieceAt(attackedSquare) === piece)) {
            return true;
          }
          break;
        case PieceType.QUEEN:
          const queenAttackedSquares = QueenMove.attackedSquares(player, this.board, square);
          if (queenAttackedSquares.some(attackedSquare => this.board.pieceAt(attackedSquare) === piece)) {
            return true;
          }
          break;
        case PieceType.KING:
          const kingAttackedSquares = KingMove.attackedSquares(player, this.board, square);
          if (kingAttackedSquares.some(attackedSquare => this.board.pieceAt(attackedSquare) === piece)) {
            return true;
          }
          break;
        default:
          break;
      }
    }
    return false;
    */
  }

  /**
   * Applies a move to the current position and returns a new position with the move applied.
   * 
   * Always assumes the move is legal. Validation should be done before calling this method.
   * @param move A move to apply to the current position
   * @returns A new Position with the move applied
   */
  public applyMove(move: Move): Position {
    const piece = this.board.pieceAt(move.originSquare);
    if (!piece) {
      return this;
    }

    const player = piece.owner;

    // Castling
    const kingStartingSquare = KingMove.STARTING_SQUARES[player.toString()];

    // Kingside castling
    const kingsideRookStartingSquare = RookMove.KINGSIDE_STARTING_SQUARES[player.toString()];
    const kingsideCastleTargetSquare = KingMove.KINGSIDE_CASTLE_TARGETS[player.toString()];
    const kingsideRookTargetSquare = RookMove.KINGSIDE_CASTLE_TARGETS[player.toString()];

    if (piece.type === PieceType.KING && move.originSquare === kingStartingSquare && move.targetSquare === kingsideCastleTargetSquare) {
      const rookPiece = Piece.getRookPiece(piece.owner);
      if (this.board.pieceAt(kingsideRookStartingSquare) === rookPiece) {
        const newBoard = this.board.moveTwoPieces(move.originSquare, move.targetSquare, kingsideRookStartingSquare, kingsideRookTargetSquare);
        const newMoveHistory = [...this.moveHistory, move];
        return new Position(newBoard, newMoveHistory);
      }
    }

    // Queenside castling
    const queensideRookStartingSquare = RookMove.QUEENSIDE_STARTING_SQUARES[player.toString()];
    const queensideCastleTargetSquare = KingMove.QUEENSIDE_CASTLE_TARGETS[player.toString()];
    const queensideRookTargetSquare = RookMove.QUEENSIDE_CASTLE_TARGETS[player.toString()];

    if (piece.type === PieceType.KING && move.originSquare === kingStartingSquare && move.targetSquare === queensideCastleTargetSquare) {
      const rookPiece = Piece.getRookPiece(piece.owner);
      if (this.board.pieceAt(queensideRookStartingSquare) === rookPiece) {
        const newBoard = this.board.moveTwoPieces(move.originSquare, move.targetSquare, queensideRookStartingSquare, queensideRookTargetSquare);
        const newMoveHistory = [...this.moveHistory, move];
        return new Position(newBoard, newMoveHistory);
      }
    }

    // En passant
    if (piece.type === PieceType.PAWN) {
      const fileDelta = move.targetSquare.file - move.originSquare.file;
      const rankDelta = move.targetSquare.rank - move.originSquare.rank;
      const isDiagonalStep = Math.abs(fileDelta) === 1;
      const forwardRankDelta = player.is(Player.WHITE) ? 1 : -1;
      const isForwardStep = rankDelta === forwardRankDelta;
      const isTargetSquareEmpty = !this.board.pieceAt(move.targetSquare);

      if (isDiagonalStep && isForwardStep && isTargetSquareEmpty) {
        const lastMove = this.moveHistory[this.moveHistory.length - 1];
        if (lastMove) {
          const lastMovePiece = this.board.pieceAt(lastMove.targetSquare);
          const opponent = player.opponent();
          const opponentPawnStartingRank = PawnMove.STARTING_RANK[opponent.toString()];
          const isOpponentPawnDoubleAdvance =
            !!lastMovePiece
            && lastMovePiece.type === PieceType.PAWN
            && lastMovePiece.owner.is(opponent)
            && lastMove.originSquare.rank === opponentPawnStartingRank
            && lastMove.rankDelta() === 2;

          const isAdjacentPawnCapturedEnPassant =
            lastMove.targetSquare.file === move.targetSquare.file
            && lastMove.targetSquare.rank === move.originSquare.rank;

          if (isOpponentPawnDoubleAdvance && isAdjacentPawnCapturedEnPassant) {
            const newSquares = new Map(this.board.squares);
            newSquares.set(move.originSquare, null);
            newSquares.set(move.targetSquare, piece);
            newSquares.set(lastMove.targetSquare, null);
            const newMoveHistory = [...this.moveHistory, move];
            return new Position(new Board(newSquares), newMoveHistory);
          }
        }
      }
    }

    // Promotion

    if (move.promotion) {
      const promotionPiece = Piece.get(player, move.promotion);
      const newBoard = this.board
        .movePiece(move.originSquare, move.targetSquare, promotionPiece);
      const newMoveHistory = [...this.moveHistory, move];
      return new Position(newBoard, newMoveHistory);
    }

    const newBoard = this.board.movePiece(move.originSquare, move.targetSquare);
    const newMoveHistory = [...this.moveHistory, move];
    return new Position(newBoard, newMoveHistory);
  }


  public getLegalMovesForSquare(originSquare: Square): Move[] {
    const playerToMove = this.currentPlayerToMove();
    const piece = this.board.pieceAt(originSquare);
    if (!piece || piece.owner !== playerToMove) {
      return [];
    }
    let targetSquares: Square[] = [];

    switch (piece.type) {
      case PieceType.PAWN:
        targetSquares = PawnMove.generate(this, originSquare);
        break;
      case PieceType.KNIGHT:
        targetSquares = KnightMove.generate(this, originSquare);
        break;
      case PieceType.BISHOP:
        targetSquares = BishopMove.generate(this, originSquare);
        break;
      case PieceType.ROOK:
        targetSquares = RookMove.generate(this, originSquare);
        break;
      case PieceType.QUEEN:
        targetSquares = QueenMove.generate(this, originSquare);
        break;
      case PieceType.KING:
        targetSquares = KingMove.generate(this, originSquare);
        break;
      default:
        break;
    }

    const moves: Move[] = [];

    if (piece.type !== PieceType.PAWN) {
      for (const targetSquare of targetSquares) {
        moves.push(new Move(originSquare, targetSquare));
      }
    } else {
      const promotionRank = PawnMove.PROMOTION_RANK[piece.owner.toString()];
      for (const targetSquare of targetSquares) {
        if (targetSquare.rank === promotionRank) {
          for (const promotionType of PieceType.promotions) {
            moves.push(new Move(originSquare, targetSquare, promotionType));
          }
        } else {
          moves.push(new Move(originSquare, targetSquare));
        }
      }
    }

    // Remove moves that would put own king in check
    const legalMoves = moves.filter(move => {
      const newPosition = this.applyMove(move);
      const kingSquare = newPosition.findKingSquare(playerToMove);
      const opponent = playerToMove.opponent();
      return !newPosition.isSquareAttackedBy(opponent, kingSquare);
    });

    return legalMoves;
  }

}