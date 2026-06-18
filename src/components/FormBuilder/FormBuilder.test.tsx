import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormBuilder, type FormFieldSchema } from "./FormBuilder";

const fields: FormFieldSchema[] = [
  { name: "name", type: "text", label: "Name", required: true },
  { name: "email", type: "email", label: "Email", required: true },
  { name: "bio", type: "textarea", label: "Bio" },
];

describe("FormBuilder", () => {
  it("renders a control per field", () => {
    render(<FormBuilder fields={fields} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Bio")).toBeInTheDocument();
  });

  it("blocks submit and shows errors for required/invalid fields", async () => {
    const onSubmit = vi.fn();
    render(<FormBuilder fields={fields} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("submits collected values when valid", async () => {
    const onSubmit = vi.fn();
    render(<FormBuilder fields={fields} onSubmit={onSubmit} />);
    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "Ada");
    await userEvent.type(inputs[1], "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: "Ada", email: "ada@example.com" }));
  });
});
