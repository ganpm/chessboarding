import { useState } from "react";

import { Chessboard } from "@/components/chessboard"
import { Movelist } from "@/components/movelist"

import {
  type GameState,
  type Position,
  initialBoard,
  getPieceAt,
  getPieceOwner,
  getCurrentPlayer,
  getLegalMovesForPosition,
  makeMove,
} from "@/data/game";

function App() {
  const [game, setGame] = useState<GameState>({
    board: initialBoard,
    moves: [],
  });
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  const handleSquareClick = (position: Position) => {
    const currentPlayer = getCurrentPlayer(game.moves);
    const piece = getPieceAt(game.board, position);

    if (selectedPosition) {
      const possibleMoves = getLegalMovesForPosition(game, selectedPosition);
      if (possibleMoves.includes(position)) {
        setGame((prev) => makeMove(prev, selectedPosition, position) ?? prev);
        setSelectedPosition(null);
        return;
      }

      if (piece && getPieceOwner(piece) === currentPlayer) {
        setSelectedPosition(position);
        return;
      }

      setSelectedPosition(null);
      return;
    }

    if (piece && getPieceOwner(piece) === currentPlayer) {
      setSelectedPosition(position);
    }
  };

  const handleSquareHover = (position: Position | null) => {
    if (selectedPosition) {
      return;
    }

    if (!position) {
      setHoveredPosition(null);
      return;
    }

    const currentPlayer = getCurrentPlayer(game.moves);
    const piece = getPieceAt(game.board, position);

    if (piece && getPieceOwner(piece) === currentPlayer) {
      setHoveredPosition(position);
      return;
    }

    setHoveredPosition(null);
  };

  const previewPosition = selectedPosition ?? hoveredPosition;
  const previewMoves = previewPosition
    ? getLegalMovesForPosition(game, previewPosition)
    : [];
  const previewPiece = previewPosition
    ? getPieceAt(game.board, previewPosition)
    : null;

  return (
    <div className="flex h-128 justify-center items-start gap-5 my-20">
      <Chessboard
        board={game.board}
        onSquareClick={handleSquareClick}
        onSquareHover={handleSquareHover}
        selectedPosition={previewPosition}
        legalMoves={previewMoves}
        previewPiece={previewPiece}
      />
      <Movelist moves={game.moves} />
    </div>
  )
}

export default App
