import { Piece } from "@/game/piece";
import { Square } from "@/game/square";

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

  /**
   * Returns a new Board instance that is the result of moving a piece from the origin square to the target square.
   * 
   * If there is no piece on the origin square, throws an error.
   * @param origin The square from which the piece is moving.
   * @param target The square to which the piece is moving.
   * @returns A new Board instance with the piece moved from the origin to the target square.
   */
  public movePiece(origin: Square, target: Square, promotion?: Piece): Board {
    const piece = this.pieceAt(origin);
    if (!piece) {
      throw new Error(`No piece on square ${origin.toString()} to move`);
    }

    const newSquares = new Map(this.squares);
    newSquares.set(origin, null);
    newSquares.set(target, promotion || piece);

    return new Board(newSquares);
  }

  /**
   * Returns a new Board instance that is the result of moving two pieces simultaneously from their respective origin squares to their respective target squares.
   * If there is no piece on either of the origin squares, throws an error.
   * 
   * This method is useful for moves that involve moving two pieces at once, such as castling (where both the king and rook move simultaneously).
   * @param origin1 The square from which the first piece is moving.
   * @param target1 The square to which the first piece is moving.
   * @param origin2 The square from which the second piece is moving.
   * @param target2 The square to which the second piece is moving.
   * @returns A new Board instance with both pieces moved to their respective target squares.
   */
  public moveTwoPieces(origin1: Square, target1: Square, origin2: Square, target2: Square): Board {
    const piece1 = this.pieceAt(origin1);
    const piece2 = this.pieceAt(origin2);
    if (!piece1) {
      throw new Error(`No piece on square ${origin1.toString()} to move`);
    }
    if (!piece2) {
      throw new Error(`No piece on square ${origin2.toString()} to move`);
    }

    const newSquares = new Map(this.squares);
    newSquares.set(origin1, null);
    newSquares.set(target1, piece1);
    newSquares.set(origin2, null);
    newSquares.set(target2, piece2);

    return new Board(newSquares);
  }
}