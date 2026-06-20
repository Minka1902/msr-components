import * as React from "react";
import { useBroadcastChannel } from "msr-hooks";
import { cx } from "../../lib/cx";

interface CursorMessage {
  id: string;
  name?: string;
  color?: string;
  /** Position as a fraction of the container [0,1], for resolution independence. */
  xr: number;
  yr: number;
  t: number;
  /** When true, the peer left. */
  gone?: boolean;
}

export interface LiveCursorsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** BroadcastChannel name shared by all participants. */
  channel: string;
  /** Stable id for this client. */
  selfId: string;
  name?: string;
  color?: string;
  /** Drop a peer cursor after this many ms without updates. */
  staleMs?: number;
  children?: React.ReactNode;
}

/**
 * Renders other participants' live cursors over its content using
 * `useBroadcastChannel` (great for same-origin tabs / demos).
 */
export const LiveCursors = React.forwardRef<HTMLDivElement, LiveCursorsProps>(function LiveCursors(
  { channel, selfId, name, color = "var(--msr-color-primary)", staleMs = 5000, children, className, ...rest },
  ref,
) {
  const [post, last] = useBroadcastChannel<CursorMessage>(channel);
  const [peers, setPeers] = React.useState<Record<string, CursorMessage>>({});
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const lastSent = React.useRef(0);

  // Merge incoming peer messages.
  React.useEffect(() => {
    if (!last || last.id === selfId) return;
    setPeers((prev) => {
      if (last.gone) {
        const next = { ...prev };
        delete next[last.id];
        return next;
      }
      return { ...prev, [last.id]: last };
    });
  }, [last, selfId]);

  // Expire stale cursors.
  React.useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now();
      setPeers((prev) => {
        let changed = false;
        const next: Record<string, CursorMessage> = {};
        for (const [id, c] of Object.entries(prev)) {
          if (now - c.t < staleMs) next[id] = c;
          else changed = true;
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [staleMs]);

  // Announce departure on unmount.
  React.useEffect(() => {
    return () => {
      post({ id: selfId, xr: 0, yr: 0, t: Date.now(), gone: true });
    };
  }, [post, selfId]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (!box) return;
    const now = Date.now();
    if (now - lastSent.current < 40) return; // ~25fps throttle
    lastSent.current = now;
    const r = box.getBoundingClientRect();
    post({
      id: selfId,
      name,
      color,
      xr: (e.clientX - r.left) / r.width,
      yr: (e.clientY - r.top) / r.height,
      t: now,
    });
  };

  return (
    <div
      ref={(node) => {
        boxRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cx("msr-LiveCursors", className)}
      onPointerMove={onMove}
      {...rest}
    >
      {children}
      {Object.values(peers).map((c) => (
        <div
          key={c.id}
          className="msr-LiveCursors__cursor"
          style={{ left: `${c.xr * 100}%`, top: `${c.yr * 100}%`, color: c.color }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 2l13 6.5-5.5 1.5L8 16 3 2z" fill="currentColor" stroke="var(--msr-color-surface)" strokeWidth="1" />
          </svg>
          {c.name && <span className="msr-LiveCursors__label" style={{ backgroundColor: c.color }}>{c.name}</span>}
        </div>
      ))}
    </div>
  );
});
