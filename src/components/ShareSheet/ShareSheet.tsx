import * as React from "react";
import { useClipboard } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface ShareTarget {
  id: string;
  label: string;
  icon?: IconName;
  /** Emoji/text glyph used when no icon name is given. */
  glyph?: string;
  /** Link to open; when set the target renders as an anchor. */
  href?: string;
  color?: string;
}

export interface ShareSheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** URL being shared (shown in the copy-link row). */
  url: string;
  title?: React.ReactNode;
  targets?: ShareTarget[];
  onShare?: (target: ShareTarget) => void;
  /** Hide the copy-link row. */
  hideCopyLink?: boolean;
}

const DEFAULT_TARGETS: ShareTarget[] = [
  { id: "x", label: "X", glyph: "𝕏" },
  { id: "facebook", label: "Facebook", glyph: "f" },
  { id: "linkedin", label: "LinkedIn", glyph: "in" },
  { id: "email", label: "Email", icon: "send" },
];

/** Share panel with social targets and a copy-link row (for Drawer/Popover). */
export const ShareSheet = React.forwardRef<HTMLDivElement, ShareSheetProps>(function ShareSheet(
  { url, title = "Share", targets = DEFAULT_TARGETS, onShare, hideCopyLink = false, className, ...rest },
  ref,
) {
  const [copy, copied] = useClipboard();

  return (
    <div ref={ref} className={cx("msr-ShareSheet", className)} {...rest}>
      {title && <div className="msr-ShareSheet__title">{title}</div>}

      <div className="msr-ShareSheet__targets">
        {targets.map((t) => {
          const inner = (
            <>
              <span
                className="msr-ShareSheet__icon"
                style={t.color ? { backgroundColor: t.color } : undefined}
                aria-hidden="true"
              >
                {t.icon ? <Icon name={t.icon} size={18} /> : <span className="msr-ShareSheet__glyph">{t.glyph}</span>}
              </span>
              <span className="msr-ShareSheet__label">{t.label}</span>
            </>
          );
          return t.href ? (
            <a
              key={t.id}
              className="msr-ShareSheet__target"
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onShare?.(t)}
            >
              {inner}
            </a>
          ) : (
            <button key={t.id} type="button" className="msr-ShareSheet__target" onClick={() => onShare?.(t)}>
              {inner}
            </button>
          );
        })}
      </div>

      {!hideCopyLink && (
        <div className="msr-ShareSheet__copyRow">
          <span className="msr-ShareSheet__url" title={url}>
            <Icon name="link" size={15} />
            <span className="msr-ShareSheet__urlText">{url}</span>
          </span>
          <button
            type="button"
            className="msr-ShareSheet__copyBtn"
            data-copied={copied || undefined}
            onClick={() => copy(url)}
          >
            <Icon name={copied ? "check" : "copy"} size={15} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
});
