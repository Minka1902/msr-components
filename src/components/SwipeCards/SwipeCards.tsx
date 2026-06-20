import * as React from "react";
import { cx } from "../../lib/cx";

export type SwipeDirection = "left" | "right" | "up";

export interface SwipeCardItem {
  id: string;
  content: React.ReactNode;
}

export interface SwipeCardsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  cards: SwipeCardItem[];
  onSwipe?: (id: string, direction: SwipeDirection) => void;
  onEmpty?: () => void;
  /** Drag distance (px) needed to fling. */
  threshold?: number;
  /** Allow swiping up. */
  allowUp?: boolean;
  /** Overlay labels keyed by direction. */
  labels?: Partial<Record<SwipeDirection, React.ReactNode>>;
  /** Max stacked cards rendered behind the top one. */
  stackSize?: number;
}

/** Tinder-style swipeable card deck (drag, fling, like/nope overlays). */
export const SwipeCards = React.forwardRef<HTMLDivElement, SwipeCardsProps>(function SwipeCards(
  { cards, onSwipe, onEmpty, threshold = 110, allowUp = false, labels, stackSize = 3, className, ...rest },
  ref,
) {
  const [removed, setRemoved] = React.useState<Set<string>>(new Set());
  const [drag, setDrag] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const start = React.useRef<{ x: number; y: number } | null>(null);
  const flinging = React.useRef(false);

  const visible = cards.filter((c) => !removed.has(c.id));
  const top = visible[0];

  const fling = (id: string, dir: SwipeDirection) => {
    if (flinging.current) return;
    flinging.current = true;
    setDrag({
      x: dir === "right" ? 1000 : dir === "left" ? -1000 : drag.x,
      y: dir === "up" ? -1000 : drag.y,
    });
    window.setTimeout(() => {
      setRemoved((prev) => new Set(prev).add(id));
      setDrag({ x: 0, y: 0 });
      flinging.current = false;
      onSwipe?.(id, dir);
      if (visible.length === 1) onEmpty?.();
    }, 220);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!top || flinging.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !start.current) return;
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  };
  const onPointerUp = () => {
    if (!dragging || !top) return;
    setDragging(false);
    start.current = null;
    if (drag.x > threshold) fling(top.id, "right");
    else if (drag.x < -threshold) fling(top.id, "left");
    else if (allowUp && drag.y < -threshold) fling(top.id, "up");
    else setDrag({ x: 0, y: 0 });
  };

  const likeOpacity = Math.max(0, Math.min(1, drag.x / threshold));
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / threshold));

  return (
    <div ref={ref} className={cx("msr-SwipeCards", className)} {...rest}>
      {visible.length === 0 && <div className="msr-SwipeCards__empty">No more cards</div>}
      {visible
        .slice(0, stackSize)
        .map((card, i) => {
          const isTop = i === 0;
          const rotate = isTop ? drag.x / 18 : 0;
          const transform = isTop
            ? `translate(${drag.x}px, ${drag.y}px) rotate(${rotate}deg)`
            : `translateY(${i * 10}px) scale(${1 - i * 0.04})`;
          return (
            <div
              key={card.id}
              className="msr-SwipeCards__card"
              data-top={isTop || undefined}
              data-dragging={isTop && dragging ? true : undefined}
              style={{ transform, zIndex: stackSize - i }}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
            >
              {isTop && labels?.right && (
                <span className="msr-SwipeCards__stamp msr-SwipeCards__stamp--like" style={{ opacity: likeOpacity }}>
                  {labels.right}
                </span>
              )}
              {isTop && labels?.left && (
                <span className="msr-SwipeCards__stamp msr-SwipeCards__stamp--nope" style={{ opacity: nopeOpacity }}>
                  {labels.left}
                </span>
              )}
              {card.content}
            </div>
          );
        })
        .reverse()}
    </div>
  );
});
