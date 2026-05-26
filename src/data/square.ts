import { type Piece } from "@/data/piece";

export type SquareColor = "light" | "dark";

export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export type Rank = typeof RANKS[number];
export type File = typeof FILES[number];

export type Square = `${File}${Rank}`;

export const SQUARES: Square[] = FILES.flatMap(
  file => RANKS.toReversed().map(rank => `${file}${rank}` as Square)
);

export type Board = Map<Square, Piece | null>;

export const initialBoard: Board = new Map<Square, Piece | null>([
  ["a1", "white rook"],
  ["b1", "white knight"],
  ["c1", "white bishop"],
  ["d1", "white queen"],
  ["e1", "white king"],
  ["f1", "white bishop"],
  ["g1", "white knight"],
  ["h1", "white rook"],
  ["a2", "white pawn"],
  ["b2", "white pawn"],
  ["c2", "white pawn"],
  ["d2", "white pawn"],
  ["e2", "white pawn"],
  ["f2", "white pawn"],
  ["g2", "white pawn"],
  ["h2", "white pawn"],
  ["a3", null],
  ["b3", null],
  ["c3", null],
  ["d3", null],
  ["e3", null],
  ["f3", null],
  ["g3", null],
  ["h3", null],
  ["a4", null],
  ["b4", null],
  ["c4", null],
  ["d4", null],
  ["e4", null],
  ["f4", null],
  ["g4", null],
  ["h4", null],
  ["a5", null],
  ["b5", null],
  ["c5", null],
  ["d5", null],
  ["e5", null],
  ["f5", null],
  ["g5", null],
  ["h5", null],
  ["a6", null],
  ["b6", null],
  ["c6", null],
  ["d6", null],
  ["e6", null],
  ["f6", null],
  ["g6", null],
  ["h6", null],
  ["a7", "black pawn"],
  ["b7", "black pawn"],
  ["c7", "black pawn"],
  ["d7", "black pawn"],
  ["e7", "black pawn"],
  ["f7", "black pawn"],
  ["g7", "black pawn"],
  ["h7", "black pawn"],
  ["a8", "black rook"],
  ["b8", "black knight"],
  ["c8", "black bishop"],
  ["d8", "black queen"],
  ["e8", "black king"],
  ["f8", "black bishop"],
  ["g8", "black knight"],
  ["h8", "black rook"],
]);

const FILE_TO_COORD: Record<string, number> = { "a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7 };
const RANK_TO_COORD: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7 };

export const squareToCoords = (square: Square): [number, number] => {
  const file = square[0];
  const rank = square[1];

  if (FILE_TO_COORD[file] === undefined || RANK_TO_COORD[rank] === undefined) {
    throw new Error(`Invalid square: ${square}`);
  }

  return [FILE_TO_COORD[file], RANK_TO_COORD[rank]];
};

const COORD_TO_FILE: Record<number, string> = { 0: "a", 1: "b", 2: "c", 3: "d", 4: "e", 5: "f", 6: "g", 7: "h" };
const COORD_TO_RANK: Record<number, string> = { 0: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", 6: "7", 7: "8" };

export const coordsToSquare = (file: number, rank: number): Square => {
  const fileStr = COORD_TO_FILE[file];
  const rankStr = COORD_TO_RANK[rank];

  if (fileStr === undefined || rankStr === undefined) {
    throw new Error(`Invalid coordinates: (${file}, ${rank})`);
  }

  return `${fileStr}${rankStr}` as Square;
};

export const getPieceAt = (board: Board, square: Square): Piece | null => {
  return board.get(square) || null;
};

export const isSquareEmpty = (board: Board, square: Square): boolean => {
  return board.get(square) === null;
};
