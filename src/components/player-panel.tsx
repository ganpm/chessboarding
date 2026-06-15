import { assets } from "@/game/assets";
import { clsx } from "@/components/utils";

interface PlayerPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  player: "black" | "white";
  capturedPieces: Array<[string, number]>;
};

export const PlayerPanel = ({
  player,
  capturedPieces,
  className,
  ...props
}: PlayerPanelProps) => {

  return (
    <div
      className={clsx(
        "flex",
        "items-center",
        "justify-start",
        "w-full",
        "rounded-md",
        "border",
        "border-zinc-300",
        "bg-zinc-50",
        "shadow-sm",
        "px-4",
        "py-5",
        className
      )}
      {...props}
    >
      <PlayerProfile player={player} />
      <PlayerCapturedPieces capturedPieces={capturedPieces} />
    </div>
  );
};

interface PlayerProfileProps {
  player: "black" | "white";
}

export const PlayerProfile = ({
  player,
}: PlayerProfileProps) => {

  const playerName = {
    black: "BLACK",
    white: "WHITE",
  };

  return (
    <div className="flex items-center justify-start gap-2">
      <div
        className={clsx(
          "w-6 h-6",
          player === "black" && "bg-black",
          player === "white" && "bg-white",
          "border",
          "border-zinc-300"
        )}
      />
      <p className="text-xs font-semibold tracking-[0.24em] text-zinc-500">
        {playerName[player]}
      </p>
    </div>
  );
};

interface PlayerCapturedPiecesProps {
  capturedPieces: Array<[string, number]>;
}

export const PlayerCapturedPieces = ({
  capturedPieces,
}: PlayerCapturedPiecesProps) => {
  const marginClasses: Record<string, string> = {
    "black pawn": "-ml-2",
    "black knight": "-ml-2",
    "black bishop": "-ml-2",
    "black rook": "-ml-1",
    "black queen": "-ml-1",
    "white pawn": "-ml-2",
    "white knight": "-ml-2",
    "white bishop": "-ml-2",
    "white rook": "-ml-1",
    "white queen": "-ml-1",
  };

  return (
    <div className="flex flex-1 items-center justify-start">
      {capturedPieces.map(([piece, count], index) => (
        <div key={index} className="flex items-center justify-start">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={`${index}-${i}`}
              className={clsx(
                marginClasses[piece],
                "first:ml-0"
              )}
            >
              <img
                src={assets[piece]}
                alt={piece}
                className="w-5 h-5"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};