import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("toggles and reports state via onCheckedChange (uncontrolled)", async () => {
    const onChange = vi.fn();
    render(<Switch defaultChecked={false} onCheckedChange={onChange} aria-label="wifi" />);
    const sw = screen.getByRole("switch", { name: "wifi" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("respects the controlled `checked` prop", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} aria-label="x" />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    // stays false because controlled value did not change
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Switch aria-label="toggle" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
