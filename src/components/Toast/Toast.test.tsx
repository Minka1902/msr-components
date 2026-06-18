import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./Toast";

function Trigger() {
  const { success } = useToast();
  return <button onClick={() => success("Saved!", { description: "All good" })}>fire</button>;
}

describe("Toast", () => {
  it("shows a toast on demand and dismisses it via the close button", async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("fire"));
    expect(screen.getByText("Saved!")).toBeInTheDocument();
    expect(screen.getByText("All good")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("Saved!")).toBeNull();
  });

  it("throws when useToast is used without a provider", () => {
    function Bare() {
      useToast();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/ToastProvider/);
  });
});
