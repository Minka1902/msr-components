import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey, useLockBodyScroll } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: React.ReactNode;
}

export interface LightboxProps {
  images: LightboxImage[];
  open: boolean;
  onClose: () => void;
  /** Controlled active index. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  showThumbnails?: boolean;
  className?: string;
}

/** Fullscreen image viewer with keyboard nav, zoom and thumbnails. */
export function Lightbox({
  images,
  open,
  onClose,
  index,
  defaultIndex = 0,
  onIndexChange,
  showThumbnails = true,
  className,
}: LightboxProps) {
  const portal = usePortal("msr-lightbox-root");
  const controlled = index !== undefined;
  const [internal, setInternal] = React.useState(defaultIndex);
  const current = controlled ? (index as number) : internal;
  const [zoomed, setZoomed] = React.useState(false);

  const go = React.useCallback(
    (next: number) => {
      const clamped = (next + images.length) % images.length;
      setZoomed(false);
      if (!controlled) setInternal(clamped);
      onIndexChange?.(clamped);
    },
    [controlled, images.length, onIndexChange],
  );

  useEscapeKey(() => open && onClose());
  useLockBodyScroll(open);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(current + 1);
      else if (e.key === "ArrowLeft") go(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, current, go]);

  if (!open || !portal || images.length === 0) return null;
  const img = images[current];

  return createPortal(
    <div className={cx("msr-Lightbox", className)} role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className="msr-Lightbox__backdrop" onClick={onClose} />
      <button type="button" className="msr-Lightbox__close" aria-label="Close" onClick={onClose}>
        <Icon name="close" size={22} />
      </button>
      <div className="msr-Lightbox__counter">{current + 1} / {images.length}</div>

      {images.length > 1 && (
        <button type="button" className="msr-Lightbox__nav msr-Lightbox__nav--prev" aria-label="Previous" onClick={() => go(current - 1)}>
          <Icon name="chevronLeft" size={28} />
        </button>
      )}

      <figure className="msr-Lightbox__figure">
        <img
          className="msr-Lightbox__img"
          data-zoomed={zoomed || undefined}
          src={img.src}
          alt={img.alt ?? ""}
          onClick={() => setZoomed((z) => !z)}
        />
        {img.caption && <figcaption className="msr-Lightbox__caption">{img.caption}</figcaption>}
      </figure>

      {images.length > 1 && (
        <button type="button" className="msr-Lightbox__nav msr-Lightbox__nav--next" aria-label="Next" onClick={() => go(current + 1)}>
          <Icon name="chevronRight" size={28} />
        </button>
      )}

      {showThumbnails && images.length > 1 && (
        <div className="msr-Lightbox__thumbs">
          {images.map((t, i) => (
            <button
              key={i}
              type="button"
              className="msr-Lightbox__thumb"
              data-active={i === current || undefined}
              aria-label={`Image ${i + 1}`}
              onClick={() => go(i)}
            >
              <img src={t.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>,
    portal,
  );
}
