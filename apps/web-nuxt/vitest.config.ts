import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts"],
    testTimeout: 10_000,
    hookTimeout: 10_000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportOnFailure: true,
      include: ["server/utils/article-read.ts", "server/utils/locale.ts"],
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        ".nuxt/",
        "**/*.config.ts",
        "**/types/**",
      ],
    },
  },
  resolve: {
    alias: {
      "~": projectRoot,
    },
  },
});
