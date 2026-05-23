export type Player = "white" | "black";

export type King = "king";
export type Queen = "queen";
export type Rook = "rook";
export type Bishop = "bishop";
export type Knight = "knight";
export type Pawn = "pawn";

export const PIECE_TYPES = ["king", "queen", "rook", "bishop", "knight", "pawn"] as const;

export type PieceType = typeof PIECE_TYPES[number];
export type PieceOwner = Player;

export type Piece = `${PieceOwner} ${PieceType}`;

export const getPieceType = (piece: Piece): PieceType => {
  return piece.split(" ")[1] as PieceType;
};

export const getPieceOwner = (piece: Piece): Player => {
  return piece.split(" ")[0] as Player;
};

export const getPieceInfo = (piece: Piece): { pieceOwner: PieceOwner; pieceType: PieceType } => {
  const [pieceOwner, pieceType] = piece.split(" ") as [PieceOwner, PieceType];
  return { pieceOwner, pieceType };
};
