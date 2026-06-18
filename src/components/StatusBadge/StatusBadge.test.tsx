import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders content and tone/variant attributes", () => {
    render(
      <StatusBadge tone="success" variant="solid">
        Done
      </StatusBadge>,
    );
    const badge = screen.getByText("Done");
    expect(badge).toHaveAttribute("data-tone", "success");
    expect(badge).toHaveAttribute("data-variant", "solid");
  });

  it("renders a pulsing dot for the processing tone", () => {
    const { container } = render(
      <StatusBadge tone="processing" dot>
        Working
      </StatusBadge>,
    );
    const dot = container.querySelector(".msr-StatusBadge__dot");
    expect(dot).toHaveAttribute("data-pulse");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<StatusBadge tone="info">Info</StatusBadge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
