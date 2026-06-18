import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useControllableState } from "../../lib/useControllableState";

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Each child is a slide. */
  children: React.ReactNode;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Auto-advance interval in ms (0 disables). */
  autoPlay?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
}

/** Slide carousel with arrows, dots, keyboard and optional autoplay. */
export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { children, index, defaultIndex = 0, onIndexChange, autoPlay = 0, loop = true, showArrows = true, showDots = true, className, ...rest },
  ref,
) {
  const slides = React.Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useControllableState<number>({
    value: index,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });

  const go = React.useCallback(
    (next: number) => {
      if (next < 0) next = loop ? count - 1 : 0;
      else if (next >= count) next = loop ? 0 : count - 1;
      setActive(next);
    },
    [count, loop, setActive],
  );

  React.useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => go(active + 1), autoPlay);
    return () => clearInterval(id);
  }, [autoPlay, active, go]);

  return (
    <div
      ref={ref}
      className={cx("msr-Carousel", className)}
      role="region"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
      }}
      {...rest}
    >
      <div className="msr-Carousel__viewport">
        <div className="msr-Carousel__track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide, i) => (
            <div className="msr-Carousel__slide" key={i} aria-hidden={i !== active}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      {showArrows && count > 1 && (
        <>
          <button type="button" className="msr-Carousel__arrow" data-dir="prev" aria-label="Previous slide" onClick={() => go(active - 1)}>
            <Icon name="chevronLeft" size={20} />
          </button>
          <button type="button" className="msr-Carousel__arrow" data-dir="next" aria-label="Next slide" onClick={() => go(active + 1)}>
            <Icon name="chevronRight" size={20} />
          </button>
        </>
      )}
      {showDots && count > 1 && (
        <div className="msr-Carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className="msr-Carousel__dot"
              data-active={i === active || undefined}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
});
