import * as React from "react";
import { useIdle } from "msr-hooks";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";

export interface IdleDialogProps {
  /** Idle time in ms before the dialog appears. */
  timeout?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  stayLabel?: string;
  leaveLabel?: string;
  onStay?: () => void;
  onLeave?: () => void;
}

/** Prompts the user when they've been inactive (uses useIdle). */
export function IdleDialog({
  timeout = 60000,
  title = "Still there?",
  description = "You've been inactive for a while. You'll be signed out soon.",
  stayLabel = "I'm still here",
  leaveLabel = "Sign out",
  onStay,
  onLeave,
}: IdleDialogProps) {
  const idle = useIdle(timeout);
  const [dismissed, setDismissed] = React.useState(false);

  // Reset the dismissed flag once the user becomes active again.
  React.useEffect(() => {
    if (!idle) setDismissed(false);
  }, [idle]);

  const open = idle && !dismissed;

  return (
    <Modal
      open={open}
      onClose={() => {
        setDismissed(true);
        onStay?.();
      }}
      title={title}
      size="sm"
      showCloseButton={false}
      footer={
        <>
          <Button variant="ghost" tone="neutral" onClick={() => onLeave?.()}>
            {leaveLabel}
          </Button>
          <Button onClick={() => { setDismissed(true); onStay?.(); }}>{stayLabel}</Button>
        </>
      }
    >
      {description}
    </Modal>
  );
}
