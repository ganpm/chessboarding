
const WHITE = "white";
const BLACK = "black";

export type PlayerColor = typeof WHITE | typeof BLACK;

export class Player {
  private readonly color: PlayerColor;

  public static readonly WHITE: Player = new Player(WHITE);
  public static readonly BLACK: Player = new Player(BLACK);

  public static readonly all: Player[] = [Player.WHITE, Player.BLACK];

  private static readonly OPPONENT: Record<PlayerColor, Player> = {
    [WHITE]: Player.BLACK,
    [BLACK]: Player.WHITE,
  };

  private constructor(color: PlayerColor) {
    this.color = color;
  }

  public static fromString(color: string): Player {
    switch (color.toLowerCase()) {
      case WHITE: return Player.WHITE;
      case BLACK: return Player.BLACK;
      default:
        throw new Error(`Invalid player color string: ${color}`);
    }
  }

  public toString(): string {
    return this.color as string;
  }

  public opponent(): Player {
    return Player.OPPONENT[this.color];
  }

  public is(other: Player): boolean {
    return this.color === other.color;
  }
}