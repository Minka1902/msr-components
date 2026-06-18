import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberStepper } from "./NumberStepper/NumberStepper";
import { RatingStars } from "./RatingStars/RatingStars";
import { ToggleGroup } from "./ToggleGroup/ToggleGroup";
import { TagInput } from "./TagInput/TagInput";
import { PinInput } from "./PinInput/PinInput";

describe("NumberStepper", () => {
  it("increments/decrements and clamps to min", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={0} min={0} max={3} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole("button", { name: "Decrease" })).not.toBeDisabled();
  });
});

describe("RatingStars", () => {
  it("sets a rating on click", async () => {
    const onValueChange = vi.fn();
    render(<RatingStars defaultValue={0} onValueChange={onValueChange} />);
    const container = screen.getByRole("slider");
    const starEls = container.querySelectorAll(".msr-Rating__star");
    await userEvent.click(starEls[2] as Element);
    expect(onValueChange).toHaveBeenCalledWith(3);
  });
});

describe("ToggleGroup", () => {
  it("toggles single selection", async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        options={[
          { value: "b", label: "Bold" },
          { value: "i", label: "Italic" },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
});

describe("TagInput", () => {
  it("adds a tag on Enter and removes on Backspace", async () => {
    const onValueChange = vi.fn();
    render(<TagInput defaultValue={[]} onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "react{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["react"]);
  });
});

describe("PinInput", () => {
  it("fires onComplete when all cells are filled", async () => {
    const onComplete = vi.fn();
    render(<PinInput length={4} onComplete={onComplete} />);
    const cells = screen.getAllByRole("textbox");
    await userEvent.click(cells[0]);
    await userEvent.keyboard("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });
});
