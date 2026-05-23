
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

        return (
          <Tile
            key={square}
            color={indexColor(index)}
            piece={piece}
            selected={isSelected}
            legalMove={isLegalMove}
            captureTarget={isCaptureTarget}
            ghostPiece={isLegalMove ? previewPiece : null}
            onClick={() => onTileClick(square)}
            onMouseEnter={() => onTileHover(square)}
            onMouseLeave={() => onTileHover(null)}
          />
        );
      })}
    </div>
  );
};