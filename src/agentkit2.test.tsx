import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  CitationList,
  ResponseFeedback,
  SuggestedPrompts,
  MessageActions,
  ConversationList,
  CostEstimator,
  ConfidenceMeter,
  LatencyBadge,
  RateLimitBanner,
  UsageMeter,
  KeyValueEditor,
  EnvVarEditor,
  HeadersEditor,
} from "./index";

describe("AgentChat", () => {
  it("CitationList renders numbered sources", () => {
    render(
      <CitationList
        citations={[
          { id: "1", title: "Docs", url: "https://x.com", snippet: "hello" },
          { id: "2", title: "Wiki" },
        ]}
      />,
    );
    expect(screen.getByText("2 sources")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("ResponseFeedback toggles and asks reason on down", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ResponseFeedback value={null} onChange={onChange} askReason />,
    );
    fireEvent.click(screen.getByLabelText("Bad response"));
    expect(onChange).toHaveBeenCalledWith("down");
    rerender(<ResponseFeedback value="down" onChange={onChange} askReason />);
    expect(
      screen.getByPlaceholderText("What went wrong? (optional)"),
    ).toBeInTheDocument();
  });

  it("SuggestedPrompts emits value", () => {
    const onSelect = vi.fn();
    render(
      <SuggestedPrompts prompts={["Summarize this"]} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByText("Summarize this"));
    expect(onSelect).toHaveBeenCalledWith("Summarize this");
  });

  it("MessageActions fires regenerate", () => {
    const onRegenerate = vi.fn();
    render(<MessageActions onRegenerate={onRegenerate} />);
    fireEvent.click(screen.getByLabelText("Regenerate"));
    expect(onRegenerate).toHaveBeenCalled();
  });

  it("ConversationList selects and creates", () => {
    const onSelect = vi.fn();
    const onNew = vi.fn();
    render(
      <ConversationList
        conversations={[{ id: "a", title: "First chat" }]}
        onSelect={onSelect}
        onNew={onNew}
      />,
    );
    fireEvent.click(screen.getByText("First chat"));
    expect(onSelect).toHaveBeenCalledWith("a");
    fireEvent.click(screen.getByText("+ New chat"));
    expect(onNew).toHaveBeenCalled();
  });
});

describe("Observability", () => {
  it("CostEstimator totals line items", () => {
    render(
      <CostEstimator
        precision={2}
        items={[
          { label: "Input", units: 1000, unitPrice: 0.001 },
          { label: "Output", units: 500, unitPrice: 0.002 },
        ]}
      />,
    );
    // 1000*0.001 + 500*0.002 = 1 + 1 = 2.00
    expect(screen.getByText("$2.00")).toBeInTheDocument();
  });

  it("ConfidenceMeter exposes meter role with value", () => {
    render(<ConfidenceMeter value={0.8} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "80");
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("LatencyBadge formats and color-codes", () => {
    const { rerender } = render(<LatencyBadge ms={250} />);
    expect(screen.getByText("250ms")).toBeInTheDocument();
    rerender(<LatencyBadge ms={4000} />);
    expect(screen.getByText("4.00s")).toBeInTheDocument();
  });

  it("RateLimitBanner alerts when exceeded", () => {
    render(<RateLimitBanner remaining={0} limit={100} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Rate limit reached.");
  });

  it("UsageMeter shows used/limit", () => {
    render(<UsageMeter used={80} limit={100} label="Seats" />);
    expect(screen.getByText("80 / 100")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "80",
    );
  });
});

describe("KeyValueEditor", () => {
  it("KeyValueEditor adds and edits rows", () => {
    const onChange = vi.fn();
    render(
      <KeyValueEditor
        pairs={[{ key: "a", value: "1" }]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("+ Add row"));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toHaveLength(2);
  });

  it("KeyValueEditor masks secret values", () => {
    render(
      <KeyValueEditor
        pairs={[{ key: "TOKEN", value: "abc", secret: true }]}
        onChange={() => {}}
        allowSecret
      />,
    );
    const value = screen.getByDisplayValue("abc") as HTMLInputElement;
    expect(value.type).toBe("password");
    fireEvent.click(screen.getByLabelText("Reveal value"));
    expect((screen.getByDisplayValue("abc") as HTMLInputElement).type).toBe(
      "text",
    );
  });

  it("EnvVarEditor imports a pasted .env blob", () => {
    const onChange = vi.fn();
    render(<EnvVarEditor vars={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Paste .env"));
    fireEvent.change(
      screen.getByPlaceholderText(/KEY=value/),
      { target: { value: "API_TOKEN=secret123\nDEBUG=true" } },
    );
    fireEvent.click(screen.getByText("Import"));
    expect(onChange).toHaveBeenCalled();
    const imported = onChange.mock.calls[0][0];
    expect(imported).toEqual([
      { key: "API_TOKEN", value: "secret123", secret: true },
      { key: "DEBUG", value: "true", secret: false },
    ]);
  });

  it("HeadersEditor adds a header", () => {
    const onChange = vi.fn();
    render(<HeadersEditor headers={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add header"));
    expect(onChange).toHaveBeenCalledWith([
      { name: "", value: "", enabled: true },
    ]);
  });
});
