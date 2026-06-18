import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedCounter } from "./AnimatedCounter/AnimatedCounter";
import { CountdownTimer } from "./CountdownTimer/CountdownTimer";
import { AnimatedThemeToggle } from "./AnimatedThemeToggle/AnimatedThemeToggle";

describe("AnimatedCounter", () => {
  it("renders a formatted number with prefix/suffix", () => {
    render(<AnimatedCounter value={1234} prefix="$" suffix="k" data-testid="c" />);
    // spring may not have settled, but format/prefix/suffix should be present
    expect(screen.getByTestId("c").textContent).toMatch(/^\$[\d,]+k$/);
  });
});

describe("CountdownTimer", () => {
  it("renders timer segments", () => {
    render(<CountdownTimer seconds={90} autoStart={false} />);
    expect(screen.getByRole("timer")).toBeInTheDocument();
    // 90s with no days -> shows min/sec segments
    expect(screen.getByText("sec")).toBeInTheDocument();
  });
});

describe("AnimatedThemeToggle", () => {
  it("acts as a switch and toggles when controlled", async () => {
    let dark = false;
    const { rerender } = render(
      <AnimatedThemeToggle dark={dark} onToggle={(d) => (dark = d)} />,
    );
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
    rerender(<AnimatedThemeToggle dark onToggle={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
});
