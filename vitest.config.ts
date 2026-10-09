import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  test: { include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"] },
});
