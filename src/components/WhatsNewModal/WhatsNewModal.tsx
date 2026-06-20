import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { Modal } from "../Modal";

export interface WhatsNewItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Icon glyph name. */
  icon?: IconName;
  /** Small tag, e.g. "New", "Improved". */
  tag?: string;
  tagTone?: "primary" | "success" | "info" | "warning";
}

export interface WhatsNewModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  items: WhatsNewItem[];
  /** Footer call-to-action label. */
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

/** Release-notes / changelog dialog built on `Modal`. */
export function WhatsNewModal({
  open,
  onClose,
  title = "What's new",
  items,
  ctaLabel = "Got it",
  onCta,
  className,
}: WhatsNewModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="md"
      className={cx("msr-WhatsNewModal", className)}
      footer={
        <button
          type="button"
          className="msr-WhatsNewModal__cta"
          onClick={() => {
            onCta?.();
            onClose();
          }}
        >
          {ctaLabel}
        </button>
      }
    >
      <ul className="msr-WhatsNewModal__list">
        {items.map((item) => (
          <li key={item.id} className="msr-WhatsNewModal__item">
            {item.icon && (
              <span className="msr-WhatsNewModal__icon" aria-hidden="true">
                <Icon name={item.icon} size={18} />
              </span>
            )}
            <div className="msr-WhatsNewModal__body">
              <div className="msr-WhatsNewModal__head">
                <span className="msr-WhatsNewModal__title">{item.title}</span>
                {item.tag && (
                  <span className="msr-WhatsNewModal__tag" data-tone={item.tagTone ?? "primary"}>
                    {item.tag}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="msr-WhatsNewModal__desc">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
