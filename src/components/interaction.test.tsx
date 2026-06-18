import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "./Carousel/Carousel";
import { PasswordInput } from "./PasswordInput/PasswordInput";
import { DiffViewer } from "./DiffViewer/DiffViewer";

describe("Carousel", () => {
  it("advances to the next slide via the arrow", async () => {
    const onIndexChange = vi.fn();
    render(
      <Carousel onIndexChange={onIndexChange}>
        <div>Slide A</div>
        <div>Slide B</div>
      </Carousel>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});

describe("PasswordInput", () => {
  it("toggles visibility and scores strength", async () => {
    render(<PasswordInput showStrength aria-label="pw" />);
    const input = screen.getByLabelText("pw");
    expect(input).toHaveAttribute("type", "password");
    await userEvent.type(input, "Abcd1234!");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });
});

describe("DiffViewer", () => {
  it("computes added/removed line counts", () => {
    render(<DiffViewer oldText={"a\nb\nc"} newText={"a\nB\nc\nd"} />);
    // 'b' -> removed, 'B' and 'd' -> added
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("−1")).toBeInTheDocument();
  });
});
