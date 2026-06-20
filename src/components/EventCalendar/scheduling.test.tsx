import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { EventCalendar } from "./EventCalendar";
import { MiniCalendar } from "../MiniCalendar/MiniCalendar";
import { TimePicker } from "../TimePicker/TimePicker";
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import { Scheduler } from "../Scheduler/Scheduler";

const JAN_2026 = new Date(2026, 0, 15);

describe("EventCalendar", () => {
  it("renders events on their day and fires onSelect / onEventClick", async () => {
    const onSelect = vi.fn();
    const onEventClick = vi.fn();
    render(
      <EventCalendar
        month={JAN_2026}
        events={[{ id: "a", date: new Date(2026, 0, 15), title: "Standup", tone: "success" }]}
        onSelect={onSelect}
        onEventClick={onEventClick}
      />,
    );
    const event = screen.getByText("Standup");
    await userEvent.click(event);
    expect(onEventClick).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));

    await userEvent.click(screen.getAllByText("15")[0]);
    expect(onSelect).toHaveBeenCalled();
  });

  it("navigates months", async () => {
    render(<EventCalendar defaultMonth={JAN_2026} />);
    expect(screen.getByText("January 2026")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Next month"));
    expect(screen.getByText("February 2026")).toBeInTheDocument();
  });
});

describe("MiniCalendar", () => {
  it("selects a day", async () => {
    const onChange = vi.fn();
    render(<MiniCalendar defaultValue={JAN_2026} onChange={onChange} />);
    await userEvent.click(screen.getAllByText("20")[0]);
    expect(onChange).toHaveBeenCalled();
  });
});

describe("TimePicker", () => {
  it("opens and picks a stepped time", async () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} step={60} min={540} max={600} />);
    await userEvent.click(screen.getByRole("button", { name: /select time/i }));
    await userEvent.click(screen.getByRole("option", { name: "09:00" }));
    expect(onChange).toHaveBeenCalledWith(540);
  });
});

describe("DateRangePicker", () => {
  it("picks a start then end across panels", async () => {
    const onChange = vi.fn();
    render(<DateRangePicker defaultValue={{ start: null, end: null }} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /select range/i }));
    const cells = screen.getAllByRole("gridcell");
    await userEvent.click(cells[10]);
    await userEvent.click(cells[15]);
    expect(onChange).toHaveBeenCalled();
  });
});

describe("Scheduler", () => {
  it("positions an event and has no obvious a11y violations", async () => {
    const { container } = render(
      <Scheduler
        view="day"
        date={JAN_2026}
        events={[
          {
            id: "e1",
            title: "Review",
            start: new Date(2026, 0, 15, 9, 0),
            end: new Date(2026, 0, 15, 10, 0),
          },
        ]}
      />,
    );
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
