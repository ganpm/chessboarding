import { Button } from "@/components/button";
import { clsx } from "@/components/utils";

interface ModalProps {
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: "primary" | "secondary" | "danger";
  cancelButtonVariant?: "primary" | "secondary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal = ({
  title,
  description,
  confirmButtonText: confirmText = "Confirm",
  cancelButtonText: cancelText = "Cancel",
  confirmButtonVariant: confirmVariant = "danger",
  cancelButtonVariant: cancelVariant = "secondary",
  onConfirm,
  onCancel,
}: ModalProps) => {
  return (
    <div
      className={clsx(
        "fixed",
        "inset-0",
        "z-50",
        "flex",
        "items-center",
        "justify-center",
        "bg-black/35",
        "px-4"
      )}
      role="dialog"
    >
      <div
        className={clsx(
          "w-full",
          "max-w-md",
          "rounded-md",
          "border",
          "border-zinc-300",
          "bg-zinc-50",
          "p-5",
          "shadow-lg"
        )}
      >
        <h2 id="reset-confirm-title" className="text-lg font-semibold text-zinc-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-700">
          {description}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onCancel} variant={cancelVariant}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant={confirmVariant}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};