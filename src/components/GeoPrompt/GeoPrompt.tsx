import * as React from "react";
import { useGeolocation } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface GeoPromptProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: string;
  /** Called with coordinates once resolved. */
  onLocated?: (coords: { latitude: number; longitude: number; accuracy: number | null }) => void;
}

/** Card that requests and displays the user's location (uses useGeolocation). */
export const GeoPrompt = React.forwardRef<HTMLDivElement, GeoPromptProps>(function GeoPrompt(
  { title = "Share your location", description = "We'll use it to show nearby results.", buttonLabel = "Use my location", onLocated, className, ...rest },
  ref,
) {
  const [active, setActive] = React.useState(false);
  const geo = useGeolocation();
  const notified = React.useRef(false);

  React.useEffect(() => {
    if (active && geo.latitude != null && geo.longitude != null && !notified.current) {
      notified.current = true;
      onLocated?.({ latitude: geo.latitude, longitude: geo.longitude, accuracy: geo.accuracy });
    }
  }, [active, geo.latitude, geo.longitude, geo.accuracy, onLocated]);

  const located = geo.latitude != null && geo.longitude != null;

  return (
    <div ref={ref} className={cx("msr-GeoPrompt", className)} {...rest}>
      <span className="msr-GeoPrompt__icon"><Icon name="mapPin" size={20} /></span>
      <div className="msr-GeoPrompt__body">
        <div className="msr-GeoPrompt__title">{title}</div>
        {active && located ? (
          <div className="msr-GeoPrompt__coords">
            {geo.latitude!.toFixed(4)}, {geo.longitude!.toFixed(4)}
            {geo.accuracy != null && <span className="msr-GeoPrompt__acc"> · ±{Math.round(geo.accuracy)}m</span>}
          </div>
        ) : active && geo.error ? (
          <div className="msr-GeoPrompt__error">{"message" in geo.error ? geo.error.message : "Location unavailable"}</div>
        ) : (
          <div className="msr-GeoPrompt__desc">{description}</div>
        )}
      </div>
      {!located && (
        <button
          type="button"
          className="msr-GeoPrompt__btn"
          disabled={active && geo.loading}
          onClick={() => setActive(true)}
        >
          {active && geo.loading ? "Locating…" : buttonLabel}
        </button>
      )}
    </div>
  );
});
