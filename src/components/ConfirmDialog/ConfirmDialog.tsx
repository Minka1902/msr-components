import * as React from "react";
import { Modal, type ModalSize } from "../Modal/Modal";
import { Button, type ButtonTone } from "../Button/Button";

export interface ConfirmDialogProps {
  open: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Tone of the confirm button. Use "danger" for destructive actions. */
  tone?: ButtonTone;
  /** Show a spinner on confirm and block interaction. */
  loading?: boolean;
  size?: ModalSize;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Reusable confirmation modal, defaulting to a destructive (danger) action. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
  size = "sm",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onCancel}
      title={title}
      size={size}
      showCloseButton={false}
      closeOnOverlayClick={!loading}
      footer={
        <>
          <Button variant="ghost" tone="neutral" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button tone={tone} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description}
    </Modal>
  );
}
