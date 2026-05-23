import { useState } from "react";

import { Chessboard } from "@/components/chessboard"
import { Movelist } from "@/components/movelist"

import {
  type GameState,
  type Square,
  initialBoard,
  getPieceAt,
  getPieceOwner,
  getCurrentPlayer,
  getLegalMovesForSquare,
  makeMove,
} from "@/data/game";

function App() {
  const [game, setGame] = useState<GameState>({
    board: initialBoard,
    moves: [],
  });
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);

  const handleTileClick = (square: Square) => {
    const currentPlayer = getCurrentPlayer(game.moves);
    const piece = getPieceAt(game.board, square);

    if (selectedSquare) {
      const possibleMoves = getLegalMovesForSquare(game, selectedSquare);
      if (possibleMoves.includes(square)) {
        setGame((prev) => makeMove(prev, selectedSquare, square) ?? prev);
        setSelectedSquare(null);
        return;
      }

      if (piece && getPieceOwner(piece) === currentPlayer) {
        setSelectedSquare(square);
        return;
      }

      setSelectedSquare(null);
      return;
    }

    if (piece && getPieceOwner(piece) === currentPlayer) {
      setSelectedSquare(square);
    }
  };

  const handleTileHover = (square: Square | null) => {
    if (selectedSquare) {
      return;
    }

    if (!square) {
      setHoveredSquare(null);
      return;
    }

    const currentPlayer = getCurrentPlayer(game.moves);
    const piece = getPieceAt(game.board, square);

    if (piece && getPieceOwner(piece) === currentPlayer) {
      setHoveredSquare(square);
      return;
    }

    setHoveredSquare(null);
  };

  const previewSquare = selectedSquare ?? hoveredSquare;
  const previewMoves = previewSquare
    ? getLegalMovesForSquare(game, previewSquare)
    : [];
  const previewPiece = previewSquare
    ? getPieceAt(game.board, previewSquare)
    : null;

  return (
    <div className="flex h-128 justify-center items-start gap-5 my-20">
      <Chessboard
        board={game.board}
        onTileClick={handleTileClick}
        onTileHover={handleTileHover}
        selectedSquare={previewSquare}
        legalMoves={previewMoves}
        previewPiece={previewPiece}
      />
      <Movelist moves={game.moves} />
    </div>
  )
}

export default App
