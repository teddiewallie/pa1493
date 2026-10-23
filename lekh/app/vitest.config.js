// ChatGPT assisted

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.jsx"],
  },
  coverage: {
    include: ["actions/**/*.js", "schema/**/*.js", "query/**/*.js", "components/**/*.js"],
    reporter: ["text", "html"],
    thresholds: {
      lines: 75,
      functions: 75,
      branches: 70,
      statements: 75,
    },
  }
});

