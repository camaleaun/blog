import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://camaleaun.github.io",
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
