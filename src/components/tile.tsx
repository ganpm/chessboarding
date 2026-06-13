import {
  type SquareColor,
} from "@/game/square";
import { Piece } from "@/game/piece";
import { assets } from "@/game/assets";

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  color: SquareColor;
  piece: Piece | null;
  isGrabbing?: boolean;
  canGrabPiece?: boolean;
  hidePiece?: boolean;
  selected?: boolean;
  legalMove?: boolean;
  captureTarget?: boolean;
  dragOver?: boolean;
  ghostPiece?: Piece | null;
  lastMove?: boolean;
}

export const Tile = ({
  color,
  piece,
  isGrabbing = false,
  canGrabPiece = false,
  hidePiece = false,
  selected = false,
  legalMove = false,
  captureTarget = false,
  dragOver = false,
  ghostPiece = null,
  lastMove = false,
  ...props
}: TileProps) => {
  const bg = {
    dark: "bg-[#B58863]",
    light: "bg-[#F0D9B5]",
  };

  const highlightedBg = {
    dark: "bg-[#8F6747]",
    light: "bg-[#D4BC97]",
  };
  const isDarkenedHighlight = selected || lastMove;

  return (
    <div
      className={`group relative h-25 w-25 ${isDarkenedHighlight ? highlightedBg[color] : bg[color]} ${isGrabbing ? "cursor-grabbing" : legalMove ? "cursor-pointer" : ""}`}
      {...props}
    >
      {legalMove && !piece && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className={`h-8 w-8 rounded-full bg-gray-800 opacity-50 transition-opacity duration-150 ${ghostPiece ? (dragOver ? "opacity-0" : "group-hover:opacity-0") : ""}`} />
        </span>
      )}

      {legalMove && captureTarget && (
        <span className="pointer-events-none absolute inset-2 rounded-full ring-8 ring-emerald-700/70" />
      )}

      {legalMove && ghostPiece && (
        <img
          src={assets[ghostPiece.toString()]}
          style={{ imageRendering: "smooth" }}
          className={`pointer-events-none absolute inset-0 z-20 h-full w-full select-none transition-opacity duration-150 ${dragOver ? "opacity-45" : "opacity-0 group-hover:opacity-45"}`}
          alt={`${ghostPiece.toString()} ghost preview`}
          draggable={false}
        />
      )}

      {piece && (
        <img
          src={assets[piece.toString()]}
          style={{ imageRendering: "crisp-edges" }}
          className={`relative z-10 h-full w-full select-none ${canGrabPiece ? (isGrabbing ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing") : "cursor-auto"} ${hidePiece ? "opacity-0" : ""} ${captureTarget ? (dragOver ? "opacity-0" : "group-hover:opacity-0") : ""}`}
          alt={piece.toString()}
          draggable={false}
        />
      )}
    </div>
  );
};
