import { Player } from "@/game/player";

const KING   = "king";
const QUEEN  = "queen";
const ROOK   = "rook";
const BISHOP = "bishop";
const KNIGHT = "knight";
const PAWN   = "pawn";

export const PIECE_KINDS = [KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN] as const;

export type PieceKind = typeof PIECE_KINDS[number];

export class PieceType {
  private readonly type: PieceKind;

  public static readonly KING:   PieceType = new PieceType(KING);
  public static readonly QUEEN:  PieceType = new PieceType(QUEEN);
  public static readonly ROOK:   PieceType = new PieceType(ROOK);
  public static readonly BISHOP: PieceType = new PieceType(BISHOP);
  public static readonly KNIGHT: PieceType = new PieceType(KNIGHT);
  public static readonly PAWN:   PieceType = new PieceType(PAWN);

  public static readonly all: PieceType[] = [
    PieceType.KING,
    PieceType.QUEEN,
    PieceType.ROOK,
    PieceType.BISHOP,
    PieceType.KNIGHT,
    PieceType.PAWN
  ];

  public static readonly promotions: PieceType[] = [
    PieceType.QUEEN,
    PieceType.ROOK,
    PieceType.BISHOP,
    PieceType.KNIGHT,
  ];

  private constructor(type: PieceKind) {
    if (!PIECE_KINDS.includes(type)) {
      throw new Error(`Invalid piece type: ${type}`);
    }
    this.type = type;
  }

  public static fromString(type: string): PieceType {
    switch (type) {
      case KING:   return PieceType.KING;
      case QUEEN:  return PieceType.QUEEN;
      case ROOK:   return PieceType.ROOK;
      case BISHOP: return PieceType.BISHOP;
      case KNIGHT: return PieceType.KNIGHT;
      case PAWN:   return PieceType.PAWN;
      default:
        throw new Error(`Invalid piece type string: ${type}`);
    }
  }

  public toString(): string {
    return this.type as string;
  }

  // TODO: add method to get possible moves for this piece type
}


export class Piece {
  public readonly type: PieceType;
  public readonly owner: Player;

  public static readonly WHITE_KING:   Piece = new Piece(Player.WHITE, PieceType.KING);
  public static readonly WHITE_QUEEN:  Piece = new Piece(Player.WHITE, PieceType.QUEEN);
  public static readonly WHITE_ROOK:   Piece = new Piece(Player.WHITE, PieceType.ROOK);
  public static readonly WHITE_BISHOP: Piece = new Piece(Player.WHITE, PieceType.BISHOP);
  public static readonly WHITE_KNIGHT: Piece = new Piece(Player.WHITE, PieceType.KNIGHT);
  public static readonly WHITE_PAWN:   Piece = new Piece(Player.WHITE, PieceType.PAWN);
  public static readonly BLACK_KING:   Piece = new Piece(Player.BLACK, PieceType.KING);
  public static readonly BLACK_QUEEN:  Piece = new Piece(Player.BLACK, PieceType.QUEEN);
  public static readonly BLACK_ROOK:   Piece = new Piece(Player.BLACK, PieceType.ROOK);
  public static readonly BLACK_BISHOP: Piece = new Piece(Player.BLACK, PieceType.BISHOP);
  public static readonly BLACK_KNIGHT: Piece = new Piece(Player.BLACK, PieceType.KNIGHT);
  public static readonly BLACK_PAWN:   Piece = new Piece(Player.BLACK, PieceType.PAWN);

  public static readonly WHITE_PIECES: Piece[] = [
    Piece.WHITE_KING,
    Piece.WHITE_QUEEN,
    Piece.WHITE_ROOK,
    Piece.WHITE_BISHOP,
    Piece.WHITE_KNIGHT,
    Piece.WHITE_PAWN
  ];

  public static readonly BLACK_PIECES: Piece[] = [
    Piece.BLACK_KING,
    Piece.BLACK_QUEEN,
    Piece.BLACK_ROOK,
    Piece.BLACK_BISHOP,
    Piece.BLACK_KNIGHT,
    Piece.BLACK_PAWN
  ];

  private constructor(owner: Player, type: PieceType) {
    this.type = type;
    this.owner = owner;
  }

  public static fromString(str: string): Piece {
    switch (str.toLowerCase()) {
      case "white king":   return Piece.WHITE_KING;
      case "white queen":  return Piece.WHITE_QUEEN;
      case "white rook":   return Piece.WHITE_ROOK;
      case "white bishop": return Piece.WHITE_BISHOP;
      case "white knight": return Piece.WHITE_KNIGHT;
      case "white pawn":   return Piece.WHITE_PAWN;
      case "black king":   return Piece.BLACK_KING;
      case "black queen":  return Piece.BLACK_QUEEN;
      case "black rook":   return Piece.BLACK_ROOK;
      case "black bishop": return Piece.BLACK_BISHOP;
      case "black knight": return Piece.BLACK_KNIGHT;
      case "black pawn":   return Piece.BLACK_PAWN;
      default: throw new Error(`Invalid piece string: ${str}`);
    }
  }

  public static get(player: Player, type: PieceType): Piece {
    return Piece.fromString(`${player.toString()} ${type.toString()}`);
  }

  public toString(): string {
    return `${this.owner} ${this.type}`;
  }

  public static getKingPiece(player: Player): Piece {
    switch (player.toString()) {
      case Player.WHITE.toString(): return Piece.WHITE_KING;
      case Player.BLACK.toString(): return Piece.BLACK_KING;
      default: throw new Error(`Invalid player: ${player}`);
    }
  }

  public static getRookPiece(player: Player): Piece {
    switch (player.toString()) {
      case Player.WHITE.toString(): return Piece.WHITE_ROOK;
      case Player.BLACK.toString(): return Piece.BLACK_ROOK;
      default: throw new Error(`Invalid player: ${player}`);
    }
  }

  public is(other: Piece): boolean {
    return this.type === other.type && this.owner === other.owner;
  }

  public static fromPlayer(player: Player): Piece[] {
    switch (player.toString()) {
      case Player.WHITE.toString(): return Piece.WHITE_PIECES;
      case Player.BLACK.toString(): return Piece.BLACK_PIECES;
      default: throw new Error(`Invalid player: ${player}`);
    }
  }
}