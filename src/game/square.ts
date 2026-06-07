

export type SquareColor = "light" | "dark";

export const RANK_1 = 0;
export const RANK_2 = 1;
export const RANK_3 = 2;
export const RANK_4 = 3;
export const RANK_5 = 4;
export const RANK_6 = 5;
export const RANK_7 = 6;
export const RANK_8 = 7;

export const FILE_A = 0;
export const FILE_B = 1;
export const FILE_C = 2;
export const FILE_D = 3;
export const FILE_E = 4;
export const FILE_F = 5;
export const FILE_G = 6;
export const FILE_H = 7;

const FILE_TO_STRING: Record<number, string> = { 0: "a", 1: "b", 2: "c", 3: "d", 4: "e", 5: "f", 6: "g", 7: "h" };
const RANK_TO_STRING: Record<number, string> = { 0: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", 6: "7", 7: "8" };

const STRING_TO_FILE: Record<string, number> = { "a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7 };
const STRING_TO_RANK: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7 };

export class Square {
  public readonly file: number;
  public readonly rank: number;

  // Predefined squares for all 64 positions on the chessboard
  // Keeps reference for each square to ensure immutability and easy comparison
  public static readonly A1 = new Square(FILE_A, RANK_1);
  public static readonly B1 = new Square(FILE_B, RANK_1);
  public static readonly C1 = new Square(FILE_C, RANK_1);
  public static readonly D1 = new Square(FILE_D, RANK_1);
  public static readonly E1 = new Square(FILE_E, RANK_1);
  public static readonly F1 = new Square(FILE_F, RANK_1);
  public static readonly G1 = new Square(FILE_G, RANK_1);
  public static readonly H1 = new Square(FILE_H, RANK_1);
  public static readonly A2 = new Square(FILE_A, RANK_2);
  public static readonly B2 = new Square(FILE_B, RANK_2);
  public static readonly C2 = new Square(FILE_C, RANK_2);
  public static readonly D2 = new Square(FILE_D, RANK_2);
  public static readonly E2 = new Square(FILE_E, RANK_2);
  public static readonly F2 = new Square(FILE_F, RANK_2);
  public static readonly G2 = new Square(FILE_G, RANK_2);
  public static readonly H2 = new Square(FILE_H, RANK_2);
  public static readonly A3 = new Square(FILE_A, RANK_3);
  public static readonly B3 = new Square(FILE_B, RANK_3);
  public static readonly C3 = new Square(FILE_C, RANK_3);
  public static readonly D3 = new Square(FILE_D, RANK_3);
  public static readonly E3 = new Square(FILE_E, RANK_3);
  public static readonly F3 = new Square(FILE_F, RANK_3);
  public static readonly G3 = new Square(FILE_G, RANK_3);
  public static readonly H3 = new Square(FILE_H, RANK_3);
  public static readonly A4 = new Square(FILE_A, RANK_4);
  public static readonly B4 = new Square(FILE_B, RANK_4);
  public static readonly C4 = new Square(FILE_C, RANK_4);
  public static readonly D4 = new Square(FILE_D, RANK_4);
  public static readonly E4 = new Square(FILE_E, RANK_4);
  public static readonly F4 = new Square(FILE_F, RANK_4);
  public static readonly G4 = new Square(FILE_G, RANK_4);
  public static readonly H4 = new Square(FILE_H, RANK_4);
  public static readonly A5 = new Square(FILE_A, RANK_5);
  public static readonly B5 = new Square(FILE_B, RANK_5);
  public static readonly C5 = new Square(FILE_C, RANK_5);
  public static readonly D5 = new Square(FILE_D, RANK_5);
  public static readonly E5 = new Square(FILE_E, RANK_5);
  public static readonly F5 = new Square(FILE_F, RANK_5);
  public static readonly G5 = new Square(FILE_G, RANK_5);
  public static readonly H5 = new Square(FILE_H, RANK_5);
  public static readonly A6 = new Square(FILE_A, RANK_6);
  public static readonly B6 = new Square(FILE_B, RANK_6);
  public static readonly C6 = new Square(FILE_C, RANK_6);
  public static readonly D6 = new Square(FILE_D, RANK_6);
  public static readonly E6 = new Square(FILE_E, RANK_6);
  public static readonly F6 = new Square(FILE_F, RANK_6);
  public static readonly G6 = new Square(FILE_G, RANK_6);
  public static readonly H6 = new Square(FILE_H, RANK_6);
  public static readonly A7 = new Square(FILE_A, RANK_7);
  public static readonly B7 = new Square(FILE_B, RANK_7);
  public static readonly C7 = new Square(FILE_C, RANK_7);
  public static readonly D7 = new Square(FILE_D, RANK_7);
  public static readonly E7 = new Square(FILE_E, RANK_7);
  public static readonly F7 = new Square(FILE_F, RANK_7);
  public static readonly G7 = new Square(FILE_G, RANK_7);
  public static readonly H7 = new Square(FILE_H, RANK_7);
  public static readonly A8 = new Square(FILE_A, RANK_8);
  public static readonly B8 = new Square(FILE_B, RANK_8);
  public static readonly C8 = new Square(FILE_C, RANK_8);
  public static readonly D8 = new Square(FILE_D, RANK_8);
  public static readonly E8 = new Square(FILE_E, RANK_8);
  public static readonly F8 = new Square(FILE_F, RANK_8);
  public static readonly G8 = new Square(FILE_G, RANK_8);
  public static readonly H8 = new Square(FILE_H, RANK_8);

  public static readonly all: Square[] = [
    Square.A1, Square.B1, Square.C1, Square.D1, Square.E1, Square.F1, Square.G1, Square.H1,
    Square.A2, Square.B2, Square.C2, Square.D2, Square.E2, Square.F2, Square.G2, Square.H2,
    Square.A3, Square.B3, Square.C3, Square.D3, Square.E3, Square.F3, Square.G3, Square.H3,
    Square.A4, Square.B4, Square.C4, Square.D4, Square.E4, Square.F4, Square.G4, Square.H4,
    Square.A5, Square.B5, Square.C5, Square.D5, Square.E5, Square.F5, Square.G5, Square.H5,
    Square.A6, Square.B6, Square.C6, Square.D6, Square.E6, Square.F6, Square.G6, Square.H6,
    Square.A7, Square.B7, Square.C7, Square.D7, Square.E7, Square.F7, Square.G7, Square.H7,
    Square.A8, Square.B8, Square.C8, Square.D8, Square.E8, Square.F8, Square.G8, Square.H8,
  ];

  public static readonly whitePerspective: Square[] = [
    Square.A8, Square.B8, Square.C8, Square.D8, Square.E8, Square.F8, Square.G8, Square.H8,
    Square.A7, Square.B7, Square.C7, Square.D7, Square.E7, Square.F7, Square.G7, Square.H7,
    Square.A6, Square.B6, Square.C6, Square.D6, Square.E6, Square.F6, Square.G6, Square.H6,
    Square.A5, Square.B5, Square.C5, Square.D5, Square.E5, Square.F5, Square.G5, Square.H5,
    Square.A4, Square.B4, Square.C4, Square.D4, Square.E4, Square.F4, Square.G4, Square.H4,
    Square.A3, Square.B3, Square.C3, Square.D3, Square.E3, Square.F3, Square.G3, Square.H3,
    Square.A2, Square.B2, Square.C2, Square.D2, Square.E2, Square.F2, Square.G2, Square.H2,
    Square.A1, Square.B1, Square.C1, Square.D1, Square.E1, Square.F1, Square.G1, Square.H1,
  ];

  public static readonly blackPerspective: Square[] = [
    Square.A1, Square.B1, Square.C1, Square.D1, Square.E1, Square.F1, Square.G1, Square.H1,
    Square.A2, Square.B2, Square.C2, Square.D2, Square.E2, Square.F2, Square.G2, Square.H2,
    Square.A3, Square.B3, Square.C3, Square.D3, Square.E3, Square.F3, Square.G3, Square.H3,
    Square.A4, Square.B4, Square.C4, Square.D4, Square.E4, Square.F4, Square.G4, Square.H4,
    Square.A5, Square.B5, Square.C5, Square.D5, Square.E5, Square.F5, Square.G5, Square.H5,
    Square.A6, Square.B6, Square.C6, Square.D6, Square.E6, Square.F6, Square.G6, Square.H6,
    Square.A7, Square.B7, Square.C7, Square.D7, Square.E7, Square.F7, Square.G7, Square.H7,
    Square.A8, Square.B8, Square.C8, Square.D8, Square.E8, Square.F8, Square.G8, Square.H8,
  ];

  private constructor(file: number, rank: number) {
    this.file = file;
    this.rank = rank;
  }

  public static fromString(squareStr: string): Square {
    if (squareStr.length !== 2) {
      throw new Error(`Invalid square string: ${squareStr}`);
    }
    const fileChar = squareStr[0].toLowerCase();
    const rankChar = squareStr[1];
    const file = STRING_TO_FILE[fileChar];
    const rank = STRING_TO_RANK[rankChar];
    if (file === undefined || rank === undefined) {
      throw new Error(`Invalid square string: ${squareStr}`);
    }
    return Square.fromCoords(file, rank);
  }

  /**
   * Returns a Square given the file and rank coordinates.
   * 
   * If the coordinates correspond to a valid square on the chessboard, returns the predefined Square instance for that position.
   * 
   * If the coordinates are out of bounds, returns a new Square instance with those coordinates (which can be checked with isOutOfBounds()).
   * @param file The file (column) of the square in numeric form.
   * @param rank The rank (row) of the square in numeric form.
   * @returns The predefined Square instance corresponding to the given coordinates, or a new Square instance if the coordinates are out of bounds.
   */
  public static fromCoords(file: number, rank: number): Square {
    if (Square.isValid(file, rank)) {
      return Square.all[rank * 8 + file];
    }
    return new Square(file, rank);
  }

  public toString(): string {
    if (this.isOutOfBounds()) {
      return `out-of-bounds(${this.file},${this.rank})`;
    }
    return `${FILE_TO_STRING[this.file]}${RANK_TO_STRING[this.rank]}`;
  }

  /**
   * Returns the file and rank coordinates of this square as a tuple.
   * 
   * The file is returned as a number from 0 to 7, where 0 corresponds to file 'a' and 7 corresponds to file 'h'.
   * 
   * The rank is returned as a number from 0 to 7, where 0 corresponds to rank '1' and 7 corresponds to rank '8'.
   * @returns A tuple containing the file and rank coordinates of this square.
   */
  public coords(): [file: number, rank: number] {
    return [this.file, this.rank];
  }

  /**
   * Returns a Square that is the result of adding the given file and rank deltas to this square's coordinates.
   * 
   * If the resulting coordinates are out of bounds, returns a new Square with those out-of-bounds coordinates (which can be checked with isOutOfBounds()).
   * 
   * If the resulting coordinates are within bounds, returns the corresponding Square from the predefined squares.
   * @param fileDelta The change in file (horizontal movement) to apply to this square's coordinates. Can be positive, negative, or zero.
   * @param rankDelta The change in rank (vertical movement) to apply to this square's coordinates. Can be positive, negative, or zero.
   * @returns A predefined Square if the resulting coordinates are within bounds, or a new Square with out-of-bounds coordinates if they are not.
   */
  public addDelta([fileDelta, rankDelta]: [number, number]): Square {
    const newFile = this.file + fileDelta;
    const newRank = this.rank + rankDelta;
    return Square.fromCoords(newFile, newRank);
  }
  
  /**
   * Checks if this square's coordinates are out of bounds (i.e., not on the chessboard).
   * 
   * A square is considered out of bounds if its file is less than 0 or greater than 7, or if its rank is less than 0 or greater than 7.
   * @returns True if this square is out of bounds, false if it is within the bounds of the chessboard.
   */
  public isOutOfBounds(): boolean {
    return !Square.isValid(this.file, this.rank);
  }

  public static isValid(file: number, rank: number): boolean {
    return file >= 0 && file <= 7 && rank >= 0 && rank <= 7;
  }

}