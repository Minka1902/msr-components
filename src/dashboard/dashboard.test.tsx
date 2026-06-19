import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HealthScoreCard } from "./HealthScoreCard/HealthScoreCard";
import { NotificationCenter } from "./NotificationCenter/NotificationCenter";

describe("HealthScoreCard", () => {
  it("renders the score and breakdown factors", () => {
    render(
      <HealthScoreCard
        score={72}
        grade="Good"
        breakdown={[{ label: "Completeness", value: 80, tone: "success" }]}
      />,
    );
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Completeness")).toBeInTheDocument();
  });
});

describe("NotificationCenter", () => {
  it("shows unread count and opens the panel", async () => {
    render(
      <NotificationCenter
        notifications={[
          { id: "1", title: "Scan finished", read: false },
          { id: "2", title: "Report ready", read: true },
        ]}
      />,
    );
    const bell = screen.getByRole("button", { name: /Notifications/ });
    expect(bell).toHaveTextContent("1");
    await userEvent.click(bell);
    expect(screen.getByText("Scan finished")).toBeInTheDocument();
  });

  it("fires mark-all-read", async () => {
    const onMarkAllRead = vi.fn();
    render(
      <NotificationCenter
        notifications={[{ id: "1", title: "X", read: false }]}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    await userEvent.click(screen.getByRole("button", { name: "Mark all read" }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });
});
