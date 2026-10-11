// Lighthouse on the built site, mobile and desktop, light and dark.
// Start the preview first (`npm run build && npm run preview`), then `npm run lighthouse`.
// Options: --base=https://camaleaun.github.io (live site), --all (every page in dist/),
// --pages=/a/,/b/ (just these).
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  })
);
const base = (args.base ?? "http://127.0.0.1:4321").replace(/\/$/, "");
const categories = ["performance", "accessibility", "best-practices", "seo", "agentic-browsing"];

const listPages = async (dir, prefix = "/") => {
  const pages = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === "index.html") pages.push(prefix);
    if (entry.isDirectory() && !entry.name.startsWith("_")) {
      pages.push(...(await listPages(resolve(dir, entry.name), `${prefix}${entry.name}/`)));
    }
  }
  return pages;
};

const pages = args.pages
  ? args.pages.split(",")
  : args.all
  ? await listPages(resolve(import.meta.dirname, "../dist"))
  : [
      "/",
      "/pt-br/",
      "/exporter-importer-z-move-your-wordpress-content-not-your-mess/",
      "/pt-br/php-o-cerebro-por-tras-do-wordpress/"
    ];

let failed = false;
for (const scheme of ["light", "dark"]) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", `--blink-settings=preferredColorScheme=${scheme === "dark" ? 0 : 1}`]
  });
  try {
    for (const device of ["mobile", "desktop"]) {
      for (const page of pages) {
        const result = await lighthouse(
          base + page,
          { port: chrome.port, output: "json", logLevel: "error", onlyCategories: categories },
          device === "desktop" ? desktopConfig : undefined
        );
        const { lhr } = result;
        const scores = categories.map((id) => Math.round((lhr.categories[id].score ?? 0) * 100));
        const perfect = scores.every((score) => score === 100);
        failed ||= !perfect;
        console.log(`${perfect ? "ok  " : "FAIL"} ${scheme.padEnd(5)} ${device.padEnd(7)} ${scores.join(" / ")}  ${page}`);
        if (!perfect) {
          for (const id of categories) {
            for (const ref of lhr.categories[id].auditRefs) {
              const audit = lhr.audits[ref.id];
              if (ref.weight > 0 && audit.score !== null && audit.score < 1) {
                console.log(`       ${id}: ${audit.id} (${audit.score}) ${audit.displayValue ?? ""}`);
              }
            }
          }
        }
      }
    }
  } finally {
    chrome.kill();
  }
}

process.exit(failed ? 1 : 0);
