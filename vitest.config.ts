import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    include: ["src/**/*.test.{ts,tsx}"],
    // msr-hooks ships untranspiled ESM with extensionless directory imports;
    // inline it so Vitest transforms/resolves it with esbuild.
    server: {
      deps: {
        inline: [/msr-hooks/, /msr-icons/],
      },
    },
  },
});
