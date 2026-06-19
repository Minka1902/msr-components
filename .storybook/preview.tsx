import * as React from "react";
import type { Preview, Decorator } from "@storybook/react";
import { THEMES } from "../src/theme/themes";
import "../src/styles/index.css";
// Pull in every component's CSS for previews.
import.meta.glob("../src/**/*.css", { eager: true });

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "light";
  const density = context.globals.density ?? "comfortable";
  return (
    <div
      className="msr-root"
      data-theme={theme}
      data-density={density}
      style={{ padding: 24, minHeight: "100vh", background: "var(--msr-color-bg)", color: "var(--msr-color-fg)" }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "msr-components theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: THEMES.map((t) => ({ value: t, title: t })),
        dynamicTitle: true,
      },
    },
    density: {
      description: "Density",
      defaultValue: "comfortable",
      toolbar: {
        title: "Density",
        icon: "component",
        items: ["compact", "comfortable", "spacious"],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "fullscreen",
  },
};

export default preview;
