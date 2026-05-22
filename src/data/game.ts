export type SquareColor = "light" | "dark";
export type Player = "white" | "black";

export type King = "king";
export type Queen = "queen";
export type Rook = "rook";
export type Bishop = "bishop";
export type Knight = "knight";
export type Pawn = "pawn";

export type PieceType = King | Queen | Rook | Bishop | Knight | Pawn;
export type PieceOwner = Player;


export type Piece = `${PieceOwner} ${PieceType}`;

export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
export const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export type Rank = typeof ranks[number];
export type File = typeof files[number];

export type Position = `${File}${Rank}`;

export const positions: Position[] = files.flatMap(
  file => ranks.toReversed().map(rank => `${file}${rank}` as Position)
);

export type Board = Map<Position, Piece | null>;

export const initialBoard: Board = new Map<Position, Piece | null>([
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

export const positionToCoords = (position: Position): [number, number] => {
  const file = position[0];
  const rank = position[1];

  const fileToCoord: Record<string, number> = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7,
  };

  const rankToCoord: Record<string, number> = {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
  };

  return [fileToCoord[file], rankToCoord[rank]];
};


export const coordsToPosition = (file: number, rank: number): Position => {
  const coordToFile: Record<number, string> = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
  };

  const coordToRank: Record<number, string> = {
    0: "1",
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "7",
    7: "8",
  };

  if (!coordToFile[file] || !coordToRank[rank]) {
    throw new Error(`Invalid coordinates: (${file}, ${rank})`);
  }

  return `${coordToFile[file]}${coordToRank[rank]}` as Position;
};

export const getPieceType = (piece: Piece): PieceType => {
  return piece.split(" ")[1] as PieceType;
};

export const getPieceOwner = (piece: Piece): Player => {
  return piece.split(" ")[0] as Player;
};

export const getPieceInfo = (piece: Piece): { pieceOwner: PieceOwner, pieceType: PieceType } => {
  const [pieceOwner, pieceType] = piece.split(" ") as [PieceOwner, PieceType];
  return { pieceOwner, pieceType };
};

export const getPieceAt = (board: Board, position: Position): Piece | null => {
  return board.get(position) || null;
};

export const isPositionEmpty = (board: Board, position: Position): boolean => {
  return !board.get(position);
};

export interface GameState {
  board: Board;
  moves: Move[];
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece: Piece | null;
  capturedPosition: Position | null;
  isCastleKingside: boolean;
  isCastleQueenside: boolean;
  isEnPassant: boolean;
  promotion: PieceType | null;
  isCheck: boolean;
  isCheckmate: boolean;
}

export interface GameFlags {
  whiteCanCastleKingside: boolean;
  whiteCanCastleQueenside: boolean;
  blackCanCastleKingside: boolean;
  blackCanCastleQueenside: boolean;
  enPassantTarget: Position | null;
}

export const initialFlags: GameFlags = {
  whiteCanCastleKingside: true,
  whiteCanCastleQueenside: true,
  blackCanCastleKingside: true,
  blackCanCastleQueenside: true,
  enPassantTarget: null,
};

const getOpponent = (player: Player): Player => {
  return player === "white" ? "black" : "white";
};

export const getCurrentPlayer = (moves: Move[]): Player => {
  return moves.length % 2 === 0 ? "white" : "black";
};

export const getGameFlags = (game: GameState): GameFlags => {
  const flags: GameFlags = {
    ...initialFlags,
  };

  for (const move of game.moves) {
    const owner = getPieceOwner(move.piece);
    const type = getPieceType(move.piece);

    if (type === "king") {
      if (owner === "white") {
        flags.whiteCanCastleKingside = false;
        flags.whiteCanCastleQueenside = false;
      } else {
        flags.blackCanCastleKingside = false;
        flags.blackCanCastleQueenside = false;
      }
    }

    if (type === "rook") {
      if (owner === "white" && move.from === "h1") flags.whiteCanCastleKingside = false;
      if (owner === "white" && move.from === "a1") flags.whiteCanCastleQueenside = false;
      if (owner === "black" && move.from === "h8") flags.blackCanCastleKingside = false;
      if (owner === "black" && move.from === "a8") flags.blackCanCastleQueenside = false;
    }

    if (move.capturedPiece === "white rook") {
      if (move.capturedPosition === "h1") flags.whiteCanCastleKingside = false;
      if (move.capturedPosition === "a1") flags.whiteCanCastleQueenside = false;
    }

    if (move.capturedPiece === "black rook") {
      if (move.capturedPosition === "h8") flags.blackCanCastleKingside = false;
      if (move.capturedPosition === "a8") flags.blackCanCastleQueenside = false;
    }
  }

  const lastMove = game.moves.at(-1);
  if (lastMove && getPieceType(lastMove.piece) === "pawn") {
    const [, fromRank] = positionToCoords(lastMove.from);
    const [, toRank] = positionToCoords(lastMove.to);
    if (Math.abs(toRank - fromRank) === 2) {
      const [file] = positionToCoords(lastMove.from);
      const middleRank = (fromRank + toRank) / 2;
      flags.enPassantTarget = coordsToPosition(file, middleRank);
    }
  }

  return flags;
};


export const getPossibleMoves = (board: Board, position: Position): Position[] => {
  const piece = getPieceAt(board, position);
  if (!piece) return [];
  const [file, rank] = positionToCoords(position);
  const { pieceOwner, pieceType } = getPieceInfo(piece);
  let moves: Position[] = [];

  switch (pieceType) {
    case "pawn":
      if (pieceOwner === "white") {
        if (rank < 7) {
          // Pawns move forward, so we check the square directly in front
          const forwardPos = coordsToPosition(file, rank + 1);
          if (isPositionEmpty(board, forwardPos)) {
            moves.push(forwardPos);
            // If the pawn is on its starting rank, it can move two squares forward
            if (rank === 1) {
              const doubleForwardPos = coordsToPosition(file, rank + 2);
              if (isPositionEmpty(board, doubleForwardPos)) {
                moves.push(doubleForwardPos);
              }
            }
          }
          // Pawns capture diagonally, so we check the squares diagonally in front
          if (file > 0) {
            const captureLeftPos = coordsToPosition(file - 1, rank + 1);
            const captureLeftPiece = getPieceAt(board, captureLeftPos);
            if (captureLeftPiece && getPieceOwner(captureLeftPiece) === "black") {
              moves.push(captureLeftPos);
            }
          }
          if (file < 7) {
            const captureRightPos = coordsToPosition(file + 1, rank + 1);
            const captureRightPiece = getPieceAt(board, captureRightPos);
            if (captureRightPiece && getPieceOwner(captureRightPiece) === "black") {
              moves.push(captureRightPos);
            }
          }
        }
      } else {
        if (rank > 0) {
          const forwardPos = coordsToPosition(file, rank - 1);
          if (isPositionEmpty(board, forwardPos)) {
            moves.push(forwardPos);
            if (rank === 6) {
              const doubleForwardPos = coordsToPosition(file, rank - 2);
              if (isPositionEmpty(board, doubleForwardPos)) {
                moves.push(doubleForwardPos);
              }
            }
          }
          if (file > 0) {
            const captureLeftPos = coordsToPosition(file - 1, rank - 1);
            const captureLeftPiece = getPieceAt(board, captureLeftPos);
            if (captureLeftPiece && getPieceOwner(captureLeftPiece) === "white") {
              moves.push(captureLeftPos);
            }
          }
          if (file < 7) {
            const captureRightPos = coordsToPosition(file + 1, rank - 1);
            const captureRightPiece = getPieceAt(board, captureRightPos);
            if (captureRightPiece && getPieceOwner(captureRightPiece) === "white") {
              moves.push(captureRightPos);
            }
          }
        }
      }
      break;
    case "rook":
      // Rooks can move any number of squares along a rank or file, but cannot leap over other pieces
      const rookDirections: [number, number][] = [
        [ 1,  0],
        [-1,  0],
        [ 0,  1],
        [ 0, -1]
      ];
      moves = moves.concat(getLinearMoves(board, position, rookDirections));
      break;
    case "knight":
      // Knights move in an L-shape: two squares in one direction and then one square perpendicular to that
      const knightMoves: [number, number][] = [
        [ 2,  1],
        [ 2, -1],
        [-2,  1],
        [-2, -1],
        [ 1,  2],
        [ 1, -2],
        [-1,  2],
        [-1, -2]
      ];
      moves = moves.concat(getSingleMoves(board, position, knightMoves));
      break;
    case "bishop":
      // Bishops can move any number of squares diagonally, but cannot leap over other pieces
      const bishopDirections: [number, number][] = [
        [ 1,  1],
        [ 1, -1],
        [-1,  1],
        [-1, -1]
      ];
      moves = moves.concat(getLinearMoves(board, position, bishopDirections));
      break;
    case "queen":
      // Queens can move any number of squares along a rank, file, or diagonal, but cannot leap over other pieces
      const queenDirections: [number, number][] = [
        [ 1,  0],
        [-1,  0],
        [ 0,  1],
        [ 0, -1],
        [ 1,  1],
        [ 1, -1],
        [-1,  1],
        [-1, -1]
      ];
      moves = moves.concat(getLinearMoves(board, position, queenDirections));
      break;
    case "king":
      // Kings can move one square in any direction
      const kingMoves: [number, number][] = [
        [ 1,  0],
        [-1,  0],
        [ 0,  1],
        [ 0, -1],
        [ 1,  1],
        [ 1, -1],
        [-1,  1],
        [-1, -1]
      ];
      moves = moves.concat(getSingleMoves(board, position, kingMoves));
      break;
    default:
      throw new Error(`Unknown piece type: ${pieceType}`);
  }
  return moves;
};

const getAttackSquares = (board: Board, position: Position): Position[] => {
  const piece = getPieceAt(board, position);
  if (!piece) return [];

  const [file, rank] = positionToCoords(position);
  const { pieceOwner, pieceType } = getPieceInfo(piece);

  switch (pieceType) {
    case "pawn": {
      const dir = pieceOwner === "white" ? 1 : -1;
      const targets: Position[] = [];

      if (file > 0 && rank + dir >= 0 && rank + dir < 8) {
        targets.push(coordsToPosition(file - 1, rank + dir));
      }
      if (file < 7 && rank + dir >= 0 && rank + dir < 8) {
        targets.push(coordsToPosition(file + 1, rank + dir));
      }

      return targets;
    }
    case "knight": {
      const knightMoves: [number, number][] = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
      ];
      const targets: Position[] = [];

      for (const [fileDir, rankDir] of knightMoves) {
        const newFile = file + fileDir;
        const newRank = rank + rankDir;
        if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
          targets.push(coordsToPosition(newFile, newRank));
        }
      }

      return targets;
    }
    case "king": {
      const kingMoves: [number, number][] = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
      const targets: Position[] = [];

      for (const [fileDir, rankDir] of kingMoves) {
        const newFile = file + fileDir;
        const newRank = rank + rankDir;
        if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
          targets.push(coordsToPosition(newFile, newRank));
        }
      }

      return targets;
    }
    case "rook":
      return getLinearAttackSquares(board, position, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]);
    case "bishop":
      return getLinearAttackSquares(board, position, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
    case "queen":
      return getLinearAttackSquares(board, position, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
    default:
      return [];
  }
};

const getLinearAttackSquares = (board: Board, position: Position, directions: [number, number][]): Position[] => {
  const [file, rank] = positionToCoords(position);
  const targets: Position[] = [];

  for (const [fileDir, rankDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newFile = file + fileDir * i;
      const newRank = rank + rankDir * i;

      if (newFile < 0 || newFile > 7 || newRank < 0 || newRank > 7) {
        break;
      }

      const target = coordsToPosition(newFile, newRank);
      targets.push(target);

      if (!isPositionEmpty(board, target)) {
        break;
      }
    }
  }

  return targets;
};

const getKingPosition = (board: Board, player: Player): Position | null => {
  const king = `${player} king` as Piece;

  for (const position of positions) {
    if (getPieceAt(board, position) === king) {
      return position;
    }
  }

  return null;
};

const isSquareAttacked = (board: Board, square: Position, attacker: Player): boolean => {
  for (const position of positions) {
    const piece = getPieceAt(board, position);
    if (!piece || getPieceOwner(piece) !== attacker) {
      continue;
    }

    const attacked = getAttackSquares(board, position);
    if (attacked.includes(square)) {
      return true;
    }
  }

  return false;
};

const isPlayerInCheckOnBoard = (board: Board, player: Player): boolean => {
  const kingPos = getKingPosition(board, player);
  if (!kingPos) {
    return false;
  }

  return isSquareAttacked(board, kingPos, getOpponent(player));
};

const getSpecialMoves = (game: GameState, position: Position): Position[] => {
  const piece = getPieceAt(game.board, position);
  if (!piece) return [];

  const { pieceOwner, pieceType } = getPieceInfo(piece);
  const [file, rank] = positionToCoords(position);
  const flags = getGameFlags(game);
  const specialMoves: Position[] = [];

  if (pieceType === "pawn" && flags.enPassantTarget) {
    const [targetFile, targetRank] = positionToCoords(flags.enPassantTarget);
    const forward = pieceOwner === "white" ? 1 : -1;
    if (targetRank === rank + forward && Math.abs(targetFile - file) === 1) {
      specialMoves.push(flags.enPassantTarget);
    }
  }

  if (pieceType === "king") {
    const opponent = getOpponent(pieceOwner);

    if (pieceOwner === "white") {
      if (
        flags.whiteCanCastleKingside
        && getPieceAt(game.board, "e1") === "white king"
        && getPieceAt(game.board, "h1") === "white rook"
        && isPositionEmpty(game.board, "f1")
        && isPositionEmpty(game.board, "g1")
        && !isSquareAttacked(game.board, "e1", opponent)
        && !isSquareAttacked(game.board, "f1", opponent)
        && !isSquareAttacked(game.board, "g1", opponent)
      ) {
        specialMoves.push("g1");
      }

      if (
        flags.whiteCanCastleQueenside
        && getPieceAt(game.board, "e1") === "white king"
        && getPieceAt(game.board, "a1") === "white rook"
        && isPositionEmpty(game.board, "d1")
        && isPositionEmpty(game.board, "c1")
        && isPositionEmpty(game.board, "b1")
        && !isSquareAttacked(game.board, "e1", opponent)
        && !isSquareAttacked(game.board, "d1", opponent)
        && !isSquareAttacked(game.board, "c1", opponent)
      ) {
        specialMoves.push("c1");
      }
    } else {
      if (
        flags.blackCanCastleKingside
        && getPieceAt(game.board, "e8") === "black king"
        && getPieceAt(game.board, "h8") === "black rook"
        && isPositionEmpty(game.board, "f8")
        && isPositionEmpty(game.board, "g8")
        && !isSquareAttacked(game.board, "e8", opponent)
        && !isSquareAttacked(game.board, "f8", opponent)
        && !isSquareAttacked(game.board, "g8", opponent)
      ) {
        specialMoves.push("g8");
      }

      if (
        flags.blackCanCastleQueenside
        && getPieceAt(game.board, "e8") === "black king"
        && getPieceAt(game.board, "a8") === "black rook"
        && isPositionEmpty(game.board, "d8")
        && isPositionEmpty(game.board, "c8")
        && isPositionEmpty(game.board, "b8")
        && !isSquareAttacked(game.board, "e8", opponent)
        && !isSquareAttacked(game.board, "d8", opponent)
        && !isSquareAttacked(game.board, "c8", opponent)
      ) {
        specialMoves.push("c8");
      }
    }
  }

  return specialMoves;
};

const createMove = (
  game: GameState,
  from: Position,
  to: Position,
  evaluateCheckmate: boolean = true,
): Move | null => {
  const piece = getPieceAt(game.board, from);
  if (!piece) return null;

  const pieceOwner = getPieceOwner(piece);
  const pieceType = getPieceType(piece);
  const flags = getGameFlags(game);
  let capturedPiece = getPieceAt(game.board, to);
  let capturedPosition: Position | null = capturedPiece ? to : null;
  let isEnPassant = false;

  if (
    pieceType === "pawn"
    && flags.enPassantTarget
    && to === flags.enPassantTarget
    && !capturedPiece
    && from[0] !== to[0]
  ) {
    isEnPassant = true;
    const [toFile, toRank] = positionToCoords(to);
    const capturedRank = pieceOwner === "white" ? toRank - 1 : toRank + 1;
    capturedPosition = coordsToPosition(toFile, capturedRank);
    capturedPiece = getPieceAt(game.board, capturedPosition);
  }

  const isCastleKingside = (
    pieceType === "king"
    && ((from === "e1" && to === "g1") || (from === "e8" && to === "g8"))
  );

  const isCastleQueenside = (
    pieceType === "king"
    && ((from === "e1" && to === "c1") || (from === "e8" && to === "c8"))
  );

  // TODO: Handle promotion choice (currently always promotes to queen)
  let promotion: PieceType | null = null;
  if (pieceType === "pawn" && (to[1] === "8" || to[1] === "1")) {
    promotion = "queen";
  }

  const baseMove: Move = {
    from,
    to,
    piece,
    capturedPiece,
    capturedPosition,
    isCastleKingside,
    isCastleQueenside,
    isEnPassant,
    promotion,
    isCheck: false,
    isCheckmate: false,
  };

  const nextBoard = applyMoveToBoard(game.board, baseMove);
  const opponent = getOpponent(pieceOwner);
  const isCheck = isPlayerInCheckOnBoard(nextBoard, opponent);
  const nextGame: GameState = {
    board: nextBoard,
    moves: [...game.moves, baseMove],
  };

  let isCheckmate = false;
  if (evaluateCheckmate && isCheck) {
    isCheckmate = !hasAnyLegalMove(nextGame, opponent);
  }

  return {
    ...baseMove,
    isCheck,
    isCheckmate,
  };
};

const applyMoveToBoard = (board: Board, move: Move): Board => {
  const pieceOwner = getPieceOwner(move.piece);
  const newBoard = new Map(board);

  newBoard.set(move.from, null);

  if (move.isEnPassant && move.capturedPosition) {
    newBoard.set(move.capturedPosition, null);
  }

  if (move.isCastleKingside) {
    if (pieceOwner === "white") {
      newBoard.set("h1", null);
      newBoard.set("f1", "white rook");
    } else {
      newBoard.set("h8", null);
      newBoard.set("f8", "black rook");
    }
  }

  if (move.isCastleQueenside) {
    if (pieceOwner === "white") {
      newBoard.set("a1", null);
      newBoard.set("d1", "white rook");
    } else {
      newBoard.set("a8", null);
      newBoard.set("d8", "black rook");
    }
  }

  const movedPiece = move.promotion
    ? `${pieceOwner} ${move.promotion}` as Piece
    : move.piece;

  newBoard.set(move.to, movedPiece);
  return newBoard;
};

export const getLegalMovesForPosition = (game: GameState, position: Position): Position[] => {
  const piece = getPieceAt(game.board, position);
  if (!piece) return [];

  const owner = getPieceOwner(piece);
  const pseudoMoves = [
    ...getPossibleMoves(game.board, position),
    ...getSpecialMoves(game, position),
  ];

  return pseudoMoves.filter((to) => {
    const move = createMove(game, position, to, false);
    if (!move) return false;

    const nextBoard = applyMoveToBoard(game.board, move);
    return !isPlayerInCheckOnBoard(nextBoard, owner);
  });
};

export const makeMove = (game: GameState, from: Position, to: Position): GameState | null => {
  const legalMoves = getLegalMovesForPosition(game, from);
  if (!legalMoves.includes(to)) {
    return null;
  }

  const move = createMove(game, from, to);
  if (!move) {
    return null;
  }

  return {
    board: applyMoveToBoard(game.board, move),
    moves: [...game.moves, move],
  };
};

export const isPlayerInCheck = (game: GameState, player: Player): boolean => {
  return isPlayerInCheckOnBoard(game.board, player);
};

export const hasAnyLegalMove = (game: GameState, player: Player): boolean => {
  for (const position of positions) {
    const piece = getPieceAt(game.board, position);
    if (!piece || getPieceOwner(piece) !== player) {
      continue;
    }

    const legalMoves = getLegalMovesForPosition(game, position);
    if (legalMoves.length > 0) {
      return true;
    }
  }

  return false;
};

export const isCheckmate = (game: GameState, player: Player): boolean => {
  return isPlayerInCheck(game, player) && !hasAnyLegalMove(game, player);
};

// Helper functions

const getLinearMoves = (board: Board, position: Position, directions: [number, number][]): Position[] => {
  const [file, rank] = positionToCoords(position);
  const piece = getPieceAt(board, position);
  if (!piece) return [];
  const pieceOwner = getPieceOwner(piece);
  const moves: Position[] = [];
  for (const [fileDir, rankDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newFile = file + fileDir * i;
      const newRank = rank + rankDir * i;
      if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
        const pos = coordsToPosition(newFile, newRank);
        if (isPositionEmpty(board, pos)) {
          moves.push(pos);
        }
        else {
          if (getPieceOwner(board.get(pos)!) !== pieceOwner) {
            moves.push(pos);
          }
          break;
        }
      } else {
        break;
      }
    }
  }
  return moves;
};

const getSingleMoves = (board: Board, position: Position, moveOffsets: [number, number][]): Position[] => {
  const [file, rank] = positionToCoords(position);
  const piece = getPieceAt(board, position);
  if (!piece) return [];
  const pieceOwner = getPieceOwner(piece);
  const validMoves: Position[] = [];
  for (const [fileDir, rankDir] of moveOffsets) {
    const newFile = file + fileDir;
    const newRank = rank + rankDir;
    if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
      const pos = coordsToPosition(newFile, newRank);
      if (isPositionEmpty(board, pos) || getPieceOwner(board.get(pos)!) !== pieceOwner) {
        validMoves.push(pos);
      }
    }
  }
  return validMoves;
};

export const formatMove = (move: Move): string => {
  const pieceType = getPieceType(move.piece);
  const isCapture = !!move.capturedPiece;
  const checkChar = move.isCheckmate ? "#" : move.isCheck ? "+" : "";
  const promotionChar = move.promotion ? `=${move.promotion[0].toUpperCase()}` : "";

  if (move.isCastleKingside) {
    return `O-O${checkChar}`;
  }

  if (move.isCastleQueenside) {
    return `O-O-O${checkChar}`;
  }

  const pieceChar = pieceType !== "pawn" ? pieceType[0].toUpperCase()
    : (isCapture ? move.from[0].toLowerCase() : "");
  const captureChar = isCapture ? "x" : "";
  
  return `${pieceChar}${captureChar}${move.to}${promotionChar}${checkChar}`;
};