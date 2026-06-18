import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Highlight, RelativeTime } from "./Text";

describe("Highlight", () => {
  it("wraps matching terms in <mark> (case-insensitive)", () => {
    const { container } = render(<Highlight query="fox">The quick Fox</Highlight>);
    const marks = container.querySelectorAll("mark.msr-Highlight");
    expect(marks.length).toBe(1);
    expect(marks[0].textContent).toBe("Fox");
  });

  it("renders plain text when query is empty", () => {
    const { container } = render(<Highlight query="">hello</Highlight>);
    expect(container.querySelectorAll("mark").length).toBe(0);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});

describe("RelativeTime", () => {
  it("renders a relative string with an ISO dateTime attribute", () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    render(<RelativeTime date={tenMinAgo} updateInterval={0} />);
    const el = screen.getByText(/ago/);
    expect(el.tagName).toBe("TIME");
    expect(el).toHaveAttribute("dateTime", tenMinAgo.toISOString());
  });
});
