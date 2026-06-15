import {
  type SquareColor,
} from "@/game/square";
import { Piece } from "@/game/piece";
import { assets } from "@/game/assets";
import {
  FaCrown as VictoryIcon,
  FaHashtag as DefeatIcon,
} from "react-icons/fa";
import { clsx } from "@/components/utils";

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
  kingIndicator?: "victory" | "defeat" | null;
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
  kingIndicator = null,
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
      className={clsx(
        "group",
        "relative",
        "h-full w-full",
        "md:h-25 md:w-25",
        "flex",
        "items-center",
        "justify-center",
        isDarkenedHighlight ? highlightedBg[color] : bg[color],
        isGrabbing ? "cursor-grabbing" : legalMove ? "cursor-pointer" : ""
      )}
      {...props}
    >
      {legalMove && !piece && (
        <span className={clsx(
          "pointer-events-none",
          "absolute",
          "md:w-8 md:h-8",
          "w-4 h-4",
          "rounded-full",
          "bg-gray-800",
          "opacity-50",
          "transition-opacity",
          "duration-150",
          dragOver && "opacity-0",
          ghostPiece && "group-hover:opacity-0"
        )} />
      )}

      {legalMove && captureTarget && (
        <span className={clsx(
          "pointer-events-none",
          "absolute",
          "inset-2",
          "rounded-full",
          "ring-8",
          "ring-emerald-700/70"
        )} />
      )}

      {legalMove && ghostPiece && (
        <img
          src={assets[ghostPiece.toString()]}
          className={clsx(
            "pointer-events-none",
            "absolute",
            "inset-0",
            "z-20",
            "h-full",
            "w-full",
            "select-none",
            "transition-opacity",
            "duration-150",
            dragOver ? "opacity-45" : "opacity-0 group-hover:opacity-45",
            "[image-rendering:smooth]"
          )}
          alt={`${ghostPiece.toString()} ghost preview`}
          draggable={false}
        />
      )}

      {piece && (
        <img
          src={assets[piece.toString()]}
          className={clsx(
            "relative",
            "z-10",
            "h-full",
            "w-full",
            "select-none",
            canGrabPiece ? (isGrabbing ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing") : "cursor-auto",
            hidePiece && "opacity-0",
            captureTarget ? (dragOver ? "opacity-0" : "group-hover:opacity-0") : "",
            "[image-rendering:smooth]"
          )}
          alt={piece.toString()}
          draggable={false}
        />
      )}

      {kingIndicator && (
        <span
          className={clsx(
            "pointer-events-none",
            "absolute",
            "right-1",
            "top-1",
            "z-30",
            "inline-flex",
            "md:w-6 md:h-6",
            "w-4 h-4",
            "items-center",
            "justify-center",
            "rounded-sm",
            "border-2",
            "shadow-sm",
            kingIndicator === "victory" ? "border-[#2F5D46] bg-[#D7E8DC] text-[#1E3F30]" : "border-[#7A2D2D] bg-[#EBCFCF] text-[#4D1717]"
          )}
          aria-label={kingIndicator === "victory" ? "Victory indicator" : "Defeat indicator"}
          title={kingIndicator === "victory" ? "Victory" : "Defeat"}
        >
          {kingIndicator === "victory"
            ? <VictoryIcon className="md:w-6 md:h-6 w-4 h-4" aria-hidden="true" />
            : <DefeatIcon className="md:w-6 md:h-6 w-4 h-4" aria-hidden="true" />}
        </span>
      )}
    </div>
  );
};
