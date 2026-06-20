import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { OnboardingChecklist } from "../OnboardingChecklist/OnboardingChecklist";
import { VoteButtons } from "../VoteButtons/VoteButtons";
import { ReactionBar } from "../ReactionBar/ReactionBar";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";
import { CommentThread } from "../CommentThread/CommentThread";
import { ProductTour } from "./ProductTour";

describe("OnboardingChecklist", () => {
  it("shows progress and toggles tasks", async () => {
    const onToggle = vi.fn();
    render(
      <OnboardingChecklist
        tasks={[
          { id: "a", title: "Connect", done: true },
          { id: "b", title: "Invite team" },
        ]}
        onToggle={onToggle}
      />,
    );
    expect(screen.getByText("1 of 2 · 50%")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Invite team" }));
    expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: "b" }), true);
  });
});

describe("VoteButtons", () => {
  it("applies and reflects the user's vote in the score", async () => {
    const onChange = vi.fn();
    render(<VoteButtons score={10} defaultValue={0} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Upvote" }));
    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("11")).toBeInTheDocument();
  });
});

describe("ReactionBar", () => {
  it("toggles a reaction", async () => {
    const onToggle = vi.fn();
    render(<ReactionBar reactions={[{ emoji: "👍", count: 3 }]} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: /React with 👍/ }));
    expect(onToggle).toHaveBeenCalledWith("👍");
  });
});

describe("TypingIndicator", () => {
  it("summarizes who is typing", () => {
    render(<TypingIndicator users={["Ana", "Ben"]} />);
    expect(screen.getByText("Ana and Ben are typing")).toBeInTheDocument();
  });
});

describe("CommentThread", () => {
  it("submits a new comment and is accessible", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <CommentThread
        comments={[{ id: "1", author: "Ada", body: "First!", replies: [] }]}
        onSubmit={onSubmit}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText("Add a comment…"), "Hi");
    await userEvent.click(screen.getByRole("button", { name: "Post comment" }));
    expect(onSubmit).toHaveBeenCalledWith("Hi");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ProductTour", () => {
  it("renders the active step and advances", async () => {
    const onStepChange = vi.fn();
    render(
      <>
        <button id="t1">Target</button>
        <ProductTour
          open
          steps={[
            { target: "#t1", title: "Step one", content: "Hello" },
            { target: "#t1", title: "Step two", content: "World" },
          ]}
          onStepChange={onStepChange}
        />
      </>,
    );
    expect(screen.getByText("Step one")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onStepChange).toHaveBeenCalledWith(1);
  });
});
