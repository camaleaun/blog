// Builds the brand files from brand/palette.json:
// - checks the WCAG contrast of every documented pair (exits 1 on a failure);
// - writes the logo SVGs in brand/, the favicon and touch icon in public/,
//   the social images in src/assets/ and the color tokens in src/styles/_colors.scss.
// Run with `npm run brand` and commit the results (CI does not run it).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const out = (path) => resolve(root, path);
const { colors, contrast } = JSON.parse(await readFile(out("brand/palette.json"), "utf8"));
const c = (name, mode = "light") => (name.startsWith("#") ? name : colors[name][mode]);

// --- Contrast -------------------------------------------------------------

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = false;
console.log("Contrast (WCAG):");
for (const { fg, bg, min, modes = ["light", "dark"] } of contrast) {
  for (const mode of modes) {
    const value = ratio(c(fg, mode), c(bg, mode));
    const ok = value >= min;
    failed ||= !ok;
    console.log(`  ${ok ? "ok  " : "FAIL"} ${mode.padEnd(5)} ${fg} on ${bg}: ${value.toFixed(2)}:1 (min ${min})`);
  }
}

// --- Mark and logos -------------------------------------------------------

// The chameleon's tail curled into a G, with the eye as a dot.
const SPIRAL =
  "M47 22A18 18 0 1 0 50 33C50 26.5 44.7 21.5 38.3 21.5 32 21.5 27 26.4 27 32.4 27 37.2 30.7 41 35.3 41 38.6 41 41 38.6 41 35.6";
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;

const mark = ({ square = c("primary"), stroke = "#fff", eye = c("accent"), x = 0, y = 0, size = 64 } = {}) => {
  const s = size / 64;
  const rect = square ? `<rect width="64" height="64" rx="14" fill="${square}"/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${rect}<path d="${SPIRAL}" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="45.5" cy="16.5" r="3.2" fill="${eye}"/></g>`;
};

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const wordmark = ({ x, y, name, handle, nameSize = 26, handleSize = 15, gap = 20 }) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${nameSize}" font-weight="700" letter-spacing="-0.02em" fill="${name}">Gilberto Tavares</text>` +
  `<text x="${x}" y="${y + gap}" font-family="${FONT}" font-size="${handleSize}" font-weight="500" fill="${handle}">camaleaun</text>`;

const NAME = "Gilberto Tavares, camaleaun";
const files = {
  "brand/mark.svg": svg(64, 64, mark(), "camaleaun mark"),
  "brand/mark-mono.svg": svg(64, 64, mark({ square: null, stroke: "currentColor", eye: "currentColor" }), "camaleaun mark"),
  "brand/mark-white.svg": svg(64, 64, mark({ square: null, eye: "#fff" }), "camaleaun mark"),
  "brand/logo-horizontal.svg": svg(
    320, 64,
    mark() + wordmark({ x: 78, y: 30, name: c("ink"), handle: c("primary") }),
    NAME
  ),
  "brand/logo-horizontal-dark.svg": svg(
    320, 64,
    mark() + wordmark({ x: 78, y: 30, name: c("ink", "dark"), handle: c("primary", "dark") }),
    NAME
  ),
  "brand/logo-stacked.svg": svg(
    240, 150,
    mark({ x: 88, y: 0 }) +
      `<text x="120" y="104" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="700" letter-spacing="-0.02em" fill="${c("ink")}">Gilberto Tavares</text>` +
      `<text x="120" y="128" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="500" fill="${c("primary")}">camaleaun</text>`,
    NAME
  ),
  "public/favicon.svg": svg(64, 64, mark(), "camaleaun"),
};

await mkdir(out("public"), { recursive: true });
for (const [path, content] of Object.entries(files)) {
  await writeFile(out(path), content);
}

// --- PNGs -----------------------------------------------------------------

await sharp(Buffer.from(svg(180, 180, `<rect width="180" height="180" fill="${c("primary")}"/>` + mark({ x: 18, y: 18, size: 144, square: null }), "camaleaun")))
  .png()
  .toFile(out("public/apple-touch-icon.png"));

const social = (tagline) =>
  svg(
    1200, 630,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c("primary")}"/><stop offset="1" stop-color="${c("deep")}"/></linearGradient>` +
      `<radialGradient id="glow" cx="0.85" cy="0.15" r="0.6"><stop offset="0" stop-color="${c("accent")}" stop-opacity="0.28"/><stop offset="1" stop-color="${c("accent")}" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="1200" height="630" fill="url(#g)"/><rect width="1200" height="630" fill="url(#glow)"/>` +
      mark({ x: 96, y: 96, size: 128, square: null }) +
      `<text x="96" y="380" font-family="${FONT}" font-size="88" font-weight="700" letter-spacing="-0.03em" fill="#fff">Gilberto Tavares</text>` +
      `<text x="96" y="438" font-family="${FONT}" font-size="40" font-weight="500" fill="${c("accent")}">camaleaun</text>` +
      `<text x="96" y="534" font-family="${FONT}" font-size="34" fill="#fff" fill-opacity="0.88">${tagline}</text>`,
    NAME
  );

await mkdir(out("src/assets"), { recursive: true });
await sharp(Buffer.from(social("Notes on building with WordPress"))).png().toFile(out("src/assets/og-en.png"));
await sharp(Buffer.from(social("Notas sobre construir com WordPress"))).png().toFile(out("src/assets/og-pt-br.png"));

// --- Mascot -----------------------------------------------------------------

// The wapuu comes on white; remove the white connected to the edges (flood
// fill) so it sits on any background, and soften the cut edge.
{
  const { data, info } = await sharp(out("brand/wapuu-firefighter.webp"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const isWhite = (i) => data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235;
  const seen = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p] || !isWhite(p * 4)) continue;
    seen[p] = 1;
    data[p * 4 + 3] = 0;
    const x = p % width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (p >= width) stack.push(p - width);
    if (p < width * (height - 1)) stack.push(p + width);
  }
  // Half-transparent ring where the cut meets the outline, against halos.
  for (let p = 0; p < width * height; p++) {
    if (seen[p]) continue;
    const x = p % width;
    const near = (x > 0 && seen[p - 1]) || (x < width - 1 && seen[p + 1]) || seen[p - width] || seen[p + width];
    if (near && data[p * 4] > 180 && data[p * 4 + 1] > 180 && data[p * 4 + 2] > 180) data[p * 4 + 3] = 96;
  }
  // Sticker look (like a WhatsApp sticker): a white outline around the visible
  // drawing — the alpha mask grown by STROKE px — and a soft shadow under it.
  const STROKE = 20;
  const PAD = STROKE + 24;
  const W = width + PAD * 2;
  const H = height + PAD * 2;
  const cut = await sharp(data, { raw: { width, height, channels: 4 } })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer();

  // Distance (chamfer 3-4) from every pixel to the drawing, then a mask that is
  // opaque within STROKE px and fades over one pixel for a smooth edge.
  const dist = new Float32Array(W * H);
  for (let p = 0; p < W * H; p++) dist[p] = cut[p * 4 + 3] > 128 ? 0 : 1e9;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (x > 0) dist[p] = Math.min(dist[p], dist[p - 1] + 3);
      if (y > 0) {
        dist[p] = Math.min(dist[p], dist[p - W] + 3);
        if (x > 0) dist[p] = Math.min(dist[p], dist[p - W - 1] + 4);
        if (x < W - 1) dist[p] = Math.min(dist[p], dist[p - W + 1] + 4);
      }
    }
  for (let y = H - 1; y >= 0; y--)
    for (let x = W - 1; x >= 0; x--) {
      const p = y * W + x;
      if (x < W - 1) dist[p] = Math.min(dist[p], dist[p + 1] + 3);
      if (y < H - 1) {
        dist[p] = Math.min(dist[p], dist[p + W] + 3);
        if (x < W - 1) dist[p] = Math.min(dist[p], dist[p + W + 1] + 4);
        if (x > 0) dist[p] = Math.min(dist[p], dist[p + W - 1] + 4);
      }
    }
  const grown = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) grown[p] = Math.round(255 * Math.min(1, Math.max(0, STROKE + 1 - dist[p] / 3)));

  const layer = (r, g, b, mask) => {
    const rgba = Buffer.alloc(W * H * 4);
    for (let p = 0; p < W * H; p++) {
      rgba[p * 4] = r;
      rgba[p * 4 + 1] = g;
      rgba[p * 4 + 2] = b;
      rgba[p * 4 + 3] = mask[p];
    }
    return sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  };
  const shadowMask = Buffer.from(grown.map((v) => Math.round(v * 0.3)));
  const shadow = await sharp(await layer(11, 61, 51, shadowMask)).blur(8).toBuffer();
  const sticker = await sharp({ create: { width: W, height: H + 8, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: shadow, top: 8, left: 0 },
      { input: await layer(255, 255, 255, grown), top: 0, left: 0 },
      { input: await sharp(cut, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer(), top: 0, left: 0 }
    ])
    .png()
    .toBuffer();
  await sharp(sticker).trim({ threshold: 0 }).webp({ quality: 90, alphaQuality: 100 }).toFile(out("src/assets/wapuu.webp"));
}

// --- Color tokens ---------------------------------------------------------

const tokens = Object.entries(colors)
  .map(([name, { light, dark }]) =>
    light === dark ? `  --gt-${name}: ${light};` : `  --gt-${name}: light-dark(${light}, ${dark});`
  )
  .join("\n");
await writeFile(
  out("src/styles/_colors.scss"),
  `// Generated by scripts/brand.mjs from brand/palette.json. Do not edit.\n@mixin colors {\n${tokens}\n}\n`
);

console.log(`\nWrote ${Object.keys(files).length + 5} files.`);
if (failed) {
  console.error("Contrast check failed.");
  process.exit(1);
}
