import { Square } from "@/game/square";
import { PieceType } from "@/game/piece";


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
