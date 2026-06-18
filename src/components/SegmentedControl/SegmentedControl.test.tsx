import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
];

describe("SegmentedControl", () => {
  it("selects an option and reports the change", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={options} defaultValue="list" onValueChange={onValueChange} />);
    const grid = screen.getByRole("tab", { name: "Grid" });
    expect(screen.getByRole("tab", { name: "List" })).toHaveAttribute("aria-selected", "true");
    await userEvent.click(grid);
    expect(onValueChange).toHaveBeenCalledWith("grid");
    expect(grid).toHaveAttribute("aria-selected", "true");
  });
});
