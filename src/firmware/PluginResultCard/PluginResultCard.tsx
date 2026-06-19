import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { Collapsible } from "../../components/Collapsible/Collapsible";

export type PluginStatus = "success" | "warning" | "error" | "info";

export interface PluginResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plugin name. */
  name: string;
  status?: PluginStatus;
  summary?: React.ReactNode;
  /** Main result body (any node). */
  result?: React.ReactNode;
  warnings?: string[];
  /** Files this plugin produced/used. */
  includedFiles?: string[];
  icon?: IconName | React.ReactNode;
  defaultOpen?: boolean;
}

const STATUS: Record<PluginStatus, { tone: "success" | "warning" | "danger" | "info"; icon: IconName }> = {
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
export const PluginResultCard = React.forwardRef<HTMLDivElement, PluginResultCardProps>(
  function PluginResultCard(
    { name, status = "success", summary, result, warnings = [], includedFiles = [], icon, defaultOpen = false, className, ...rest },
    ref,
  ) {
    const s = STATUS[status];
    return (
      <div ref={ref} className={cx("msr-Plugin", className)} data-status={status} {...rest}>
        <div className="msr-Plugin__header">
          <span className="msr-Plugin__icon" data-tone={s.tone}>{renderIcon(icon, s.icon)}</span>
          <div className="msr-Plugin__title-wrap">
            <span className="msr-Plugin__name">{name}</span>
            {summary && <span className="msr-Plugin__summary">{summary}</span>}
          </div>
          <StatusBadge tone={s.tone} variant="soft" size="sm">{status}</StatusBadge>
        </div>

        {result != null && <div className="msr-Plugin__result">{result}</div>}

        {warnings.length > 0 && (
          <ul className="msr-Plugin__warnings">
            {warnings.map((w, i) => (
              <li key={i} className="msr-Plugin__warning">
                <Icon name="warning" size={13} /> {w}
              </li>
            ))}
          </ul>
        )}

        {includedFiles.length > 0 && (
          <div className="msr-Plugin__files">
            <Collapsible
              defaultOpen={defaultOpen}
              trigger={
                <span className="msr-Plugin__files-trigger">
                  <Icon name="chevronRight" size={13} /> {includedFiles.length} included files
                </span>
              }
            >
              <ul className="msr-Plugin__file-list">
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
