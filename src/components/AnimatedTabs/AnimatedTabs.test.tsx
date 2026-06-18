import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnimatedTabs } from "./AnimatedTabs";

const items = [
  { value: "a", label: "First" },
  { value: "b", label: "Second" },
  { value: "c", label: "Third" },
];

describe("AnimatedTabs", () => {
  it("selects a tab on click and renders its panel", async () => {
    const onValueChange = vi.fn();
    render(
      <AnimatedTabs
        items={items}
        defaultValue="a"
        onValueChange={onValueChange}
        panels={{ a: "Panel A", b: "Panel B", c: "Panel C" }}
      />,
    );
    expect(screen.getByText("Panel A")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Second" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByText("Panel B")).toBeInTheDocument();
  });

  it("moves selection with arrow keys", async () => {
    render(<AnimatedTabs items={items} defaultValue="a" />);
    const first = screen.getByRole("tab", { name: "First" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
