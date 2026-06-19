import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { RelativeTime } from "../../components/Text/Text";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";

export type TrackerStatus = "online" | "offline" | "lost";

export interface DogTrackerMapCardProps extends React.HTMLAttributes<HTMLDivElement> {
  latitude: number;
  longitude: number;
  lastSeen?: Date | number | string;
  /** Battery percentage 0–100. */
  battery?: number;
  status?: TrackerStatus;
  /** Optional static map image URL. */
  mapImageUrl?: string;
  locationLabel?: React.ReactNode;
}

const STATUS_TONE = { online: "success", offline: "muted", lost: "danger" } as const;

/** GPS tracker card: location, last seen, battery, tracker status. */
export const DogTrackerMapCard = React.forwardRef<HTMLDivElement, DogTrackerMapCardProps>(
  function DogTrackerMapCard(
    { latitude, longitude, lastSeen, battery, status = "online", mapImageUrl, locationLabel, className, ...rest },
    ref,
  ) {
    const batteryTone = battery == null ? "muted" : battery <= 15 ? "danger" : battery <= 35 ? "warning" : "success";
    return (
      <div ref={ref} className={cx("msr-Tracker", className)} {...rest}>
        <div className="msr-Tracker__map">
          {mapImageUrl ? (
            <img src={mapImageUrl} alt="Map" />
          ) : (
            <div className="msr-Tracker__map-placeholder" aria-hidden="true">
              <Icon name="map" size={28} />
            </div>
          )}
          <span className="msr-Tracker__pin" data-status={status}>
            <Icon name="mapPin" size={20} />
          </span>
        </div>
        <div className="msr-Tracker__body">
          <div className="msr-Tracker__row">
            <StatusBadge tone={STATUS_TONE[status]} variant="soft" size="sm" dot>{status}</StatusBadge>
            {battery != null && (
              <span className="msr-Tracker__battery" data-tone={batteryTone}>
                <Icon name="battery" size={14} /> {Math.round(battery)}%
              </span>
            )}
          </div>
          <div className="msr-Tracker__loc">
            <Icon name="mapPin" size={13} />
            {locationLabel ?? <code>{latitude.toFixed(4)}, {longitude.toFixed(4)}</code>}
          </div>
          {lastSeen != null && (
            <div className="msr-Tracker__seen">
              <Icon name="clock" size={13} /> Last seen <RelativeTime date={lastSeen} />
            </div>
          )}
        </div>
      </div>
    );
  },
);
