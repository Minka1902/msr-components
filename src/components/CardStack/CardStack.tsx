import * as React from "react";
import { cx } from "../../lib/cx";

export interface StackCard {
  id: string;
  content: React.ReactNode;
}

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: StackCard[];
  /** Auto-advance interval (ms). Set 0 to disable. */
  interval?: number;
  /** Vertical offset per stacked card, px. */
  offset?: number;
  /** Scale step per stacked card. */
  scaleStep?: number;
  /** Advance when the top card is clicked. */
  advanceOnClick?: boolean;
}

/** Auto-cycling stack of cards (testimonials, tips, highlights). */
export const CardStack = React.forwardRef<HTMLDivElement, CardStackProps>(function CardStack(
  { cards, interval = 3500, offset = 12, scaleStep = 0.05, advanceOnClick = true, className, style, ...rest },
  ref,
) {
  const [order, setOrder] = React.useState(cards);

  React.useEffect(() => setOrder(cards), [cards]);

  const advance = React.useCallback(() => {
    setOrder((prev) => (prev.length < 2 ? prev : [...prev.slice(1), prev[0]]));
  }, []);

  React.useEffect(() => {
    if (!interval || order.length < 2) return;
    const id = setInterval(advance, interval);
    return () => clearInterval(id);
  }, [interval, advance, order.length]);

  return (
    <div
      ref={ref}
      className={cx("msr-CardStack", className)}
      style={style}
      {...rest}
    >
      {order.map((card, i) => {
        const depth = order.length - 1 - i; // top card has depth 0
        return (
          <div
            key={card.id}
            className="msr-CardStack__card"
            data-top={depth === 0 || undefined}
            style={{
              transform: `translateY(${depth * -offset}px) scale(${1 - depth * scaleStep})`,
              zIndex: order.length - depth,
              opacity: depth > 3 ? 0 : 1,
            }}
            onClick={advanceOnClick && depth === 0 ? advance : undefined}
          >
            {card.content}
          </div>
        );
      })}
    </div>
  );
});
