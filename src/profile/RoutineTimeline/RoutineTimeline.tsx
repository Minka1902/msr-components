import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { ActivityTimeline, type ActivityItem } from "../../dashboard/ActivityTimeline/ActivityTimeline";
import type { BadgeTone } from "../../components/StatusBadge/StatusBadge";

export type RoutineKind = "eat" | "drink" | "walk" | "train" | "vet" | "sleep" | "play";

export interface RoutineEvent {
  id: string;
  kind: RoutineKind;
  title?: React.ReactNode;
  note?: React.ReactNode;
  time?: React.ReactNode;
}

export interface RoutineTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: RoutineEvent[];
  dense?: boolean;
}

const KIND: Record<RoutineKind, { icon: IconName; label: string; tone: BadgeTone }> = {
  eat: { icon: "heart", label: "Meal", tone: "success" },
  drink: { icon: "heart", label: "Water", tone: "info" },
  walk: { icon: "mapPin", label: "Walk", tone: "info" },
  train: { icon: "star", label: "Training", tone: "processing" },
  vet: { icon: "stethoscope", label: "Vet", tone: "danger" },
  sleep: { icon: "clock", label: "Sleep", tone: "muted" },
  play: { icon: "play", label: "Play", tone: "warning" },
};

/** A dog's daily routine as a vertical timeline (built on ActivityTimeline). */
export const RoutineTimeline = React.forwardRef<HTMLDivElement, RoutineTimelineProps>(
  function RoutineTimeline({ events, dense, className, ...rest }, ref) {
    const items: ActivityItem[] = events.map((e) => {
      const meta = KIND[e.kind];
      return {
        id: e.id,
        title: e.title ?? meta.label,
        description: e.note,
        timestamp: e.time,
        tone: meta.tone,
        icon: <Icon name={meta.icon} size={14} />,
      };
    });
    return (
      <div ref={ref} className={cx("msr-Routine", className)} {...rest}>
        <ActivityTimeline items={items} dense={dense} />
      </div>
    );
  },
);
