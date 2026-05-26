
import { Tile } from "@/components/tile";
import {
  type SquareColor,
  type Board,
  type Square,
  SQUARES,
} from "@/data/square";
import {
  type Piece,
} from "@/data/piece";

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
  ...props
}: ChessboardProps) => {
  return (
    <div className="grid grid-flow-col grid-cols-8 grid-rows-8 gap-0 shadow-md" {...props}>
      {SQUARES.map((square, index) => {
        const piece = board.get(square) || null;
        const isSelected = selectedSquare === square;
        const isLegalMove = legalMoves.includes(square);
        const isCaptureTarget = isLegalMove && !!piece;
        const isDragOver = dragOverSquare === square;

        return (
          <Tile
            key={square}
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
  );
};