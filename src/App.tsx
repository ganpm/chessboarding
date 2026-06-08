import { useState } from "react";

import { Chessboard } from "@/components/chessboard"
import { Movelist } from "@/components/movelist"

import {
  Square,
} from "@/game/square";
import { Position } from "@/game/position";

function App() {
  const [game, setGame] = useState<Position>(Position.init());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);
  const [draggedFromSquare, setDraggedFromSquare] = useState<Square | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);

  const handleTileClick = (square: Square) => {
    const currentPlayer = game.currentPlayerToMove();
    const piece = game.board.pieceAt(square);

    // If there is already a selected square...
    if (selectedSquare) {

      // If the clicked square is a legal move for the selected piece, make the move
      const legalMoves = game.getLegalMovesForSquare(selectedSquare);
      const move = legalMoves.find((candidate) => candidate === square);
      if (move) {
        // TODO: PROMOTION
        setGame((prev) => prev.makeMove(prev.createMove(selectedSquare, move)));
        setSelectedSquare(null);
        setHoveredSquare(null);
        return;
      }

      // Otherwise, if the clicked square has a piece belonging to the current player, select it instead
      if (piece && piece.owner.is(currentPlayer)) {
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
    if (piece && piece.owner.is(currentPlayer)) {
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
      setSelectedSquare(null);
      setHoveredSquare(null);
      return;
    }

    // If we're hovering over a square that has a piece belonging to the current player, set the hover state to that square.
    const currentPlayer = game.currentPlayerToMove();
    const piece = game.board.pieceAt(square);

    if (piece && piece.owner.is(currentPlayer)) {
      setHoveredSquare(square);
      return;
    }

    // If we're hovering over a square that doesn't have a piece belonging to the current player, clear the hover state
    setHoveredSquare(null);
  };

  const handlePieceDragStart = (square: Square, event: React.DragEvent<HTMLImageElement>) => {
    // Don't allow dragging if the piece doesn't belong to the current player
    const piece = game.board.pieceAt(square);
    const currentPlayer = game.currentPlayerToMove();

    if (!piece || !piece.owner.is(currentPlayer)) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", square.toString());
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
    const legalMoves = game.getLegalMovesForSquare(draggedFromSquare);
    if (legalMoves.some((move) => move === square)) {
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

    const legalMoves = game.getLegalMovesForSquare(from);
    const move = legalMoves.find((candidate) => candidate === square);
    if (move) {
      // TODO: PROMOTION
      setGame((prev) => prev.makeMove(prev.createMove(from, move)));
      setSelectedSquare(null);
      setHoveredSquare(null);
      return;
    }
  };

  const previewSquare = selectedSquare ?? hoveredSquare;
  const previewMoves = previewSquare
    ? game.getLegalMovesForSquare(previewSquare)
    : [];
  const previewPiece = previewSquare
    ? game.board.pieceAt(previewSquare)
    : null;

  return (
    <div className="flex h-128 justify-center items-start gap-5 my-15">
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
      <Movelist moves={game.moveHistory} />
    </div>
  )
}

export default App
