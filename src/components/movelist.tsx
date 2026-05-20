import {
  type Move,
  formatMove
} from "@/data/game";

interface MovelistProps extends React.HTMLAttributes<HTMLDivElement> {
  moves: Move[];
}

const splitMovesIntoRounds = (moves: Move[]): Array<{ white: Move; black: Move | null }> => {
  const rounds: Array<{ white: Move; black: Move | null }> = [];

  for (let i = 0; i < moves.length; i += 2) {
    rounds.push({
      white: moves[i],
      black: moves[i + 1] ?? null,
    });
  }

  return rounds;
};

export const Movelist = ({ moves, className, ...props }: MovelistProps) => {
  const rounds = splitMovesIntoRounds(moves);

  return (
    <section
      className={`w-full h-full max-w-xs rounded-md border border-zinc-300 bg-zinc-50 shadow-sm ${className ?? ""}`}
      {...props}
    >
      <header className="border-b border-zinc-300 px-3 py-2">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-800">Move List</h2>
      </header>

      <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-x-2 border-b border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
        <span>#</span>
        <span>White</span>
        <span>Black</span>
      </div>

      <div className="max-h-96 overflow-y-auto px-3 py-2">
        {rounds.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">No moves yet.</p>
        ) : (
          <ol className="space-y-1">
            {rounds.map((round, index) => (
              <li
                key={`round-${index + 1}`}
                className="grid grid-cols-[80px_1fr_1fr] items-center gap-x-2 rounded px-1 py-1 text-sm text-zinc-800 odd:bg-zinc-100"
              >
                <span className="font-mono text-zinc-600">{index + 1}.</span>
                <span className="font-mono">{formatMove(round.white)}</span>
                <span className="font-mono text-zinc-700">
                  {round.black ? formatMove(round.black) : "-"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};