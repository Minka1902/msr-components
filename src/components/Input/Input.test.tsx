import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Input } from "./Input";

describe("Input", () => {
  it("forwards typing and marks invalid when tone=danger", async () => {
    render(<Input tone="danger" aria-label="email" defaultValue="" />);
    const field = screen.getByLabelText("email");
    expect(field).toHaveAttribute("aria-invalid", "true");
    await userEvent.type(field, "hi");
    expect(field).toHaveValue("hi");
  });

  it("has no a11y violations with an associated label", async () => {
    const { container } = render(
      <label>
        Email
        <Input />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
