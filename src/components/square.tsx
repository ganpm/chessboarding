import {
  type SquareColor,
  type Piece,
} from "@/data/game";
import { assets } from "@/data/assets";

interface SquareProps extends React.HTMLAttributes<HTMLDivElement> {
  color: SquareColor;
  piece: Piece | null;
  selected?: boolean;
  legalMove?: boolean;
  captureTarget?: boolean;
}

export const Square = ({
  color,
  piece,
  selected = false,
  legalMove = false,
  captureTarget = false,
  ...props
}: SquareProps) => {
  const bg = {
    black: "bg-[#B58863]",
    white: "bg-[#F0D9B5]",
  }
  return (
    <div
      className={`relative w-16 h-16 ${bg[color]} ${selected ? "ring-4 ring-inset ring-yellow-400" : ""}`}
      {...props}
    >
      {legalMove && !piece && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-emerald-700/75" />
        </span>
      )}

      {legalMove && captureTarget && (
        <span className="pointer-events-none absolute inset-1 rounded-full ring-4 ring-emerald-700/70" />
      )}

      {piece && (
        <img
          src={assets[piece]}
          style={{ imageRendering: "crisp-edges" }}
          className={`relative z-10 w-full h-full select-none cursor-pointer ${props.onClick ? "hover:brightness-90" : ""}`}
          alt={piece}
          draggable={true}
        />
      )}
    </div>
  );
}