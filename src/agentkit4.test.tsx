import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  formatBytes,
  FileUploader,
  UploadList,
  AttachmentChip,
  FilePreviewCard,
  PlanCard,
  BillingSummary,
  InvoiceList,
  UsageBreakdown,
  NpsSurvey,
  EmojiRating,
  SurveyForm,
  FeedbackForm,
} from "./index";

describe("FileManager", () => {
  it("formatBytes formats sizes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("FileUploader emits dropped files", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileUploader onFiles={onFiles} />);
    const zone = container.querySelector(".msr-Uploader") as HTMLElement;
    const file = new File(["x"], "a.txt", { type: "text/plain" });
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalled();
    expect(onFiles.mock.calls[0][0][0].name).toBe("a.txt");
  });

  it("UploadList shows progress and fires retry", () => {
    const onRetry = vi.fn();
    render(
      <UploadList
        onRetry={onRetry}
        uploads={[
          { id: "1", name: "ok.png", size: 2048, status: "uploading", progress: 40 },
          { id: "2", name: "bad.png", status: "error", error: "Failed" },
        ]}
      />,
    );
    expect(screen.getByText("ok.png")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Retry"));
    expect(onRetry).toHaveBeenCalledWith("2");
  });

  it("AttachmentChip removes", () => {
    const onRemove = vi.fn();
    render(<AttachmentChip name="report.pdf" size={1024} onRemove={onRemove} />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Remove report.pdf"));
    expect(onRemove).toHaveBeenCalled();
  });

  it("FilePreviewCard shows extension fallback", () => {
    render(<FilePreviewCard name="slides.key" size={4096} />);
    expect(screen.getByText("KEY")).toBeInTheDocument();
    expect(screen.getByText("slides.key")).toBeInTheDocument();
  });
});

describe("Billing", () => {
  it("PlanCard selects and disables current", () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <PlanCard
        name="Pro"
        price="$49"
        period="/mo"
        features={[{ label: "Unlimited" }, { label: "No SSO", included: false }]}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Choose plan" }));
    expect(onSelect).toHaveBeenCalled();
    rerender(<PlanCard name="Pro" price="$49" current />);
    expect(
      screen.getByRole("button", { name: "Current plan" }),
    ).toBeDisabled();
  });

  it("BillingSummary renders plan and actions", () => {
    const onManage = vi.fn();
    render(
      <BillingSummary
        planName="Pro"
        planPrice="$49/mo"
        nextInvoiceAmount="$49.00"
        onManage={onManage}
      />,
    );
    expect(screen.getByText("Pro")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Manage billing"));
    expect(onManage).toHaveBeenCalled();
  });

  it("InvoiceList renders rows and statuses", () => {
    render(
      <InvoiceList
        invoices={[
          {
            id: "in_1",
            number: "INV-001",
            date: "2026-01-01",
            amount: "$49.00",
            status: "paid",
            downloadUrl: "#",
          },
        ]}
      />,
    );
    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("UsageBreakdown renders rows with values", () => {
    render(
      <UsageBreakdown
        title="This month"
        rows={[{ label: "API calls", used: 8200, limit: 10000 }]}
      />,
    );
    expect(screen.getByText("API calls")).toBeInTheDocument();
    expect(screen.getByText("8,200 / 10,000")).toBeInTheDocument();
  });
});

describe("Feedback", () => {
  it("NpsSurvey picks a score", () => {
    const onChange = vi.fn();
    render(<NpsSurvey onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "9" }));
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("EmojiRating selects a value", () => {
    const onChange = vi.fn();
    render(<EmojiRating onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Great" }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("SurveyForm collects answers and blocks on required", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <SurveyForm
        questions={[
          { id: "q1", label: "Pick one", type: "choice", required: true, options: [{ label: "A", value: "a" }] },
        ]}
        answers={{}}
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    );
    // required + unanswered → submit disabled
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    fireEvent.click(screen.getByLabelText("A"));
    expect(onChange).toHaveBeenCalledWith({ q1: "a" });
  });

  it("FeedbackForm submits category and message", () => {
    const onSubmit = vi.fn();
    render(<FeedbackForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Tell us more…"), {
      target: { value: "Great app!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send feedback" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ category: "idea", message: "Great app!" }),
    );
  });
});
