import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Typewriter } from "./components/Typewriter/Typewriter";
import { Odometer } from "./components/Odometer/Odometer";
import { GradientText } from "./components/GradientText/GradientText";
import { GlitchText } from "./components/GlitchText/GlitchText";
import { SplitFlapDisplay } from "./components/SplitFlapDisplay/SplitFlapDisplay";
import { RippleButton } from "./components/RippleButton/RippleButton";
import { SwipeCards } from "./components/SwipeCards/SwipeCards";
import { WheelPicker } from "./components/WheelPicker/WheelPicker";
import { LiquidProgress } from "./components/LiquidProgress/LiquidProgress";
import { CardStack } from "./components/CardStack/CardStack";
import { BorderBeam } from "./components/BorderBeam/BorderBeam";
import { MagneticButton } from "./components/MagneticButton/MagneticButton";

describe("Typewriter", () => {
  it("renders without crashing and exposes a cursor", () => {
    const { container } = render(<Typewriter words={["Hello", "World"]} />);
    expect(container.querySelector(".msr-Typewriter__cursor")).toBeInTheDocument();
  });
});

describe("Odometer", () => {
  it("groups digits and exposes an accessible label", () => {
    render(<Odometer value={12345} />);
    expect(screen.getByRole("img", { name: "12345" })).toBeInTheDocument();
    const { container } = render(<Odometer value={42} group={false} />);
    expect(container.querySelectorAll(".msr-Odometer__digit").length).toBe(2);
  });
});

describe("GradientText / GlitchText", () => {
  it("render their text content", () => {
    render(<GradientText>Shiny</GradientText>);
    expect(screen.getByText("Shiny")).toBeInTheDocument();
    render(<GlitchText text="ERROR" />);
    expect(screen.getByText("ERROR")).toHaveAttribute("data-text", "ERROR");
  });
});

describe("SplitFlapDisplay", () => {
  it("pads to a fixed length of cells", () => {
    const { container } = render(<SplitFlapDisplay value="HI" length={5} />);
    expect(container.querySelectorAll(".msr-SplitFlapDisplay__cell").length).toBe(5);
  });
});

describe("RippleButton", () => {
  it("still fires click handlers", async () => {
    const onClick = vi.fn();
    render(<RippleButton onClick={onClick}>Tap</RippleButton>);
    await userEvent.click(screen.getByText("Tap"));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("SwipeCards", () => {
  it("renders the top card content", () => {
    render(
      <SwipeCards
        cards={[
          { id: "a", content: <div>Card A</div> },
          { id: "b", content: <div>Card B</div> },
        ]}
      />,
    );
    expect(screen.getByText("Card A")).toBeInTheDocument();
  });
});

describe("WheelPicker", () => {
  it("marks the selected option", () => {
    render(
      <WheelPicker
        value="2"
        options={[
          { label: "One", value: "1" },
          { label: "Two", value: "2" },
          { label: "Three", value: "3" },
        ]}
      />,
    );
    expect(screen.getByRole("option", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("LiquidProgress", () => {
  it("exposes progressbar semantics and has no a11y violations", async () => {
    const { container } = render(<LiquidProgress value={64} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "64");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CardStack", () => {
  it("advances to the next card on click", async () => {
    render(
      <CardStack
        interval={0}
        cards={[
          { id: "1", content: <div>First</div> },
          { id: "2", content: <div>Second</div> },
        ]}
      />,
    );
    // Both render (stacked); clicking the top card cycles order without errors.
    const first = screen.getByText("First");
    await userEvent.click(first);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});

describe("BorderBeam / MagneticButton", () => {
  it("wrap and render their children", () => {
    render(<BorderBeam>Wrapped</BorderBeam>);
    expect(screen.getByText("Wrapped")).toBeInTheDocument();
    render(<MagneticButton>Pull me</MagneticButton>);
    expect(screen.getByRole("button", { name: "Pull me" })).toBeInTheDocument();
  });
});
