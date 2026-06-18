import * as React from "react";
import { useNetworkStatus } from "msr-hooks";
import { Banner } from "../Alert/Alert";

export interface NetworkStatusBannerProps {
  offlineMessage?: React.ReactNode;
  onlineMessage?: React.ReactNode;
  /** Show a brief "back online" banner after reconnecting. */
  showReconnected?: boolean;
  reconnectedDuration?: number;
  sticky?: boolean;
}

/** Banner that appears when the connection drops (uses useNetworkStatus). */
export function NetworkStatusBanner({
  offlineMessage = "You're offline. Some features may be unavailable.",
  onlineMessage = "Back online.",
  showReconnected = true,
  reconnectedDuration = 3000,
  sticky = true,
}: NetworkStatusBannerProps) {
  const { online } = useNetworkStatus();
  const [reconnected, setReconnected] = React.useState(false);
  const wasOffline = React.useRef(false);

  React.useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      setReconnected(false);
    } else if (wasOffline.current) {
      wasOffline.current = false;
      if (showReconnected) {
        setReconnected(true);
        const t = setTimeout(() => setReconnected(false), reconnectedDuration);
        return () => clearTimeout(t);
      }
    }
  }, [online, showReconnected, reconnectedDuration]);

  if (!online) {
    return <Banner tone="danger" sticky={sticky}>{offlineMessage}</Banner>;
  }
  if (reconnected) {
    return <Banner tone="success" sticky={sticky}>{onlineMessage}</Banner>;
  }
  return null;
}
