import {
  Move,
} from "@/game/move";
import {
  RiArrowGoBackFill as ResetIcon,
  RiRewindStartFill as BackToStartIcon,
  RiSkipBackFill as BackOneMoveIcon,
  RiSkipForwardFill as ForwardOneMoveIcon,
  RiForwardEndFill as ForwardToEndIcon,
} from "react-icons/ri";
import { Button } from "@/components/button";

interface MovelistProps extends React.HTMLAttributes<HTMLDivElement> {
  moves: Move[];
  currentHalfMoveIndex: number;
  resetGame: () => void;
  goToStart: () => void;
  goBackOneMove: () => void;
  goForwardOneMove: () => void;
  goToEnd: () => void;
}

interface FullMove {
  turn: number;
  white: Move | null;
  black: Move | null;
  whiteHalfMoveIndex: number;
  blackHalfMoveIndex: number;
}

const convertHalfMovesToFullMoves = (moves: Move[]): FullMove[] => {
  const fullMoves: FullMove[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    fullMoves.push({
      turn: Math.floor(i / 2) + 1,
      white: moves[i] ?? null,
      black: moves[i + 1] ?? null,
      whiteHalfMoveIndex: i,
      blackHalfMoveIndex: i + 1,
    });
  }

  return fullMoves;
};

export const Movelist = ({
  moves,
  resetGame,
  goToStart,
  goBackOneMove,
  goForwardOneMove,
  goToEnd,
  currentHalfMoveIndex,
  className,
  ...props
}: MovelistProps) => {

  const activeHalfMoveIndex = currentHalfMoveIndex - 1;
  const fullMoves = convertHalfMovesToFullMoves(moves);
  const buttonSize = 20;

  return (
    <section
      className={`flex h-200 w-xs flex-col rounded-md border border-zinc-300 bg-zinc-50 shadow-sm ${className ?? ""}`}
      {...props}
    >
      <header className="h-10 flex items-center justify-center border-b border-zinc-300 px-3 py-2">
        <h2 className="font-semibold tracking-wide text-zinc-800">
          Moves
        </h2>
      </header>

      <div className="h-8 grid grid-cols-[40px_1fr_1fr] gap-x-2 border-b border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
        <span className="flex items-center justify-start">#</span>
        <span className="flex items-center justify-center">White</span>
        <span className="flex items-center justify-center">Black</span>
      </div>

      <div className="h-168 flex-1 overflow-y-auto snap-y snap-mandatory px-3 py-2">
        {moves.length === 0 ? (
          <p className="text-center text-zinc-500">No moves yet.</p>
        ) : (
          <ol>
            {fullMoves.map(fullMove => (
              <li
                key={`round-${fullMove.turn}`}
                className="snap-start h-8 grid grid-cols-[40px_1fr_1fr] gap-x-2 rounded px-1 py-1 text-zinc-800 odd:bg-zinc-100"
              >
                <span className="font-mono text-zinc-600">{fullMove.turn}.</span>
                <span className={`flex items-center justify-center font-mono ${activeHalfMoveIndex === fullMove.whiteHalfMoveIndex ? "bg-zinc-300" : ""}`}>
                  {fullMove.white ? fullMove.white.format() : "-"}
                </span>
                <span className={`flex items-center justify-center font-mono ${activeHalfMoveIndex === fullMove.blackHalfMoveIndex ? "bg-zinc-300" : ""}`}>
                  {fullMove.black ? fullMove.black.format() : "-"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="h-17 border-t border-zinc-300 px-3 py-1 flex items-center justify-center gap-x-2">
        <Button variant="secondary" title="Reset game" onClick={resetGame}>
          <ResetIcon size={buttonSize} />
        </Button>
        <Button variant="secondary" title="Go to start" onClick={goToStart}>
          <BackToStartIcon size={buttonSize} />
        </Button>
        <Button variant="secondary" title="Go back one move" onClick={goBackOneMove}>
          <BackOneMoveIcon size={buttonSize} />
        </Button>
        <Button variant="secondary" title="Go forward one move" onClick={goForwardOneMove}>
          <ForwardOneMoveIcon size={buttonSize} />
        </Button>
        <Button variant="secondary" title="Go to end" onClick={goToEnd}>
          <ForwardToEndIcon size={buttonSize} />
        </Button>
      </div>
    </section>
  );
};