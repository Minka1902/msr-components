import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  TrendIndicator,
  MetricCard,
  StatComparison,
  KpiGrid,
  StatusDot,
  HealthIndicator,
  ServiceStatusList,
  Heartbeat,
  IncidentBanner,
  NotificationItem,
  NotificationCenter,
  AnnouncementBanner,
} from "./index";

describe("Metrics", () => {
  it("TrendIndicator color-codes direction and respects invert", () => {
    const { rerender, container } = render(<TrendIndicator delta={5} percent />);
    expect(screen.getByText("5.0%")).toBeInTheDocument();
    expect(container.querySelector('[data-tone="good"]')).toBeInTheDocument();
    // negative delta is normally "bad"
    rerender(<TrendIndicator delta={-5} percent />);
    expect(container.querySelector('[data-tone="bad"]')).toBeInTheDocument();
    // inverted: a decrease is "good" (e.g. error rate down)
    rerender(<TrendIndicator delta={-5} percent invert />);
    expect(container.querySelector('[data-tone="good"]')).toBeInTheDocument();
  });

  it("MetricCard renders value, trend and sparkline", () => {
    const { container } = render(
      <MetricCard
        label="Revenue"
        value="$12.4k"
        delta={8.2}
        deltaPercent
        sparkline={[1, 3, 2, 5, 4, 6]}
      />,
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$12.4k")).toBeInTheDocument();
    expect(screen.getByText("8.2%")).toBeInTheDocument();
    expect(container.querySelector(".msr-Metric__spark path")).toBeInTheDocument();
  });

  it("StatComparison computes percent change", () => {
    render(<StatComparison label="Signups" current={120} previous={100} />);
    expect(screen.getByText("120")).toBeInTheDocument();
    // (120-100)/100 = 20%
    expect(screen.getByText("20.0%")).toBeInTheDocument();
  });

  it("KpiGrid sets responsive columns", () => {
    const { container } = render(
      <KpiGrid minColumnWidth={240}>
        <div>a</div>
      </KpiGrid>,
    );
    const grid = container.querySelector(".msr-KpiGrid") as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain("240px");
  });
});

describe("StatusIndicators", () => {
  it("StatusDot applies tone and pulse", () => {
    const { container } = render(
      <StatusDot tone="online" label="Online" pulse />,
    );
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(
      container.querySelector('.msr-StatusDot[data-tone="online"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".msr-StatusDot__dot[data-pulse]"),
    ).toBeInTheDocument();
  });

  it("HealthIndicator shows default label", () => {
    render(<HealthIndicator status="degraded" />);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  it("ServiceStatusList summarizes worst status", () => {
    render(
      <ServiceStatusList
        services={[
          { id: "1", name: "API", status: "operational" },
          { id: "2", name: "Search", status: "major-outage" },
        ]}
      />,
    );
    // worst is major-outage → summary label + the service's own pill
    expect(screen.getAllByText("Major outage").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("API")).toBeInTheDocument();
  });

  it("ServiceStatusList shows all-operational summary", () => {
    render(
      <ServiceStatusList
        services={[{ id: "1", name: "API", status: "operational" }]}
      />,
    );
    expect(screen.getByText("All systems operational")).toBeInTheDocument();
  });

  it("Heartbeat shows live and offline states", () => {
    const { rerender } = render(<Heartbeat live />);
    expect(screen.getByText("Live")).toBeInTheDocument();
    rerender(<Heartbeat live={false} />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("IncidentBanner renders severity and dismiss", () => {
    const onDismiss = vi.fn();
    render(
      <IncidentBanner title="Elevated error rates" severity="major" onDismiss={onDismiss}>
        Investigating.
      </IncidentBanner>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Elevated error rates");
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe("Notifications", () => {
  it("NotificationItem fires mark-read and dismiss", () => {
    const onMarkRead = vi.fn();
    const onDismiss = vi.fn();
    render(
      <NotificationItem
        title="New comment"
        body="Ada replied"
        tone="info"
        onMarkRead={onMarkRead}
        onDismiss={onDismiss}
      />,
    );
    fireEvent.click(screen.getByLabelText("Mark as read"));
    expect(onMarkRead).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("NotificationCenter shows unread count and mark-all", () => {
    const onMarkAllRead = vi.fn();
    render(
      <NotificationCenter
        onMarkAllRead={onMarkAllRead}
        notifications={[
          { id: "1", title: "A", read: false },
          { id: "2", title: "B", read: true },
        ]}
      />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Mark all read"));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it("NotificationCenter shows empty state", () => {
    render(<NotificationCenter notifications={[]} />);
    expect(screen.getByText("You're all caught up.")).toBeInTheDocument();
  });

  it("AnnouncementBanner renders content and dismiss", () => {
    const onDismiss = vi.fn();
    render(
      <AnnouncementBanner tone="promo" onDismiss={onDismiss}>
        50% off this week
      </AnnouncementBanner>,
    );
    expect(screen.getByText("50% off this week")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalled();
  });
});
