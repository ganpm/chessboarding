import { assets } from "@/game/assets";
import { clsx } from "@/components/utils";

interface SidePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  capturedPieces: {
    black: Array<[string, number]>;
    white: Array<[string, number]>;
  };
}


export const SidePanel = ({
  className,
  ...props
}: SidePanelProps) => {
  const playerIconSizeClass = "w-6 h-6";
  const capturedPieceIconSizeClass = "w-4 h-4";
  
  const marginClasses: { [key: string]: string } = {
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
    <div
      className={clsx(
        "flex-col",
        "h-200",
        "md:w-xs",
        "overflow-hidden",
        "rounded-md",
        "border",
        "border-zinc-300",
        "bg-zinc-50",
        "shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex-1 flex flex-col bg-zinc-100 px-4 py-5">
        <div className="flex items-center justify-start gap-2">
          <div className={`${playerIconSizeClass} bg-black border border-zinc-300`} />
          <p className="text-xs font-semibold tracking-[0.24em] text-zinc-500">BLACK</p>
          <div className="flex items-center justify-start">
            {props.capturedPieces.black.map(([piece, count], index) => (
              <div
                key={index}
                className="flex items-center justify-start"
              >
                {Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`${index}-${i}`}
                    className={`${marginClasses[piece]} first:ml-0`}
                  >
                    <img
                      src={assets[piece]}
                      alt={piece}
                      className={capturedPieceIconSizeClass}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-px my-5 w-full bg-zinc-300" />
        
        <div className="flex-1" />
      </div>

      <div className="h-px w-full bg-zinc-300" />

      <div className="flex-1 flex flex-col bg-zinc-100 px-4 py-5">
        <div className="flex-1" />
        
        <div className="h-px my-5 w-full bg-zinc-300" />
        
        <div className="flex items-center justify-start gap-2">
          <div className={`${playerIconSizeClass} bg-white border border-zinc-300`} />
          <p className="text-xs font-semibold tracking-[0.24em] text-zinc-500">WHITE</p>
          <div className="flex items-center justify-start">
            {props.capturedPieces.white.map(([piece, count], index) => (
              <div
                key={index}
                className="flex items-center justify-start"
              >
                {Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`${index}-${i}`}
                    className={`${marginClasses[piece]} first:ml-0`}
                  >
                    <img
                      src={assets[piece]}
                      alt={piece}
                      className={capturedPieceIconSizeClass}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};