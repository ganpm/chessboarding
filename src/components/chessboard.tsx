
import { Square } from "@/components/square";
import {
  type SquareColor,
  type Board,
  type Piece,
  type Position,
  positions,
} from "@/data/game";

interface ChessboardProps extends React.HTMLAttributes<HTMLDivElement> {
  board: Board;
  onSquareClick: (position: Position) => void;
  onSquareHover: (position: Position | null) => void;
  selectedPosition: Position | null;
  legalMoves: Position[];
  previewPiece: Piece | null;
}

const indexColor = (index: number): SquareColor => {
  const row = Math.floor(index / 8);
  const col = index % 8;
  return (row + col) % 2 === 0 ? "light" : "dark";
};

export const Chessboard = ({
  board,
  onSquareClick,
  onSquareHover,
  selectedPosition,
  legalMoves,
  previewPiece,
  ...props
}: ChessboardProps) => {
  return (
    <div className="grid grid-flow-col grid-cols-8 grid-rows-8 gap-0 shadow-md" {...props}>
      {positions.map((position, index) => {
        const piece = board.get(position) || null;
        const isSelected = selectedPosition === position;
        const isLegalMove = legalMoves.includes(position);
        const isCaptureTarget = isLegalMove && !!piece;

        return (
          <Square
            key={position}
            color={indexColor(index)}
            piece={piece}
            selected={isSelected}
            legalMove={isLegalMove}
            captureTarget={isCaptureTarget}
            ghostPiece={isLegalMove ? previewPiece : null}
            onClick={() => onSquareClick(position)}
            onMouseEnter={() => onSquareHover(position)}
            onMouseLeave={() => onSquareHover(null)}
          />
        );
      })}
    </div>
  );
};