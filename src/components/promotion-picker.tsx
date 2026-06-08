import { assets } from "@/game/assets";
import { Piece, PieceType } from "@/game/piece";
import { Player } from "@/game/player";

interface PromotionPickerProps {
  player: Player;
  onSelect: (pieceType: PieceType) => void;
}

export const PromotionPicker = ({ player, onSelect }: PromotionPickerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
      <div className="rounded-lg border border-zinc-300 bg-white p-4 shadow-xl">
        <h2 className="mb-3 text-center text-lg font-semibold text-zinc-900">Choose Promotion</h2>
        <div className="flex gap-2">
          {PieceType.promotions.map((pieceType) => {
            const promotedPiece = Piece.get(player, pieceType);
            return (
              <button
                key={pieceType.toString()}
                type="button"
                onClick={() => onSelect(pieceType)}
                className="rounded-md border border-zinc-300 p-2 transition-colors hover:bg-zinc-100"
                aria-label={`Promote to ${pieceType.toString()}`}
                title={`Promote to ${pieceType.toString()}`}
              >
                <img
                  src={assets[promotedPiece.toString()]}
                  className="h-14 w-14"
                  alt={promotedPiece.toString()}
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
