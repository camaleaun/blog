import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import { rehypeHashtags } from "./src/lib/rehypeHashtags";

export default defineConfig({
  site: "https://camaleaun.github.io",
  trailingSlash: "always",
  build: {
    inlineStylesheets: "always"
  },
  // Translations have different slugs, so hreflang lives in each page's head, not in the sitemap.
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeHashtags]
    }),
    shikiConfig: {
      themes: {
        light: "github-light-high-contrast",
        dark: "github-dark-high-contrast"
      },
      defaultColor: false
    }
  }
});
