import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatMessage, ToolCallCard, TokenUsageMeter } from "./Chat";
import { PromptInput } from "./PromptInput";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

describe("ChatMessage", () => {
  it("renders role and a streaming caret", () => {
    const { container } = render(<ChatMessage role="assistant" streaming>Hi</ChatMessage>);
    expect(container.querySelector('.msr-ChatMsg[data-role="assistant"]')).toBeTruthy();
    expect(container.querySelector(".msr-ChatMsg__caret")).toBeTruthy();
  });
});

describe("ToolCallCard", () => {
  it("expands to show input/output", async () => {
    render(<ToolCallCard name="search" input="{q:1}" output="ok" />);
    expect(screen.queryByText("Input")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /search/ }));
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});

describe("TokenUsageMeter", () => {
  it("flags danger tone when near the limit", () => {
    const { container } = render(<TokenUsageMeter used={95} max={100} />);
    expect(container.querySelector('.msr-TokenMeter[data-tone="danger"]')).toBeTruthy();
  });
});

describe("PromptInput", () => {
  it("submits via Ctrl+Enter and clears (uncontrolled)", async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);
    const ta = screen.getByRole("textbox");
    await userEvent.type(ta, "hello");
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    expect(onSubmit).toHaveBeenCalledWith("hello");
  });

  it("disables send when empty", () => {
    render(<PromptInput />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});

describe("MarkdownRenderer", () => {
  it("renders headings, bold, links and code", () => {
    const { container } = render(
      <MarkdownRenderer>{"# Title\n\nSome **bold** and `code` and [link](https://x.com)"}</MarkdownRenderer>,
    );
    expect(container.querySelector("h1")).toHaveTextContent("Title");
    expect(container.querySelector("strong")).toHaveTextContent("bold");
    expect(container.querySelector("a.msr-Markdown__link")).toHaveAttribute("href", "https://x.com");
  });

  it("renders fenced code via CopyableCodeBlock", () => {
    const { container } = render(
      <MarkdownRenderer>{"```js\nconst a = 1;\n```"}</MarkdownRenderer>,
    );
    expect(container.querySelector(".msr-CodeBlock")).toBeTruthy();
  });
});
