import * as React from "react";
import { cx } from "../../lib/cx";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "square";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials, then `fallback`, if absent or it fails. */
  src?: string;
  /** Name used to derive initials and for the accessible label. */
  name?: string;
  /** Node rendered when there is no image and no name (e.g. an icon). */
  fallback?: React.ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Image / initials / fallback avatar. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, fallback, size = "md", shape = "circle", className, ...rest },
  ref,
) {
  const [failed, setFailed] = React.useState(false);
  const showImage = src && !failed;

  return (
    <span
      ref={ref}
      className={cx("msr-Avatar", className)}
      data-size={size}
      data-shape={shape}
      role="img"
      aria-label={name}
      title={name}
      {...rest}
    >
      {showImage ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : name ? (
        <span className="msr-Avatar__initials">{getInitials(name)}</span>
      ) : (
        fallback
      )}
    </span>
  );
});
