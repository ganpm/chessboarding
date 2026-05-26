import { describe, expect, it } from "vitest";

import {
  type GameState,
  type Move,
  type Piece,
  type Square,
  SQUARES,
  createMove,
  getLegalMovesForSquare,
  hasAnyLegalMove,
  initialBoard,
  isCheckmate,
  isPlayerInCheck,
  makeMove,
} from "@/data/game";

const emptyBoard = (): Map<Square, Piece | null> => {
  return new Map(SQUARES.map((square) => [square, null] as const));
};

const withPieces = (pieces: Array<[Square, Piece]>): Map<Square, Piece | null> => {
  const board = emptyBoard();

  for (const [square, piece] of pieces) {
    board.set(square, piece);
  }

  return board;
};

const gameFromBoard = (board: Map<Square, Piece | null>, moves: Move[] = []): GameState => ({
  board,
  moves,
});

describe("Game validation (frontend rules, no promotion)", () => {
  it("allows white kingside castling when legal", () => {
    const board = withPieces([
      ["e1", "white king"],
      ["h1", "white rook"],
      ["e8", "black king"],
    ]);
    const game = gameFromBoard(board);

    const legalMoves = getLegalMovesForSquare(game, "e1");

    expect(legalMoves).toContain("g1");
  });

  it("disallows white kingside castling when path is attacked", () => {
    const board = withPieces([
      ["e1", "white king"],
      ["h1", "white rook"],
      ["e8", "black king"],
      ["f8", "black rook"],
    ]);
    const game = gameFromBoard(board);

    const legalMoves = getLegalMovesForSquare(game, "e1");

    expect(legalMoves).not.toContain("g1");
  });

  it("disallows castling after rook has moved and returned", () => {
    const startBoard = withPieces([
      ["e1", "white king"],
      ["h1", "white rook"],
      ["e8", "black king"],
    ]);

    const game0 = gameFromBoard(startBoard);
    const moveOut = createMove(game0, "h1", "h2");
    expect(moveOut).not.toBeNull();

    const game1 = makeMove(game0, moveOut!);
    const moveBack = createMove(game1, "h2", "h1");
    expect(moveBack).not.toBeNull();

    const game2 = makeMove(game1, moveBack!);
    const legalMoves = getLegalMovesForSquare(game2, "e1");

    expect(legalMoves).not.toContain("g1");
  });

  it("supports en passant capture correctly", () => {
    const board = withPieces([
      ["e1", "white king"],
      ["e8", "black king"],
      ["e5", "white pawn"],
      ["d5", "black pawn"],
    ]);

    const lastMove: Move = {
      from: "d7",
      to: "d5",
      piece: "black pawn",
      capturedPiece: null,
      capturedPosition: null,
      isCastleKingside: false,
      isCastleQueenside: false,
      isEnPassant: false,
      promotion: null,
      isCheck: false,
      isCheckmate: false,
    };

    const game = gameFromBoard(board, [lastMove]);
    const legalMoves = getLegalMovesForSquare(game, "e5");
    expect(legalMoves).toContain("d6");

    const epMove = createMove(game, "e5", "d6");
    expect(epMove).not.toBeNull();
    expect(epMove?.isEnPassant).toBe(true);
    expect(epMove?.capturedPiece).toBe("black pawn");
    expect(epMove?.capturedPosition).toBe("d5");

    const nextGame = makeMove(game, epMove!);
    expect(nextGame.board.get("d5")).toBeNull();
    expect(nextGame.board.get("d6")).toBe("white pawn");
  });

  it("enforces pinned-piece legality", () => {
    const board = withPieces([
      ["e1", "white king"],
      ["e2", "white rook"],
      ["e8", "black rook"],
      ["a8", "black king"],
    ]);
    const game = gameFromBoard(board);

    const legalMoves = getLegalMovesForSquare(game, "e2");

    expect(legalMoves).toContain("e3");
    expect(legalMoves).toContain("e8");
    expect(legalMoves).not.toContain("d2");
    expect(legalMoves).not.toContain("f2");
  });

  it("detects checkmate in Fool's Mate", () => {
    let game: GameState = {
      board: new Map(initialBoard),
      moves: [],
    };

    const m1 = createMove(game, "f2", "f3");
    expect(m1).not.toBeNull();
    game = makeMove(game, m1!);

    const m2 = createMove(game, "e7", "e5");
    expect(m2).not.toBeNull();
    game = makeMove(game, m2!);

    const m3 = createMove(game, "g2", "g4");
    expect(m3).not.toBeNull();
    game = makeMove(game, m3!);

    const m4 = createMove(game, "d8", "h4");
    expect(m4).not.toBeNull();
    expect(m4?.isCheck).toBe(true);
    expect(m4?.isCheckmate).toBe(true);
    game = makeMove(game, m4!);

    expect(isPlayerInCheck(game, "white")).toBe(true);
    expect(hasAnyLegalMove(game, "white")).toBe(false);
    expect(isCheckmate(game, "white")).toBe(true);
  });
});
