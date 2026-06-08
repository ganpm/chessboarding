import { Piece } from "@/game/piece";
import { Square } from "@/game/square";
import { Move } from "@/game/move";
import { getKingsideCastleTargets, getQueensideCastleTargets } from "@/game/movegen";

export class Board {
  public readonly squares: Map<Square, Piece | null>;

  public constructor(squares: [Square, Piece | null][]);
  public constructor(squares: Map<Square, Piece | null>);
  public constructor(squares: [Square, Piece | null][] | Map<Square, Piece | null>) {
    if (squares instanceof Map) {
      if (squares.size !== 64) {
        throw new Error(`Invalid board: expected 64 squares, got ${squares.size}`);
      }
      this.squares = new Map(squares);
    } else if (Array.isArray(squares)) {
      if (squares.length !== 64) {
        throw new Error(`Invalid board: expected 64 squares, got ${squares.length}`);
      }
      this.squares = new Map(squares);
    } else {
      throw new Error("Invalid board: expected a Map or an array of squares");
    }
  }

  public static init(): Board {
    return new Board([
      [Square.A1, Piece.WHITE_ROOK],
      [Square.B1, Piece.WHITE_KNIGHT],
      [Square.C1, Piece.WHITE_BISHOP],
      [Square.D1, Piece.WHITE_QUEEN],
      [Square.E1, Piece.WHITE_KING],
      [Square.F1, Piece.WHITE_BISHOP],
      [Square.G1, Piece.WHITE_KNIGHT],
      [Square.H1, Piece.WHITE_ROOK],
      [Square.A2, Piece.WHITE_PAWN],
      [Square.B2, Piece.WHITE_PAWN],
      [Square.C2, Piece.WHITE_PAWN],
      [Square.D2, Piece.WHITE_PAWN],
      [Square.E2, Piece.WHITE_PAWN],
      [Square.F2, Piece.WHITE_PAWN],
      [Square.G2, Piece.WHITE_PAWN],
      [Square.H2, Piece.WHITE_PAWN],
      [Square.A3, null],
      [Square.B3, null],
      [Square.C3, null],
      [Square.D3, null],
      [Square.E3, null],
      [Square.F3, null],
      [Square.G3, null],
      [Square.H3, null],
      [Square.A4, null],
      [Square.B4, null],
      [Square.C4, null],
      [Square.D4, null],
      [Square.E4, null],
      [Square.F4, null],
      [Square.G4, null],
      [Square.H4, null],
      [Square.A5, null],
      [Square.B5, null],
      [Square.C5, null],
      [Square.D5, null],
      [Square.E5, null],
      [Square.F5, null],
      [Square.G5, null],
      [Square.H5, null],
      [Square.A6, null],
      [Square.B6, null],
      [Square.C6, null],
      [Square.D6, null],
      [Square.E6, null],
      [Square.F6, null],
      [Square.G6, null],
      [Square.H6, null],
      [Square.A7, Piece.BLACK_PAWN],
      [Square.B7, Piece.BLACK_PAWN],
      [Square.C7, Piece.BLACK_PAWN],
      [Square.D7, Piece.BLACK_PAWN],
      [Square.E7, Piece.BLACK_PAWN],
      [Square.F7, Piece.BLACK_PAWN],
      [Square.G7, Piece.BLACK_PAWN],
      [Square.H7, Piece.BLACK_PAWN],
      [Square.A8, Piece.BLACK_ROOK],
      [Square.B8, Piece.BLACK_KNIGHT],
      [Square.C8, Piece.BLACK_BISHOP],
      [Square.D8, Piece.BLACK_QUEEN],
      [Square.E8, Piece.BLACK_KING],
      [Square.F8, Piece.BLACK_BISHOP],
      [Square.G8, Piece.BLACK_KNIGHT],
      [Square.H8, Piece.BLACK_ROOK],
    ]);
  }

  /**
   * Returns the piece located at the given square, or null if the square is empty.
   * If the square is out of bounds, returns null.
   * @param square The square to check for a piece.
   * @returns The piece located at the given square, or null if the square is empty or out of bounds.
   */
  public pieceAt(square: Square): Piece | null {
    return this.squares.get(square) || null;
  }

  public applyMove(move: Move): Board {
    const pieceOwner = move.piece.owner;

    const newSquares = new Map(this.squares);

    newSquares.set(move.originSquare, null);

    if (move.isEnPassant && move.capturedSquare) {
      // Remove the captured pawn from the board for en passant
      newSquares.set(move.capturedSquare, null);
    }

    if (move.isCastleKingside) {
      const { kingStartingSquare, kingCastlingSquare, rookStartingSquare, rookCastlingSquare } = getKingsideCastleTargets(pieceOwner);
      newSquares.set(kingCastlingSquare, move.piece);
      newSquares.set(kingStartingSquare, null);
      newSquares.set(rookCastlingSquare, newSquares.get(rookStartingSquare)!);
      newSquares.set(rookStartingSquare, null);
    }

    if (move.isCastleQueenside) {
      const { kingStartingSquare, kingCastlingSquare, rookStartingSquare, rookCastlingSquare } = getQueensideCastleTargets(pieceOwner);
      newSquares.set(kingCastlingSquare, move.piece);
      newSquares.set(kingStartingSquare, null);
      newSquares.set(rookCastlingSquare, newSquares.get(rookStartingSquare)!);
      newSquares.set(rookStartingSquare, null);
    }

    const movedPiece = move.promotion
      ? Piece.get(move.piece.owner, move.promotion)
      : move.piece;

    newSquares.set(move.targetSquare, movedPiece);
    return new Board(newSquares);
  }
}