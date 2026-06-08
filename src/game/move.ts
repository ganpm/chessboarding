import { Square } from "@/game/square";
import { Piece, PieceType } from "@/game/piece";

export class Move {
  public readonly originSquare: Square;
  public readonly targetSquare: Square;
  public readonly piece: Piece;
  public readonly capturedPiece: Piece | null;
  public readonly capturedSquare: Square | null;
  public readonly isCastleKingside: boolean;
  public readonly isCastleQueenside: boolean
  public readonly isEnPassant: boolean;
  public readonly promotion: PieceType | null;
  public isCheck: boolean;
  public isCheckmate: boolean;

  public constructor(
    originSquare: Square,
    targetSquare: Square,
    piece: Piece,
    capturedPiece: Piece | null = null,
    capturedSquare: Square | null = null,
    isCastleKingside: boolean = false,
    isCastleQueenside: boolean = false,
    isEnPassant: boolean = false,
    promotion: PieceType | null = null,
    isCheck: boolean = false,
    isCheckmate: boolean = false,
  ) {
    this.originSquare = originSquare;
    this.targetSquare = targetSquare;
    this.piece = piece;
    this.capturedPiece = capturedPiece;
    this.capturedSquare = capturedSquare;
    this.isCastleKingside = isCastleKingside;
    this.isCastleQueenside = isCastleQueenside;
    this.isEnPassant = isEnPassant;
    this.promotion = promotion;
    this.isCheck = isCheck;
    this.isCheckmate = isCheckmate;
  }

  public rankDelta(): number {
    return Math.abs(this.targetSquare.rank - this.originSquare.rank);
  }

  public format(): string {
    const isCapture = this.capturedPiece!!;
    const checkSymbol = this.isCheckmate ? "#" : this.isCheck ? "+" : "";
    const promotionSymbol = this.promotion ? `=${this.promotion.toString()}` : "";

    if (this.isCastleKingside) {
      return `O-O${checkSymbol}`;
    } else if (this.isCastleQueenside) {
      return `O-O-O${checkSymbol}`;
    } else {
      const pieceSymbol = this.piece.type !== PieceType.PAWN
        ? this.piece.type.symbol()
        : isCapture
          ? this.originSquare.toString()[0] // use the file of the origin square for pawn captures (e.g. exd5)
          : "";
      const captureSymbol = isCapture ? "x" : "";
      // TODO: disambiguation symbols (e.g. Nbd2 vs Nfd2) are not currently supported
      return `${pieceSymbol}${captureSymbol}${this.targetSquare.toString()}${promotionSymbol}${checkSymbol}`;
    }
  }
}
