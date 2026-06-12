import { assets } from "@/game/assets";
import { Piece, PieceType } from "@/game/piece";
import { Player } from "@/game/player";
import { Square } from "@/game/square";

interface PromotionPickerProps {
  square: Square;
  player: Player;
  onSelect: (pieceType: PieceType) => void;
  onCancel: () => void;
}

const CELL_SIZE_PERCENT = 12.5;

export const PromotionPicker = ({ square, player, onSelect, onCancel }: PromotionPickerProps) => {
  const col = square.file;
  const row = 7 - square.rank;
  const isWhitePromotion = player.is(Player.WHITE);

  const firstRow = isWhitePromotion ? row : row - 3.48; // 3 pieces + cancel button, with a little extra to make it look nicer when centered on the promotion square

  const left = `${col * CELL_SIZE_PERCENT}%`;
  const top = `${firstRow * CELL_SIZE_PERCENT}%`;

  const controls = isWhitePromotion
    ? [
        { key: PieceType.QUEEN.toString(), type: PieceType.QUEEN },
        { key: PieceType.ROOK.toString(), type: PieceType.ROOK },
        { key: PieceType.BISHOP.toString(), type: PieceType.BISHOP },
        { key: PieceType.KNIGHT.toString(), type: PieceType.KNIGHT },
        { key: "cancel", type: null },
      ]
    : [
        { key: "cancel", type: null },
        { key: PieceType.KNIGHT.toString(), type: PieceType.KNIGHT },
        { key: PieceType.BISHOP.toString(), type: PieceType.BISHOP },
        { key: PieceType.ROOK.toString(), type: PieceType.ROOK },
        { key: PieceType.QUEEN.toString(), type: PieceType.QUEEN },
      ];

  return (
    <div
      data-promotion-picker="true"
      className="absolute z-40"
      style={{ left, top, width: `${CELL_SIZE_PERCENT}%` }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="overflow-hidden rounded-md bg-zinc-50 shadow-2xl">
        {controls.map((control, index) => {
          const isLast = index === controls.length - 1;

          if (!control.type) {
            return (
              <button
                key={control.key}
                type="button"
                onClick={onCancel}
                className={`flex h-12 w-25 items-center justify-center bg-zinc-900 text-lg font-bold text-zinc-100 transition-colors hover:bg-zinc-700 cursor-pointer ${!isLast ? "border-b border-zinc-300" : ""}`}
                aria-label="Cancel promotion"
                title="Cancel promotion"
              >
                X
              </button>
            );
          }

          const promotedPiece = Piece.get(player, control.type);
          return (
            <button
              key={control.key}
              type="button"
              onClick={() => onSelect(control.type!)}
              className={`flex h-25 w-25 items-center justify-center bg-zinc-50 transition-colors hover:bg-zinc-200 cursor-pointer ${!isLast ? "border-b border-zinc-300" : ""}`}
              aria-label={`Promote to ${control.type.toString()}`}
              title={`Promote to ${control.type.toString()}`}
            >
              <img
                src={assets[promotedPiece.toString()]}
                className="h-full w-full"
                alt={promotedPiece.toString()}
                draggable={false}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
