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
  createMove,
  makeMove,
} from "@/data/game";

function App() {
  const [game, setGame] = useState<GameState>({
    board: initialBoard,
    moves: [],
  });
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);
  const [draggedFromSquare, setDraggedFromSquare] = useState<Square | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);

  const handleTileClick = (square: Square) => {
    const currentPlayer = getCurrentPlayer(game.moves);
    const piece = getPieceAt(game.board, square);

    // If there is already a selected square...
    if (selectedSquare) {

      // If the clicked square is a legal move for the selected piece, make the move
      const legalMoves = getLegalMovesForSquare(game, selectedSquare);
      if (legalMoves.includes(square)) {
        const move = createMove(game, selectedSquare, square);
        if (move) {
          setGame((prev) => makeMove(prev, move));
          setSelectedSquare(null);
          setHoveredSquare(null);
          return;
        }
      }

      // Otherwise, if the clicked square has a piece belonging to the current player, select it instead
      if (piece && getPieceOwner(piece) === currentPlayer) {
        setSelectedSquare(square);
        setHoveredSquare(null);
        return;
      }

      // If neither of the above, just deselect
      setSelectedSquare(null);
      setHoveredSquare(null);
      return;
    }

    // If there is no selected square, and the clicked square has a piece belonging to the current player, select it
    if (piece && getPieceOwner(piece) === currentPlayer) {
      setSelectedSquare(square);
      setHoveredSquare(null);
    }

    // If there is no selected square, and the clicked square doesn't have a piece belonging to the current player, do nothing

  };

  const handleTileHover = (square: Square | null) => {
    // Don't update hover state if we're currently dragging a piece,
    // or if there is a selected square (hover only applies when no piece is selected)
    if (draggedFromSquare) {
      return;
    }

    // Don't update hover state if there is a selected square
    // (hover only applies when no piece is selected)
    if (selectedSquare) {
      return;
    }

    // If we're not hovering over a square, clear the hover state
    if (!square) {
      setHoveredSquare(null);
      return;
    }

    // If we're hovering over a square that has a piece belonging to the current player, set the hover state to that square.
    const currentPlayer = getCurrentPlayer(game.moves);
    const piece = getPieceAt(game.board, square);

    if (piece && getPieceOwner(piece) === currentPlayer) {
      setHoveredSquare(square);
      return;
    }

    // If we're hovering over a square that doesn't have a piece belonging to the current player, clear the hover state
    setHoveredSquare(null);
  };

  const handlePieceDragStart = (square: Square, event: React.DragEvent<HTMLImageElement>) => {
    // Don't allow dragging if the piece doesn't belong to the current player
    const piece = getPieceAt(game.board, square);
    const currentPlayer = getCurrentPlayer(game.moves);

    if (!piece || getPieceOwner(piece) !== currentPlayer) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", square);
    setDraggedFromSquare(square);
    setDragOverSquare(null);
    setSelectedSquare(square);
    setHoveredSquare(null);
  };

  const handlePieceDragEnd = () => {
    setDraggedFromSquare(null);
    setDragOverSquare(null);
  };

  const handleTileDragOver = (square: Square, event: React.DragEvent<HTMLDivElement>) => {
    // If we're not currently dragging a piece, do nothing
    if (!draggedFromSquare) {
      return;
    }

    // If the dragged piece can be legally moved to the hovered square, allow the drop and set the drag over state to that square
    const legalMoves = getLegalMovesForSquare(game, draggedFromSquare);
    if (legalMoves.includes(square)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setDragOverSquare(square);
      return;
    }

    // If the dragged piece cannot be legally moved to the hovered square, clear the drag over state
    setDragOverSquare(null);
  };

  const handleTileDrop = (square: Square, event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!draggedFromSquare) {
      return;
    }

    const from = draggedFromSquare;
    setDraggedFromSquare(null);
    setDragOverSquare(null);

    const legalMoves = getLegalMovesForSquare(game, from);
    if (legalMoves.includes(square)) {
      const move = createMove(game, from, square);
      if (move) {
        setGame((prev) => makeMove(prev, move));
        setSelectedSquare(null);
        setHoveredSquare(null);
        return;
      }
    }
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
        onPieceDragStart={handlePieceDragStart}
        onPieceDragEnd={handlePieceDragEnd}
        onTileDragOver={handleTileDragOver}
        onTileDrop={handleTileDrop}
        dragOverSquare={dragOverSquare}
        selectedSquare={previewSquare}
        legalMoves={previewMoves}
        previewPiece={previewPiece}
      />
      <Movelist moves={game.moves} />
    </div>
  )
}

export default App
