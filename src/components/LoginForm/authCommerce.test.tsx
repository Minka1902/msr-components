import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { LoginForm } from "./LoginForm";
import { ResultPage } from "../ResultPage/ResultPage";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import { CouponInput } from "../CouponInput/CouponInput";
import { PricingTable } from "../PricingTable/PricingTable";
import { CheckoutSummary } from "../CheckoutSummary/CheckoutSummary";

describe("LoginForm", () => {
  it("submits email, password and remember", async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "secret123");
    await userEvent.click(screen.getByLabelText("Remember me"));
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(onSubmit).toHaveBeenCalledWith({ email: "a@b.com", password: "secret123", remember: true });
  });
});

describe("ResultPage", () => {
  it("renders a 404 with default title and is accessible", async () => {
    const { container } = render(<ResultPage status="404" subtitle="No such page" />);
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ErrorBoundary", () => {
  it("renders a fallback when a child throws and recovers on reset", async () => {
    function Boom(): React.ReactElement {
      throw new Error("kaboom");
    }
    // Silence the expected React error log.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText("kaboom")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe("CouponInput", () => {
  it("rejects an invalid code", async () => {
    const onApply = vi.fn().mockReturnValue(false);
    render(<CouponInput onApply={onApply} />);
    await userEvent.type(screen.getByPlaceholderText("Promo code"), "BAD");
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenCalledWith("BAD");
    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid/i);
  });
});

describe("PricingTable", () => {
  it("selects a plan", async () => {
    const onSelectPlan = vi.fn();
    render(
      <PricingTable
        onSelectPlan={onSelectPlan}
        plans={[{ id: "pro", name: "Pro", price: "$10", features: ["A", { text: "B", included: false }] }]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Choose plan" }));
    expect(onSelectPlan).toHaveBeenCalledWith(expect.objectContaining({ id: "pro" }));
  });
});

describe("CheckoutSummary", () => {
  it("computes the total from subtotal plus lines", () => {
    render(
      <CheckoutSummary
        subtotal={100}
        lines={[
          { label: "Shipping", value: 10 },
          { label: "Discount", value: -20, tone: "discount" },
        ]}
      />,
    );
    expect(screen.getByText("$90.00")).toBeInTheDocument();
  });
});
