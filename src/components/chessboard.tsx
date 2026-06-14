
import { Tile } from "@/components/tile";
import { PromotionPicker } from "@/components/promotion-picker";
import {
  type SquareColor,
  Square,
} from "@/game/square";
import { Board } from "@/game/board";
import { Piece, PieceType } from "@/game/piece";
import { Player } from "@/game/player";
import { assets } from "@/game/assets";

interface ChessboardProps extends React.HTMLAttributes<HTMLDivElement> {
  board: Board;
  currentPlayer: Player;
  viewOnly: boolean;
  onTileClick: (square: Square) => void;
  onTileHover: (square: Square | null) => void;
  onTileMouseDown: (square: Square, event: React.MouseEvent<HTMLDivElement>) => void;
  dragOverSquare: Square | null;
  draggedFromSquare: Square | null;
  grabbedPiece: Piece | null;
  grabbedPointer: { x: number; y: number } | null;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMoveSquares: [Square, Square] | null;
  previewPiece: Piece | null;
  promotionSquare: Square | null;
  promotionPlayer: Player | null;
  onPromotionSelect: (pieceType: PieceType) => void;
  onPromotionCancel: () => void;
}

const indexColor = (index: number): SquareColor => {
  const row = Math.floor(index / 8);
  const col = index % 8;
  return (row + col) % 2 === 0 ? "light" : "dark";
};

export const Chessboard = ({
  board,
  currentPlayer,
  viewOnly,
  onTileClick,
  onTileHover,
  onTileMouseDown,
  dragOverSquare,
  draggedFromSquare,
  grabbedPiece,
  grabbedPointer,
  selectedSquare,
  legalMoves,
  lastMoveSquares,
  previewPiece,
  promotionSquare,
  promotionPlayer,
  onPromotionSelect,
  onPromotionCancel,
  ...props
}: ChessboardProps) => {
  return (
    <div className="relative" {...props}>
      <div className="grid grid-flow-row grid-cols-8 grid-rows-8 gap-0 shadow-md">
        {Square.whitePerspective.map((square, index) => {
          const piece = board.pieceAt(square);
          const canGrabPiece = !viewOnly && !!piece && piece.owner.is(currentPlayer);
          const isSelected = selectedSquare === square;
          const isLegalMove = legalMoves.includes(square);
          const isCaptureTarget = isLegalMove && !!piece;
          const isDragOver = dragOverSquare === square;
          const isLastMoveSquare =
            !!lastMoveSquares &&
            (lastMoveSquares[0] === square || lastMoveSquares[1] === square);

          return (
            <Tile
              key={square.toString()}
              data-square={square.toString()}
              color={indexColor(index)}
              piece={piece}
              isGrabbing={!viewOnly && !!grabbedPiece}
              canGrabPiece={canGrabPiece}
              hidePiece={draggedFromSquare === square}
              selected={isSelected}
              legalMove={isLegalMove}
              captureTarget={isCaptureTarget}
              dragOver={isDragOver}
              lastMove={isLastMoveSquare}
              ghostPiece={isLegalMove ? previewPiece : null}
              onClick={() => onTileClick(square)}
              onMouseDown={(event) => onTileMouseDown(square, event)}
              onMouseEnter={() => onTileHover(square)}
              onMouseLeave={() => onTileHover(null)}
            />
          );
        })}
      </div>
      {grabbedPiece && grabbedPointer && (
        <img
          src={assets[grabbedPiece.toString()]}
          style={{
            imageRendering: "crisp-edges",
            left: `${grabbedPointer.x}px`,
            top: `${grabbedPointer.y}px`,
            transform: "translate(-50%, -50%)",
          }}
          className="pointer-events-none fixed z-50 h-25 w-25 select-none"
          alt={grabbedPiece.toString()}
          draggable={false}
        />
      )}
      {promotionSquare && promotionPlayer && (
        <PromotionPicker
          square={promotionSquare}
          player={promotionPlayer}
          onSelect={onPromotionSelect}
          onCancel={onPromotionCancel}
        />
      )}
    </div>
  );
};