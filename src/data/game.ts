import {
  type Piece,
  type PieceType,
  type Player,
  getPieceInfo,
  getPieceOwner,
  getPieceType,
} from "@/data/piece";
import {
  type Board,
  type Square,
  SQUARES,
  coordsToSquare,
  getPieceAt,
  isSquareEmpty,
  squareToCoords,
} from "@/data/square";

export type { Piece, PieceOwner, PieceType, Player } from "@/data/piece";
export { PIECE_TYPES } from "@/data/piece";
export { getPieceInfo, getPieceOwner, getPieceType } from "@/data/piece";
export type { Board, Square, SquareColor } from "@/data/square";
export {
  FILES,
  RANKS,
  SQUARES,
  coordsToSquare,
  getPieceAt,
  initialBoard,
  isSquareEmpty,
  squareToCoords,
} from "@/data/square";

export interface GameState {
  board: Board;
  moves: Move[];
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  capturedPiece: Piece | null;
  capturedPosition: Square | null;
  isCastleKingside: boolean;
  isCastleQueenside: boolean;
  isEnPassant: boolean;
  promotion: PieceType | null;
  isCheck: boolean;
  isCheckmate: boolean;
}

const getOpponent = (player: Player): Player => {
  return player === "white" ? "black" : "white";
};

export const getCurrentPlayer = (moves: Move[]): Player => {
  return moves.length % 2 === 0 ? "white" : "black";
};

export const getEnPassantTarget = (game: GameState): Square | null => {
  const lastMove = game.moves.at(-1);
  if (!lastMove || getPieceType(lastMove.piece) !== "pawn") {
    return null;
  }

  const [, fromRank] = squareToCoords(lastMove.from);
  const [, toRank] = squareToCoords(lastMove.to);
  if (Math.abs(toRank - fromRank) !== 2) {
    return null;
  }

  const [file] = squareToCoords(lastMove.from);
  const middleRank = (fromRank + toRank) / 2;
  return coordsToSquare(file, middleRank);
};

export const canCastleKingside = (game: GameState, player: Player): boolean => {
  const kingPiece = `${player} king` as Piece;
  const rookPiece = `${player} rook` as Piece;
  const rookStart = player === "white" ? "h1" : "h8";

  return !game.moves.some((move) => {
    if (move.piece === kingPiece) {
      return true;
    }

    if (move.piece === rookPiece && move.from === rookStart) {
      return true;
    }

    return move.capturedPiece === rookPiece && move.capturedPosition === rookStart;
  });
};

export const canCastleQueenside = (game: GameState, player: Player): boolean => {
  const kingPiece = `${player} king` as Piece;
  const rookPiece = `${player} rook` as Piece;
  const rookStart = player === "white" ? "a1" : "a8";

  return !game.moves.some((move) => {
    if (move.piece === kingPiece) {
      return true;
    }

    if (move.piece === rookPiece && move.from === rookStart) {
      return true;
    }

    return move.capturedPiece === rookPiece && move.capturedPosition === rookStart;
  });
};


const isKingMoveSafe = (board: Board, from: Square, to: Square, owner: Player): boolean => {
  const piece = getPieceAt(board, from);
  if (!piece) {
    return false;
  }

  const nextBoard = new Map(board);
  nextBoard.set(from, null);
  nextBoard.set(to, piece);

  return !isSquareAttacked(nextBoard, to, getOpponent(owner));
};

const getPossiblePawnMoves = (game: GameState, square: Square, pieceOwner: Player): Square[] => {
  const board = game.board;
  const [file, rank] = squareToCoords(square);
  const moves: Square[] = [];
  const enPassantTarget = getEnPassantTarget(game);

  if (pieceOwner === "white") {
    if (rank < 7) {
      const forwardPos = coordsToSquare(file, rank + 1);
      if (isSquareEmpty(board, forwardPos)) {
        moves.push(forwardPos);
        if (rank === 1) {
          const doubleForwardPos = coordsToSquare(file, rank + 2);
          if (isSquareEmpty(board, doubleForwardPos)) {
            moves.push(doubleForwardPos);
          }
        }
      }

      if (file > 0) {
        const captureLeftPos = coordsToSquare(file - 1, rank + 1);
        const captureLeftPiece = getPieceAt(board, captureLeftPos);
        if (captureLeftPiece && getPieceOwner(captureLeftPiece) === "black") {
          moves.push(captureLeftPos);
        }
      }

      if (file < 7) {
        const captureRightPos = coordsToSquare(file + 1, rank + 1);
        const captureRightPiece = getPieceAt(board, captureRightPos);
        if (captureRightPiece && getPieceOwner(captureRightPiece) === "black") {
          moves.push(captureRightPos);
        }
      }
    }
  } else {
    if (rank > 0) {
      const forwardPos = coordsToSquare(file, rank - 1);
      if (isSquareEmpty(board, forwardPos)) {
        moves.push(forwardPos);
        if (rank === 6) {
          const doubleForwardPos = coordsToSquare(file, rank - 2);
          if (isSquareEmpty(board, doubleForwardPos)) {
            moves.push(doubleForwardPos);
          }
        }
      }

      if (file > 0) {
        const captureLeftPos = coordsToSquare(file - 1, rank - 1);
        const captureLeftPiece = getPieceAt(board, captureLeftPos);
        if (captureLeftPiece && getPieceOwner(captureLeftPiece) === "white") {
          moves.push(captureLeftPos);
        }
      }

      if (file < 7) {
        const captureRightPos = coordsToSquare(file + 1, rank - 1);
        const captureRightPiece = getPieceAt(board, captureRightPos);
        if (captureRightPiece && getPieceOwner(captureRightPiece) === "white") {
          moves.push(captureRightPos);
        }
      }
    }
  }

  if (enPassantTarget) {
    const [targetFile, targetRank] = squareToCoords(enPassantTarget);
    const forward = pieceOwner === "white" ? 1 : -1;
    if (targetRank === rank + forward && Math.abs(targetFile - file) === 1) {
      moves.push(enPassantTarget);
    }
  }

  return moves;
};

const getPossibleRookMoves = (board: Board, square: Square): Square[] => {
  const rookDirections: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  return getLinearMoves(board, square, rookDirections);
};

const getPossibleKnightMoves = (board: Board, square: Square): Square[] => {
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

  return getSingleMoves(board, square, knightMoves);
};

const getPossibleBishopMoves = (board: Board, square: Square): Square[] => {
  const bishopDirections: [number, number][] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  return getLinearMoves(board, square, bishopDirections);
};

const getPossibleQueenMoves = (board: Board, square: Square): Square[] => {
  const queenDirections: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  return getLinearMoves(board, square, queenDirections);
};

const getPossibleKingMoves = (game: GameState, square: Square, pieceOwner: Player): Square[] => {
  const board = game.board;
  const canKingsideCastle = canCastleKingside(game, pieceOwner);
  const canQueensideCastle = canCastleQueenside(game, pieceOwner);
  const opponent = getOpponent(pieceOwner);
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

  const safeKingMoves = getSingleMoves(board, square, kingMoves).filter((target) => {
    return isKingMoveSafe(board, square, target, pieceOwner);
  });

  if (pieceOwner === "white") {
    if (
      canKingsideCastle
      && getPieceAt(board, "e1") === "white king"
      && getPieceAt(board, "h1") === "white rook"
      && isSquareEmpty(board, "f1")
      && isSquareEmpty(board, "g1")
      && !isSquareAttacked(board, "e1", opponent)
      && !isSquareAttacked(board, "f1", opponent)
      && !isSquareAttacked(board, "g1", opponent)
    ) {
      safeKingMoves.push("g1");
    }

    if (
      canQueensideCastle
      && getPieceAt(board, "e1") === "white king"
      && getPieceAt(board, "a1") === "white rook"
      && isSquareEmpty(board, "d1")
      && isSquareEmpty(board, "c1")
      && isSquareEmpty(board, "b1")
      && !isSquareAttacked(board, "e1", opponent)
      && !isSquareAttacked(board, "d1", opponent)
      && !isSquareAttacked(board, "c1", opponent)
    ) {
      safeKingMoves.push("c1");
    }
  } else {
    if (
      canKingsideCastle
      && getPieceAt(board, "e8") === "black king"
      && getPieceAt(board, "h8") === "black rook"
      && isSquareEmpty(board, "f8")
      && isSquareEmpty(board, "g8")
      && !isSquareAttacked(board, "e8", opponent)
      && !isSquareAttacked(board, "f8", opponent)
      && !isSquareAttacked(board, "g8", opponent)
    ) {
      safeKingMoves.push("g8");
    }

    if (
      canQueensideCastle
      && getPieceAt(board, "e8") === "black king"
      && getPieceAt(board, "a8") === "black rook"
      && isSquareEmpty(board, "d8")
      && isSquareEmpty(board, "c8")
      && isSquareEmpty(board, "b8")
      && !isSquareAttacked(board, "e8", opponent)
      && !isSquareAttacked(board, "d8", opponent)
      && !isSquareAttacked(board, "c8", opponent)
    ) {
      safeKingMoves.push("c8");
    }
  }

  return safeKingMoves;
};

export const getPossibleMoves = (game: GameState, square: Square): Square[] => {
  const piece = getPieceAt(game.board, square);
  if (!piece) return [];

  const { pieceOwner, pieceType } = getPieceInfo(piece);

  switch (pieceType) {
    case "pawn":
      return getPossiblePawnMoves(game, square, pieceOwner);
    case "rook":
      return getPossibleRookMoves(game.board, square);
    case "knight":
      return getPossibleKnightMoves(game.board, square);
    case "bishop":
      return getPossibleBishopMoves(game.board, square);
    case "queen":
      return getPossibleQueenMoves(game.board, square);
    case "king":
      return getPossibleKingMoves(game, square, pieceOwner);
    default:
      throw new Error(`Unknown piece type: ${pieceType}`);
  }
};

const getAttackSquares = (board: Board, square: Square): Square[] => {
  const piece = getPieceAt(board, square);
  if (!piece) return [];

  const [file, rank] = squareToCoords(square);
  const { pieceOwner, pieceType } = getPieceInfo(piece);

  switch (pieceType) {
    case "pawn": {
      const dir = pieceOwner === "white" ? 1 : -1;
      const targets: Square[] = [];

      if (file > 0 && rank + dir >= 0 && rank + dir < 8) {
        targets.push(coordsToSquare(file - 1, rank + dir));
      }
      if (file < 7 && rank + dir >= 0 && rank + dir < 8) {
        targets.push(coordsToSquare(file + 1, rank + dir));
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
      const targets: Square[] = [];

      for (const [fileDir, rankDir] of knightMoves) {
        const newFile = file + fileDir;
        const newRank = rank + rankDir;
        if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
          targets.push(coordsToSquare(newFile, newRank));
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
      const targets: Square[] = [];

      for (const [fileDir, rankDir] of kingMoves) {
        const newFile = file + fileDir;
        const newRank = rank + rankDir;
        if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
          targets.push(coordsToSquare(newFile, newRank));
        }
      }

      return targets;
    }
    case "rook":
      return getLinearAttackSquares(board, square, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]);
    case "bishop":
      return getLinearAttackSquares(board, square, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
    case "queen":
      return getLinearAttackSquares(board, square, [
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

const getLinearAttackSquares = (board: Board, square: Square, directions: [number, number][]): Square[] => {
  const [file, rank] = squareToCoords(square);
  const targets: Square[] = [];

  for (const [fileDir, rankDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newFile = file + fileDir * i;
      const newRank = rank + rankDir * i;

      if (newFile < 0 || newFile > 7 || newRank < 0 || newRank > 7) {
        break;
      }

      const target = coordsToSquare(newFile, newRank);
      targets.push(target);

      if (!isSquareEmpty(board, target)) {
        break;
      }
    }
  }

  return targets;
};

const getKingPosition = (board: Board, player: Player): Square | null => {
  const king = `${player} king` as Piece;

  for (const square of SQUARES) {
    if (getPieceAt(board, square) === king) {
      return square;
    }
  }

  return null;
};

const isSquareAttacked = (board: Board, square: Square, attacker: Player): boolean => {
  for (const sourceSquare of SQUARES) {
    const piece = getPieceAt(board, sourceSquare);
    if (!piece || getPieceOwner(piece) !== attacker) {
      continue;
    }

    const attacked = getAttackSquares(board, sourceSquare);
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

export const createMove = (
  game: GameState,
  from: Square,
  to: Square,
  evaluateCheckmate: boolean = true,
): Move | null => {
  const piece = getPieceAt(game.board, from);
  if (!piece) return null;

  const pieceOwner = getPieceOwner(piece);
  const pieceType = getPieceType(piece);
  const enPassantTarget = getEnPassantTarget(game);
  let capturedPiece = getPieceAt(game.board, to);
  let capturedPosition: Square | null = capturedPiece ? to : null;
  let isEnPassant = false;

  if (
    pieceType === "pawn"
    && enPassantTarget
    && to === enPassantTarget
    && !capturedPiece
    && from[0] !== to[0]
  ) {
    isEnPassant = true;
    const [toFile, toRank] = squareToCoords(to);
    const capturedRank = pieceOwner === "white" ? toRank - 1 : toRank + 1;
    capturedPosition = coordsToSquare(toFile, capturedRank);
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

export const getLegalMovesForSquare = (game: GameState, square: Square): Square[] => {
  const piece = getPieceAt(game.board, square);
  if (!piece) return [];

  const owner = getPieceOwner(piece);
  const pseudoMoves = getPossibleMoves(game, square);

  return pseudoMoves.filter((to) => {
    const move = createMove(game, square, to, false);
    if (!move) return false;

    const nextBoard = applyMoveToBoard(game.board, move);
    return !isPlayerInCheckOnBoard(nextBoard, owner);
  });
};

export const makeMove = (game: GameState, move: Move): GameState => {
  return {
    board: applyMoveToBoard(game.board, move),
    moves: [...game.moves, move],
  };
};

export const isPlayerInCheck = (game: GameState, player: Player): boolean => {
  return isPlayerInCheckOnBoard(game.board, player);
};

export const hasAnyLegalMove = (game: GameState, player: Player): boolean => {
  for (const square of SQUARES) {
    const piece = getPieceAt(game.board, square);
    if (!piece || getPieceOwner(piece) !== player) {
      continue;
    }

    const legalMoves = getLegalMovesForSquare(game, square);
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

const getLinearMoves = (board: Board, square: Square, directions: [number, number][]): Square[] => {
  const [file, rank] = squareToCoords(square);
  const piece = getPieceAt(board, square);
  if (!piece) return [];
  const pieceOwner = getPieceOwner(piece);
  const moves: Square[] = [];
  for (const [fileDir, rankDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newFile = file + fileDir * i;
      const newRank = rank + rankDir * i;
      if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
        const pos = coordsToSquare(newFile, newRank);
        if (isSquareEmpty(board, pos)) {
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

const getSingleMoves = (board: Board, square: Square, moveOffsets: [number, number][]): Square[] => {
  const [file, rank] = squareToCoords(square);
  const piece = getPieceAt(board, square);
  if (!piece) return [];
  const pieceOwner = getPieceOwner(piece);
  const validMoves: Square[] = [];
  for (const [fileDir, rankDir] of moveOffsets) {
    const newFile = file + fileDir;
    const newRank = rank + rankDir;
    if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
      const pos = coordsToSquare(newFile, newRank);
      if (isSquareEmpty(board, pos) || getPieceOwner(board.get(pos)!) !== pieceOwner) {
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

  const PIECE_SYMBOLS: Record<PieceType, string> = {
    pawn: "",
    knight: "N",
    bishop: "B",
    rook: "R",
    queen: "Q",
    king: "K",
  };

  const pieceChar = pieceType !== "pawn" ? PIECE_SYMBOLS[pieceType] : (isCapture ? move.from[0].toLowerCase() : "");
  const captureChar = isCapture ? "x" : "";
  
  return `${pieceChar}${captureChar}${move.to}${promotionChar}${checkChar}`;
};

