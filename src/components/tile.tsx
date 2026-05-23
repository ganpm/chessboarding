import {
  type SquareColor,
} from "@/data/square";
import {
  type Piece,
} from "@/data/piece";
import { assets } from "@/data/assets";

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  color: SquareColor;
  piece: Piece | null;
  selected?: boolean;
  legalMove?: boolean;
  captureTarget?: boolean;
  ghostPiece?: Piece | null;
}

export const Tile = ({
  color,
  piece,
  selected = false,
  legalMove = false,
  captureTarget = false,
  ghostPiece = null,
  ...props
}: TileProps) => {
  const bg = {
    dark: "bg-[#B58863]",
    light: "bg-[#F0D9B5]",
  };

  return (
    <div
      className={`group relative h-25 w-25 ${bg[color]} ${selected ? "ring-8 ring-inset ring-yellow-400" : ""} ${legalMove ? "cursor-pointer" : ""}`}
      {...props}
    >
      {legalMove && !piece && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className={`h-5 w-5 rounded-full bg-gray-700 opacity-50 transition-opacity duration-150 ${ghostPiece ? "group-hover:opacity-0" : ""}`} />
        </span>
      )}

      {legalMove && captureTarget && (
        <span className="pointer-events-none absolute inset-2 rounded-full ring-8 ring-emerald-700/70" />
      )}

      {legalMove && ghostPiece && (
        <img
          src={assets[ghostPiece]}
          style={{ imageRendering: "smooth" }}
          className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none opacity-0 transition-opacity duration-150 group-hover:opacity-45"
          alt={`${ghostPiece} ghost preview`}
          draggable={false}
        />
      )}

      {piece && (
        <img
          src={assets[piece]}
          style={{ imageRendering: "crisp-edges" }}
          className={`relative z-10 h-full w-full cursor-pointer select-none ${captureTarget ? "group-hover:opacity-0" : ""}`}
          alt={piece}
          draggable={true}
        />
      )}
    </div>
  );
};
