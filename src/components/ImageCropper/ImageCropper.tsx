import * as React from "react";
import { cx } from "../../lib/cx";

export interface ImageCropperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Image URL or data URL to crop. */
  src: string;
  /** Viewport size in px (square crop). */
  size?: number;
  /** Output image size in px. */
  output?: number;
  /** Circular crop mask (e.g. avatars). */
  round?: boolean;
  /** Max zoom factor. */
  maxZoom?: number;
  /** Called with a cropped PNG data URL when `cropToDataURL` is triggered. */
  onCrop?: (dataUrl: string) => void;
  /** Render a built-in "Apply" button. */
  showApply?: boolean;
  applyLabel?: string;
}

/** Pan + zoom image cropper that exports a cropped data URL via `<canvas>`. */
export const ImageCropper = React.forwardRef<HTMLDivElement, ImageCropperProps>(function ImageCropper(
  { src, size = 240, output = 240, round = false, maxZoom = 3, onCrop, showApply = true, applyLabel = "Apply", className, ...rest },
  ref,
) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [nat, setNat] = React.useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const drag = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const baseScale = nat ? Math.max(size / nat.w, size / nat.h) : 1;
  const effScale = baseScale * zoom;
  const dispW = nat ? nat.w * effScale : size;
  const dispH = nat ? nat.h * effScale : size;

  const clamp = React.useCallback(
    (o: { x: number; y: number }) => ({
      x: Math.min(0, Math.max(size - dispW, o.x)),
      y: Math.min(0, Math.max(size - dispH, o.y)),
    }),
    [size, dispW, dispH],
  );

  // Re-center when the image loads or zoom changes.
  React.useEffect(() => {
    if (!nat) return;
    setOffset((prev) => clamp({ x: prev.x || (size - dispW) / 2, y: prev.y || (size - dispH) / 2 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nat, zoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setOffset(clamp({ x: drag.current.ox + dx, y: drag.current.oy + dy }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const cropToDataURL = () => {
    const img = imgRef.current;
    if (!img || !nat) return;
    const canvas = document.createElement("canvas");
    canvas.width = output;
    canvas.height = output;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sSize = size / effScale;
    const sx = -offset.x / effScale;
    const sy = -offset.y / effScale;
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, output, output);
    onCrop?.(canvas.toDataURL("image/png"));
  };

  return (
    <div ref={ref} className={cx("msr-ImageCropper", className)} {...rest}>
      <div
        className="msr-ImageCropper__viewport"
        data-round={round || undefined}
        style={{ width: size, height: size }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          className="msr-ImageCropper__img"
          style={{ width: dispW, height: dispH, transform: `translate(${offset.x}px, ${offset.y}px)` }}
          onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
        />
        <div className="msr-ImageCropper__frame" data-round={round || undefined} />
      </div>

      <div className="msr-ImageCropper__controls">
        <input
          type="range"
          className="msr-ImageCropper__zoom"
          min={1}
          max={maxZoom}
          step={0.01}
          value={zoom}
          aria-label="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        {showApply && (
          <button type="button" className="msr-ImageCropper__apply" onClick={cropToDataURL}>
            {applyLabel}
          </button>
        )}
      </div>
    </div>
  );
});
