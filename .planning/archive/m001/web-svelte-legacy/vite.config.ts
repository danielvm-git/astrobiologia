import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      strategy: ["url", "cookie", "baseLocale"],
    }),
  ],
  test: {
    include: ["src/**/*.test.{js,ts}", "tests/**/*.test.{js,ts}"],
    exclude: ["tests/e2e/**/*"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
});
