import { useEffect, useState } from "react";

import { Chessboard } from "@/components/chessboard"
import { Movelist } from "@/components/movelist"
import { SidePanel } from "@/components/sidepanel"

import {
  Square,
} from "@/game/square";
import { Position } from "@/game/position";
import { Piece, PieceType } from "@/game/piece";
import { Player } from "@/game/player";

interface PendingPromotion {
  originSquare: Square;
  targetSquare: Square;
  player: Player;
}

function App() {
  const [game, setGame] = useState<Position>(Position.init());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);
  const [grabbedFromSquare, setGrabbedFromSquare] = useState<Square | null>(null);
  const [grabbedPiece, setGrabbedPiece] = useState<Piece | null>(null);
  const [grabbedPointer, setGrabbedPointer] = useState<{ x: number; y: number } | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [lastGrabEndedAt, setLastGrabEndedAt] = useState<number>(0);
  const [halfMoveIndex, setHalfMoveIndex] = useState<number>(0);

  const isCheckmate = game.moveHistory.at(halfMoveIndex - 1)?.isCheckmate ?? false;
  const isViewingPastMove = halfMoveIndex !== game.moveHistory.length;
  const isViewOnly = isViewingPastMove || isCheckmate;
  const viewedPosition = game.boardAt(halfMoveIndex);
  const capturedPieces = viewedPosition.capturedPieces();

  useEffect(() => {
    if (!pendingPromotion) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const clickedInsidePicker = !!target?.closest("[data-promotion-picker='true']");
      if (!clickedInsidePicker) {
        setPendingPromotion(null);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [pendingPromotion]);

  const isPromotionMove = (position: Position, originSquare: Square, targetSquare: Square): boolean => {
    const piece = position.board.pieceAt(originSquare);
    if (!piece || piece.type !== PieceType.PAWN) {
      return false;
    }

    const promotionRank = piece.owner.is(Player.WHITE) ? 7 : 0;
    return targetSquare.rank === promotionRank;
  };

  const applyMove = (originSquare: Square, targetSquare: Square, promotion: PieceType | null = null) => {
    setGame((prev) => prev.makeMove(prev.createMove(originSquare, targetSquare, promotion)));
    setHalfMoveIndex((prev) => prev + 1);
    setSelectedSquare(null);
    setHoveredSquare(null);
  };

  const squareAtPoint = (x: number, y: number): Square | null => {
    const element = document.elementFromPoint(x, y) as HTMLElement | null;
    const tileElement = element?.closest("[data-square]") as HTMLElement | null;
    const squareText = tileElement?.dataset.square;
    if (!squareText) {
      return null;
    }

    try {
      return Square.fromString(squareText);
    } catch {
      return null;
    }
  };

  const handleTileClick = (square: Square) => {
    if (isViewOnly) {
      return;
    }

    if (Date.now() - lastGrabEndedAt < 140) {
      return;
    }

    if (pendingPromotion) {
      return;
    }

    const currentPlayer = game.currentPlayerToMove();
    const piece = game.board.pieceAt(square);

    // If there is already a selected square...
    if (selectedSquare) {

      // If the clicked square is a legal move for the selected piece, make the move
      const legalMoves = game.getLegalMovesForSquare(selectedSquare);
      const move = legalMoves.find((candidate) => candidate === square);
      if (move) {
        if (isPromotionMove(game, selectedSquare, move)) {
          const movingPiece = game.board.pieceAt(selectedSquare);
          if (movingPiece) {
            setPendingPromotion({
              originSquare: selectedSquare,
              targetSquare: move,
              player: movingPiece.owner,
            });
            setSelectedSquare(null);
            setHoveredSquare(null);
            return;
          }
        }

        applyMove(selectedSquare, move);
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
    if (isViewOnly) {
      return;
    }

    if (pendingPromotion) {
      return;
    }

    // Don't update hover state if we're currently dragging a piece,
    // or if there is a selected square (hover only applies when no piece is selected)
    if (grabbedFromSquare) {
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

  const handleTileMouseDown = (square: Square, event: React.MouseEvent<HTMLDivElement>) => {
    if (isViewOnly) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    if (pendingPromotion) {
      return;
    }

    // Don't allow grabbing if the piece doesn't belong to the current player
    const piece = game.board.pieceAt(square);
    const currentPlayer = game.currentPlayerToMove();

    if (!piece || !piece.owner.is(currentPlayer)) {
      return;
    }

    event.preventDefault();

    setGrabbedFromSquare(square);
    setGrabbedPiece(piece);
    setGrabbedPointer({ x: event.clientX, y: event.clientY });
    setDragOverSquare(null);
    setSelectedSquare(square);
    setHoveredSquare(null);
  };

  useEffect(() => {
    if (!grabbedFromSquare) {
      return;
    }

    if (pendingPromotion) {
      setGrabbedFromSquare(null);
      setGrabbedPiece(null);
      setGrabbedPointer(null);
      setDragOverSquare(null);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setGrabbedPointer({ x: event.clientX, y: event.clientY });

      const hoveredSquare = squareAtPoint(event.clientX, event.clientY);
      if (!hoveredSquare) {
        setDragOverSquare(null);
        return;
      }

      const legalMoves = game.getLegalMovesForSquare(grabbedFromSquare);
      const legalTarget = legalMoves.find((candidate) => candidate === hoveredSquare) ?? null;
      setDragOverSquare(legalTarget);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      const from = grabbedFromSquare;
      const target = squareAtPoint(event.clientX, event.clientY);

      setGrabbedFromSquare(null);
      setGrabbedPiece(null);
      setGrabbedPointer(null);
      setDragOverSquare(null);
      setLastGrabEndedAt(Date.now());

      if (!target) {
        return;
      }

      const legalMoves = game.getLegalMovesForSquare(from);
      const move = legalMoves.find((candidate) => candidate === target);
      if (!move) {
        return;
      }

      if (isPromotionMove(game, from, move)) {
        const movingPiece = game.board.pieceAt(from);
        if (movingPiece) {
          setPendingPromotion({
            originSquare: from,
            targetSquare: move,
            player: movingPiece.owner,
          });
          setSelectedSquare(null);
          setHoveredSquare(null);
          return;
        }
      }

      applyMove(from, move);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [game, grabbedFromSquare, pendingPromotion]);

  const handlePromotionSelect = (promotion: PieceType) => {
    if (!pendingPromotion) {
      return;
    }

    applyMove(pendingPromotion.originSquare, pendingPromotion.targetSquare, promotion);
    setPendingPromotion(null);
  };

  const openResetConfirm = () => {
    if (game.moveHistory.length === 0) {
      return;
    }
    setIsResetConfirmOpen(true);
  };

  const closeResetConfirm = () => {
    setIsResetConfirmOpen(false);
  };

  const previewSquare = grabbedFromSquare ?? selectedSquare ?? hoveredSquare;
  const previewMoves = previewSquare
    ? game.getLegalMovesForSquare(previewSquare)
    : [];
  const previewPiece = previewSquare
    ? game.board.pieceAt(previewSquare)
    : null;
  const lastMove = viewedPosition.moveHistory.at(-1) ?? null;
  const lastMoveSquares = lastMove
    ? [lastMove.originSquare, lastMove.targetSquare] as [Square, Square]
    : null;
  const checkmateMove = lastMove?.isCheckmate ? lastMove : null;
  const victoryKingSquare = checkmateMove
    ? viewedPosition.findKingSquare(checkmateMove.piece.owner)
    : null;
  const defeatKingSquare = checkmateMove
    ? viewedPosition.findKingSquare(checkmateMove.piece.owner.opponent())
    : null;

  const resetGame = () => {
    setGame(Position.init());
    setHalfMoveIndex(0);
    setSelectedSquare(null);
    setHoveredSquare(null);
    setGrabbedFromSquare(null);
    setGrabbedPiece(null);
    setGrabbedPointer(null);
    setDragOverSquare(null);
    setPendingPromotion(null);
    setIsResetConfirmOpen(false);
  };

  const goToStart = () => {
    setHalfMoveIndex(0);
    setSelectedSquare(null);
    setHoveredSquare(null);
  };

  const goBackOneMove = () => {
    setHalfMoveIndex((prev) => Math.max(prev - 1, 0));
    setSelectedSquare(null);
    setHoveredSquare(null);
  };

  const goForwardOneMove = () => {
    setHalfMoveIndex((prev) => Math.min(prev + 1, game.moveHistory.length));
    setSelectedSquare(null);
    setHoveredSquare(null);
  };

  const goToEnd = () => {
    setHalfMoveIndex(game.moveHistory.length);
    setSelectedSquare(null);
    setHoveredSquare(null);
  };

  return (
    <div className="flex justify-center items-center w-100vw h-100vh gap-5 my-15">
      <SidePanel capturedPieces={capturedPieces} />
      <Chessboard
        board={viewedPosition.board}
        viewOnly={isViewOnly}
        currentPlayer={viewedPosition.currentPlayerToMove()}
        onTileClick={handleTileClick}
        onTileHover={handleTileHover}
        onTileMouseDown={handleTileMouseDown}
        dragOverSquare={dragOverSquare}
        draggedFromSquare={grabbedFromSquare}
        grabbedPiece={grabbedPiece}
        grabbedPointer={grabbedPointer}
        selectedSquare={previewSquare}
        legalMoves={previewMoves}
        lastMoveSquares={lastMoveSquares}
        previewPiece={previewPiece}
        promotionSquare={pendingPromotion?.targetSquare ?? null}
        promotionPlayer={pendingPromotion?.player ?? null}
        victoryKingSquare={victoryKingSquare}
        defeatKingSquare={defeatKingSquare}
        onPromotionSelect={handlePromotionSelect}
        onPromotionCancel={() => setPendingPromotion(null)}
      />
      <Movelist
        moves={game.moveHistory}
        currentMoveIndex={halfMoveIndex}
        resetGame={openResetConfirm}
        goToStart={goToStart}
        goBackOneMove={goBackOneMove}
        goForwardOneMove={goForwardOneMove}
        goToEnd={goToEnd}
      />
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4" role="dialog" aria-modal="true" aria-labelledby="reset-confirm-title">
          <div className="w-full max-w-md rounded-md border border-zinc-300 bg-zinc-50 p-5 shadow-lg">
            <h2 id="reset-confirm-title" className="text-lg font-semibold text-zinc-900">
              Reset position?
            </h2>
            <p className="mt-2 text-sm text-zinc-700">
              This will clear the current game and move history. Do you want to continue?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeResetConfirm}
                className="inline-flex cursor-pointer items-center justify-center rounded-md bg-zinc-200 px-4 py-2 font-medium text-zinc-800 transition-colors duration-150 hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={resetGame}
                className="inline-flex cursor-pointer items-center justify-center rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
