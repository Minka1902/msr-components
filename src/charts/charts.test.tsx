import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Sparkline } from "./Sparkline";
import { DonutChart } from "./DonutChart";
import { RadialProgress } from "./RadialProgress";
import { ProgressBar } from "./ProgressBar";

describe("charts", () => {
  it("Sparkline renders an SVG path for >=2 points and nothing for <2", () => {
    const { container, rerender } = render(<Sparkline data={[1, 5, 3, 8]} />);
    expect(container.querySelector("path.msr-Sparkline__line")).toBeTruthy();
    rerender(<Sparkline data={[1]} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("DonutChart renders one arc per segment", () => {
    const { container } = render(
      <DonutChart
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 70 },
        ]}
      />,
    );
    // 1 track circle + 2 segment circles
    expect(container.querySelectorAll("circle").length).toBe(3);
  });

  it("RadialProgress exposes progressbar semantics", () => {
    const { getByRole } = render(<RadialProgress value={42} />);
    const bar = getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "42");
  });

  it("ProgressBar is indeterminate when value is null", () => {
    const { container } = render(<ProgressBar value={null} />);
    expect(container.querySelector(".msr-Progress[data-indeterminate]")).toBeTruthy();
  });
});
