import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { Collapsible } from "../../components/Collapsible/Collapsible";

export type ResultStatus = "success" | "warning" | "error" | "info";

export interface ResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plugin name. */
  name: string;
  status?: ResultStatus;
  summary?: React.ReactNode;
  /** Main result body (any node). */
  result?: React.ReactNode;
  warnings?: string[];
  /** Files this plugin produced/used. */
  includedFiles?: string[];
  icon?: IconName | React.ReactNode;
  defaultOpen?: boolean;
}

const STATUS: Record<ResultStatus, { tone: "success" | "warning" | "danger" | "info"; icon: IconName }> = {
  success: { tone: "success", icon: "checkCircle" },
  warning: { tone: "warning", icon: "warning" },
  error: { tone: "danger", icon: "alert" },
  info: { tone: "info", icon: "info" },
};

function renderIcon(icon: IconName | React.ReactNode | undefined, fallback: IconName) {
  if (!icon) return <Icon name={fallback} size={16} />;
  return typeof icon === "string" ? <Icon name={icon as IconName} size={16} /> : icon;
}

/** Generic card for a plugin's output: summary, result, warnings, files. */
export const ResultCard = React.forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard(
    { name, status = "success", summary, result, warnings = [], includedFiles = [], icon, defaultOpen = false, className, ...rest },
    ref,
  ) {
    const s = STATUS[status];
    return (
      <div ref={ref} className={cx("msr-ResultCard", className)} data-status={status} {...rest}>
        <div className="msr-ResultCard__header">
          <span className="msr-ResultCard__icon" data-tone={s.tone}>{renderIcon(icon, s.icon)}</span>
          <div className="msr-ResultCard__title-wrap">
            <span className="msr-ResultCard__name">{name}</span>
            {summary && <span className="msr-ResultCard__summary">{summary}</span>}
          </div>
          <StatusBadge tone={s.tone} variant="soft" size="sm">{status}</StatusBadge>
        </div>

        {result != null && <div className="msr-ResultCard__result">{result}</div>}

        {warnings.length > 0 && (
          <ul className="msr-ResultCard__warnings">
            {warnings.map((w, i) => (
              <li key={i} className="msr-ResultCard__warning">
                <Icon name="warning" size={13} /> {w}
              </li>
            ))}
          </ul>
        )}

        {includedFiles.length > 0 && (
          <div className="msr-ResultCard__files">
            <Collapsible
              defaultOpen={defaultOpen}
              trigger={
                <span className="msr-ResultCard__files-trigger">
                  <Icon name="chevronRight" size={13} /> {includedFiles.length} included files
                </span>
              }
            >
              <ul className="msr-ResultCard__file-list">
                {includedFiles.map((f, i) => (
                  <li key={i}><code>{f}</code></li>
                ))}
              </ul>
            </Collapsible>
          </div>
        )}
      </div>
    );
  },
);
