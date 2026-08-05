import { defineConfig } from "astro/config";

// GitHub Pages project site:
// https://daniella-laguerre.github.io/PondScope_Ecosystem_AI_Learning/
export default defineConfig({
  site: "https://daniella-laguerre.github.io",
  base: "/PondScope_Ecosystem_AI_Learning",
  output: "static",
  build: {
    format: "file",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
