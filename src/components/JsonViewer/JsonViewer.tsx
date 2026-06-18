import * as React from "react";
import { useClipboard } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface JsonViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: unknown;
  /** Expand nodes up to this depth initially (0 = only root). */
  defaultExpandedDepth?: number;
  /** Show a copy-path button on hover of each key. */
  enableCopyPath?: boolean;
  rootName?: string;
}

type JsonType = "object" | "array" | "string" | "number" | "boolean" | "null";

function typeOf(value: unknown): JsonType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as JsonType;
}

interface NodeProps {
  name: string;
  value: unknown;
  depth: number;
  path: string;
  defaultExpandedDepth: number;
  enableCopyPath: boolean;
  copy: (text: string) => void;
}

function JsonNode({ name, value, depth, path, defaultExpandedDepth, enableCopyPath, copy }: NodeProps) {
  const type = typeOf(value);
  const isBranch = type === "object" || type === "array";
  const [expanded, setExpanded] = React.useState(depth < defaultExpandedDepth);

  const entries = isBranch
    ? Object.entries(value as Record<string, unknown>)
    : [];
  const count = entries.length;

  return (
    <div className="msr-Json__node" style={{ paddingLeft: depth === 0 ? 0 : "var(--msr-space-4)" }}>
      <div className="msr-Json__row">
        {isBranch ? (
          <button
            type="button"
            className="msr-Json__toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            <span className="msr-Json__chevron" data-open={expanded || undefined}>
              <Icon name="chevronRight" size={12} />
            </span>
            <span className="msr-Json__key">{name}</span>
          </button>
        ) : (
          <span className="msr-Json__leaf">
            <span className="msr-Json__key">{name}</span>
            <span className="msr-Json__colon">:</span>
            <span className="msr-Json__value" data-type={type}>
              {type === "string" ? `"${String(value)}"` : String(value)}
            </span>
          </span>
        )}
        <span className="msr-Json__badge" data-type={type}>
          {type}
          {isBranch ? ` · ${count}` : ""}
        </span>
        {enableCopyPath && (
          <button
            type="button"
            className="msr-Json__copy"
            aria-label={`Copy path ${path}`}
            title={path}
            onClick={() => copy(path)}
          >
            <Icon name="copy" size={12} />
          </button>
        )}
      </div>
      {isBranch && expanded && (
        <div className="msr-Json__children">
          {count === 0 ? (
            <div className="msr-Json__empty">{type === "array" ? "[ ]" : "{ }"}</div>
          ) : (
            entries.map(([k, v]) => (
              <JsonNode
                key={k}
                name={type === "array" ? `[${k}]` : k}
                value={v}
                depth={depth + 1}
                path={type === "array" ? `${path}[${k}]` : `${path}.${k}`}
                defaultExpandedDepth={defaultExpandedDepth}
                enableCopyPath={enableCopyPath}
                copy={copy}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** Expandable JSON tree with type badges and copy-path support. */
export const JsonViewer = React.forwardRef<HTMLDivElement, JsonViewerProps>(
  function JsonViewer(
    { data, defaultExpandedDepth = 1, enableCopyPath = true, rootName = "root", className, ...rest },
    ref,
  ) {
    const [copy] = useClipboard();
    return (
      <div ref={ref} className={cx("msr-Json", className)} {...rest}>
        <JsonNode
          name={rootName}
          value={data}
          depth={0}
          path={rootName}
          defaultExpandedDepth={defaultExpandedDepth}
          enableCopyPath={enableCopyPath}
          copy={(t) => void copy(t)}
        />
      </div>
    );
  },
);
