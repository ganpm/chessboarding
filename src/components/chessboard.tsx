
import { Tile } from "@/components/tile";
import { PromotionPicker } from "@/components/promotion-picker";
import {
  type SquareColor,
  Square,
} from "@/game/square";
import { Board } from "@/game/board";
import { Piece, PieceType } from "@/game/piece";
import { Player } from "@/game/player";

interface ChessboardProps extends React.HTMLAttributes<HTMLDivElement> {
  board: Board;
  onTileClick: (square: Square) => void;
  onTileHover: (square: Square | null) => void;
  onPieceDragStart: (square: Square, event: React.DragEvent<HTMLImageElement>) => void;
  onPieceDragEnd: () => void;
  onTileDragOver: (square: Square, event: React.DragEvent<HTMLDivElement>) => void;
  onTileDrop: (square: Square, event: React.DragEvent<HTMLDivElement>) => void;
  dragOverSquare: Square | null;
  selectedSquare: Square | null;
  legalMoves: Square[];
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
  onTileClick,
  onTileHover,
  onPieceDragStart,
  onPieceDragEnd,
  onTileDragOver,
  onTileDrop,
  dragOverSquare,
  selectedSquare,
  legalMoves,
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
          const isSelected = selectedSquare === square;
          const isLegalMove = legalMoves.includes(square);
          const isCaptureTarget = isLegalMove && !!piece;
          const isDragOver = dragOverSquare === square;

          return (
            <Tile
              key={square.toString()}
              color={indexColor(index)}
              piece={piece}
              selected={isSelected}
              legalMove={isLegalMove}
              captureTarget={isCaptureTarget}
              dragOver={isDragOver}
              ghostPiece={isLegalMove ? previewPiece : null}
              onClick={() => onTileClick(square)}
              onMouseEnter={() => onTileHover(square)}
              onMouseLeave={() => onTileHover(null)}
              onDragOver={(event) => onTileDragOver(square, event)}
              onDrop={(event) => onTileDrop(square, event)}
              onPieceDragStart={(event) => onPieceDragStart(square, event)}
              onPieceDragEnd={onPieceDragEnd}
            />
          );
        })}
      </div>
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