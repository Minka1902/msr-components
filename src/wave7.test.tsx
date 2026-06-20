import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Kbd } from "./components/Kbd/Kbd";
import { NotificationBadge } from "./components/NotificationBadge/NotificationBadge";
import { Tooltip } from "./components/Tooltip/Tooltip";
import { Popconfirm } from "./components/Popconfirm/Popconfirm";
import { CreditCardInput } from "./components/CreditCardInput/CreditCardInput";
import { Barcode } from "./components/Barcode/Barcode";
import { BottomNavigation } from "./components/BottomNavigation/BottomNavigation";
import { Dock } from "./components/Dock/Dock";
import { CalendarHeatmap } from "./charts/CalendarHeatmap/CalendarHeatmap";
import { Gantt } from "./charts/Gantt/Gantt";

describe("Kbd", () => {
  it("splits a shortcut into keycaps with aliases", () => {
    render(<Kbd keys="Ctrl+K" />);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });
});

describe("NotificationBadge", () => {
  it("caps the count and hides at zero", () => {
    const { rerender } = render(<NotificationBadge count={150} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
    rerender(<NotificationBadge count={0} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});

describe("Tooltip", () => {
  it("shows content on focus", async () => {
    render(
      <Tooltip content="Hello tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    screen.getByText("Trigger").focus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Hello tip");
  });
});

describe("Popconfirm", () => {
  it("opens and confirms", async () => {
    const onConfirm = vi.fn();
    render(
      <Popconfirm title="Delete this?" onConfirm={onConfirm}>
        <button>Delete</button>
      </Popconfirm>,
    );
    await userEvent.click(screen.getByText("Delete"));
    expect(await screen.findByRole("dialog")).toHaveTextContent("Delete this?");
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

describe("CreditCardInput", () => {
  it("formats the number and detects the brand", async () => {
    const onChange = vi.fn();
    render(<CreditCardInput onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Card number"), "4111111111111111");
    expect(screen.getByLabelText("Card number")).toHaveValue("4111 1111 1111 1111");
    expect(screen.getByText("VISA")).toBeInTheDocument();
    const lastCall = onChange.mock.calls.at(-1);
    // Number passes Luhn, but the card is not "valid" until expiry + cvc are filled.
    expect(lastCall?.[1]).toMatchObject({ brand: "visa", valid: false });
  });
});

describe("Barcode", () => {
  it("renders Code 39 bars and is accessible", async () => {
    const { container } = render(<Barcode value="ABC-123" />);
    expect(container.querySelectorAll("rect").length).toBeGreaterThan(10);
    expect(screen.getByRole("img", { name: /ABC-123/ })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("BottomNavigation", () => {
  it("selects an item", async () => {
    const onChange = vi.fn();
    render(
      <BottomNavigation
        defaultValue="home"
        onChange={onChange}
        items={[
          { id: "home", label: "Home", icon: "folder" },
          { id: "search", label: "Search", icon: "search" },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Search/ }));
    expect(onChange).toHaveBeenCalledWith("search");
  });
});

describe("Dock", () => {
  it("fires onClick for an item", async () => {
    const onClick = vi.fn();
    render(<Dock items={[{ id: "a", label: "Files", icon: "folder", onClick }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Files" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("CalendarHeatmap", () => {
  it("renders a cell per day in range", () => {
    const { container } = render(
      <CalendarHeatmap
        startDate={new Date(2026, 0, 1)}
        endDate={new Date(2026, 0, 7)}
        values={[{ date: new Date(2026, 0, 3), count: 5 }]}
      />,
    );
    expect(container.querySelectorAll(".msr-CalendarHeatmap__cell").length).toBe(7);
  });
});

describe("Gantt", () => {
  it("renders a bar per task", () => {
    const { container } = render(
      <Gantt
        tasks={[
          { id: "1", label: "Design", start: new Date(2026, 0, 1), end: new Date(2026, 0, 10), progress: 0.5 },
          { id: "2", label: "Build", start: new Date(2026, 0, 8), end: new Date(2026, 0, 20) },
        ]}
      />,
    );
    expect(container.querySelectorAll(".msr-Gantt__bar").length).toBe(2);
    expect(screen.getByText("Design")).toBeInTheDocument();
  });
});
