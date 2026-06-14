import { Board } from "@/game/board";
import { Player } from "@/game/player";
import { Square } from "@/game/square";
import { Piece, PieceType } from "@/game/piece";
import { Move } from "@/game/move";
import {
  RookMove,
  BishopMove,
  QueenMove,
  KnightMove,
  KingMove,
  PawnMove,
} from "@/game/movegen";

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
  public makeMove(move: Move): Position {
    return new Position(
      this.board.applyMove(move),
      [...this.moveHistory, move]
    );
  }

  /**
   * Generates all legal moves for a piece on the given square.
   * @param originSquare The square of the piece to generate moves for
   * @returns An array of squares representing the legal moves for the piece on the given square
   */
  public getLegalMovesForSquare(originSquare: Square): Square[] {
    const playerToMove = this.currentPlayerToMove();
    const piece = this.board.pieceAt(originSquare);
    if (!piece || piece.owner !== playerToMove) {
      return [];
    }
    let pseudoMoves: Square[] = [];

    switch (piece.type) {
      case PieceType.PAWN:
        pseudoMoves = PawnMove.generate(this, originSquare);
        break;
      case PieceType.KNIGHT:
        pseudoMoves = KnightMove.generate(this, originSquare);
        break;
      case PieceType.BISHOP:
        pseudoMoves = BishopMove.generate(this, originSquare);
        break;
      case PieceType.ROOK:
        pseudoMoves = RookMove.generate(this, originSquare);
        break;
      case PieceType.QUEEN:
        pseudoMoves = QueenMove.generate(this, originSquare);
        break;
      case PieceType.KING:
        pseudoMoves = KingMove.generate(this, originSquare);
        break;
      default:
        break;
    }

    return pseudoMoves.filter(targetSquare => {
      const move = this.createMove(originSquare, targetSquare, null, false);
      // Promotion is null here because it doesn't affect whether the move is legal or not
      // Important to set evaluateCheckmate to false to avoid infinite recursion between createMove and getLegalMovesForSquare when evaluating checkmate
      const nextPosition = this.makeMove(move);
      const kingSquare = nextPosition.findKingSquare(playerToMove);
      return !nextPosition.isSquareAttackedBy(playerToMove.opponent(), kingSquare);
    });
  }

  /**
   * Creates a move object for a given origin and target square, and evaluates whether the move results in check or checkmate.
   * 
   * This method does not validate whether the move is legal or not, it assumes that the caller has already validated the move.
   * 
   * This method is responsible for extracting the necessary information from the position to create a descriptive Move object,
   * such as the piece being moved, any captured piece, whether the move is a castle or en passant, etc. This is to simplify the
   * move formatting in the UI by precomputing all the necessary information about the move beforehand.
   * 
   * Evaluating check and checkmate flag is added to avoid the infinite recursion between `createMove()` and `getLegalMovesForSquare()` when evaluating whether a move is legal or not.
   * 
   * When evaluating whether a move is legal, we don't need to evaluate checkmate, so we can set `evaluateCheckmate` to false to avoid the infinite recursion.
   * 
   * When creating a move for the UI, we want to evaluate checkmate to display the correct move formatting, so we can set `evaluateCheckmate` to true.
   * @param originSquare The square from which the piece is moving
   * @param targetSquare The square to which the piece is moving
   * @param promotion The piece type to which a pawn is promoted, if applicable
   * @param evaluateCheckmate Whether to evaluate if the move results in checkmate
   * @returns A Move object representing the move
   */
  public createMove(
    originSquare: Square,
    targetSquare: Square,
    promotion: PieceType | null = null,
    evaluateCheckmate: boolean = true,
  ): Move {
    const piece = this.board.pieceAt(originSquare);
    if (!piece) {
      throw new Error(`No piece at ${originSquare.toString()}`);
    }

    let capturedPiece = this.board.pieceAt(targetSquare);
    let capturedSquare: Square | null = capturedPiece ? targetSquare : null;

    // En passant
    const enPassant = this.getEnPassant();
    let isEnPassant = false;

    if (
      piece.type === PieceType.PAWN
      && enPassant // Double pawn advance detected
      && !capturedPiece // Target square is empty
      && targetSquare.file !== originSquare.file // Pawn is moving diagonally
    ) {
      isEnPassant = true;
      capturedSquare = enPassant.captureSquare;
      capturedPiece = this.board.pieceAt(capturedSquare);
    }

    // Castling
    const isCastleKingside = piece.type === PieceType.KING
      && originSquare === KingMove.STARTING_SQUARES[piece.owner.toString()]
      && targetSquare === KingMove.KINGSIDE_CASTLE_TARGETS[piece.owner.toString()];
    
    const isCastleQueenside = piece.type === PieceType.KING
      && originSquare === KingMove.STARTING_SQUARES[piece.owner.toString()]
      && targetSquare === KingMove.QUEENSIDE_CASTLE_TARGETS[piece.owner.toString()];

    const baseMove = new Move(
      originSquare,
      targetSquare,
      piece,
      capturedPiece,
      capturedSquare,
      isCastleKingside,
      isCastleQueenside,
      isEnPassant,
      promotion,
      false,
      false,
    );

    const nextPosition = this.makeMove(baseMove);
    const opponent = piece.owner.opponent();
    const kingSquare = nextPosition.findKingSquare(opponent);
    const isCheck = nextPosition.isSquareAttackedBy(piece.owner, kingSquare);

    // This prevents infinite recursion!
    const isCheckmate = evaluateCheckmate && isCheck && nextPosition.isCheckmate();

    baseMove.isCheck = isCheck;
    baseMove.isCheckmate = isCheckmate;

    return baseMove;
  }


  private getEnPassant(): { targetSquare: Square, captureSquare: Square } | null {
    const lastMove = this.moveHistory.at(-1);

    if (!lastMove || lastMove.piece.type !== PieceType.PAWN) {
      return null;
    }

    // Ignore if the last move was not a double pawn advance
    if (lastMove.rankDelta() !== 2) {
      return null;
    }

    const file = lastMove.targetSquare.file;
    // The en passant target square is the square that the pawn passed over during its double advance
    // For example, if a white pawn moves from e2 to e4, the en passant target square is e3
    // If a black pawn moves from d7 to d5, the en passant target square is d6
    const rank = (lastMove.originSquare.rank + lastMove.targetSquare.rank) / 2;
    const enPassantTargetSquare = Square.fromCoords(file, rank);
    const enPassantCaptureSquare = lastMove.targetSquare;
    return { targetSquare: enPassantTargetSquare, captureSquare: enPassantCaptureSquare };
  }

  /**
   * Generates all legal moves for the given player by iterating through all pieces belonging to the player and generating their legal moves.
   * This method is used to determine if the opponent is in checkmate by checking if they have any legal moves to get out of check.
   * 
   * Note that this method is not optimized and performs a brute force check of all pieces and their legal moves.
   * This is sufficient for our purposes, but could be optimized in the future if performance becomes an issue.
   * @param player The player for whom to generate legal moves.
   * @returns An array of legal moves for the given player.
   */
  private getLegalMovesForPlayer(player: Player): Move[] {
    const legalMoves: Move[] = [];
    for (const [square, piece] of this.board.squares) {
      if (piece && piece.owner === player) {
        const pieceLegalMoves = this.getLegalMovesForSquare(square);
        for (const targetSquare of pieceLegalMoves) {
          // Make sure evaluateCheckmate is false to avoid infinite recursion.
          // No need to include promotion options here.
          legalMoves.push(this.createMove(square, targetSquare, null, false));
        }
      }
    }
    return legalMoves;
  }

  /**
   * Checks if the current player to move is in checkmate.
   * 
   * Performs a brute force check of all legal moves for the current player.
   * If the current player has no legal moves that can get them out of check, then it's checkmate.
   * @returns True if the current player is in checkmate, false otherwise.
   */
  private isCheckmate(): boolean {
    const player = this.currentPlayerToMove();
    const legalMoves = this.getLegalMovesForPlayer(player);
    for (const move of legalMoves) {
      const nextPosition = this.makeMove(move);
      const kingSquare = nextPosition.findKingSquare(player);
      if (!nextPosition.isSquareAttackedBy(player.opponent(), kingSquare)) {
        return false;
      }
    }
    return true;
  }

  public boardAt(halfMoveIndex: number): Position {
    const index = Math.max(0, Math.min(halfMoveIndex, this.moveHistory.length));

    if (index === this.moveHistory.length) {
      return this;
    }

    // Reconstruct the position by applying exactly `index` moves from the start position.
    let position = new Position(Board.init());
    for (let i = 0; i < index; i++) {
      position = position.makeMove(this.moveHistory[i]);
    }
    return position;
  }

}