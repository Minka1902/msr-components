import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./useTheme";
import { THEMES } from "./themes";

function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <div>
      <span data-testid="current">{theme}</span>
      <button onClick={() => setTheme("dark")}>dark</button>
      <span data-testid="count">{themes.length}</span>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("ships 15 themes", () => {
    expect(THEMES).toHaveLength(15);
  });

  it("applies data-theme and updates on change", async () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <ThemeSwitcher />
      </ThemeProvider>,
    );
    const root = container.querySelector(".msr-root");
    expect(root).toHaveAttribute("data-theme", "light");
    expect(screen.getByTestId("count")).toHaveTextContent("15");

    await userEvent.click(screen.getByText("dark"));
    expect(root).toHaveAttribute("data-theme", "dark");
    expect(screen.getByTestId("current")).toHaveTextContent("dark");
  });

  it("throws if useTheme is used outside a provider", () => {
    function Bare() {
      useTheme();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/ThemeProvider/);
  });
});
