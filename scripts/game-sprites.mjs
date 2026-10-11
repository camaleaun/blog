// Builds the sprite sheet of the 404 game from the mascot's game poses in
// brand/ (made in an image generator from brand/wapuu-firefighter.webp):
// five 128×144 frames side by side — idle, step 1, step 2, spray, hit — in a
// 32-bit-era pixel style: a fixed palette, black outline, light from the top left.
//
// Each pose is cut from its white background (foam, smoke and impact lines go
// too: the game draws them), scaled the same, aligned at the feet and centred
// on the body, then every 8×8 block of the source becomes one pixel.
//
// Usage: npm run game-sprites   (writes src/assets/game/wapuu.png)
import sharp from "sharp";
import { resolve } from "node:path";

const out = (p) => resolve(import.meta.dirname, "..", p);
const W = 128;
const H = 144;
const SUB = 8; // source samples per sprite pixel, per axis

// Colors picked from the artwork. The second group (highlights, deep shades)
// is never matched: the shading pass paints it.
const PALETTE = {
  k: [20, 20, 20], // outline
  r: [214, 30, 24], // helmet, extinguisher
  d: [160, 20, 18],
  y: [250, 205, 30], // badge, reflective stripes
  o: [240, 110, 30], // flame on the badge
  g: [126, 196, 42], // skin
  G: [72, 150, 40], // skin shade, spots
  w: [255, 255, 255], // eyes, W
  p: [236, 120, 140], // tongue
  b: [176, 128, 52], // coat
  B: [132, 92, 38],
  s: [150, 150, 150], // grey stripes, gauge
  h: [64, 64, 66], // hose, belt
  R: [244, 84, 60],
  D: [104, 12, 14],
  l: [170, 222, 80],
  F: [38, 98, 32],
  c: [208, 162, 84],
  N: [90, 60, 26],
  Y: [255, 236, 120]
};
const MATCHED = Object.entries(PALETTE).filter(([ch]) => !"RDlFcNY".includes(ch));
// Highlight, deep shade and shade of each material.
const SHADING = { r: "RDd", g: "lFG", b: "cNB", y: "Yyy" };

const nearest = (r, g, b) => {
  let best = "k";
  let dist = Infinity;
  for (const [ch, [pr, pg, pb]] of MATCHED) {
    const d = (r - pr) ** 2 * 0.3 + (g - pg) ** 2 * 0.59 + (b - pb) ** 2 * 0.11;
    if (d < dist) [best, dist] = [ch, d];
  }
  return best;
};

// The largest shape on a light background: the character without foam,
// smoke puffs or impact lines.
async function cutout(file, crop) {
  let img = sharp(out(file));
  if (crop) {
    const { width, height } = await img.metadata();
    const [col, row] = crop;
    const w = width >> 1;
    const h = height >> 1;
    img = sharp(out(file)).extract({ left: col * w, top: row * h, width: w, height: h });
  }
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const light = (p) => {
    const r = data[p * 4];
    const g = data[p * 4 + 1];
    const b = data[p * 4 + 2];
    return Math.min(r, g, b) > 150 && Math.max(r, g, b) - Math.min(r, g, b) < 60;
  };
  const bg = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || !light(p)) continue;
    bg[p] = 1;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }
  const label = new Int32Array(w * h).fill(-1);
  let best = -1;
  let bestSize = 0;
  for (let s = 0, id = 0; s < w * h; s++) {
    if (bg[s] || label[s] >= 0) continue;
    let size = 0;
    const queue = [s];
    label[s] = id;
    while (queue.length) {
      const p = queue.pop();
      size++;
      const x = p % w;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
        if (q < 0 || q >= w * h || bg[q] || label[q] >= 0) continue;
        label[q] = id;
        queue.push(q);
      }
    }
    if (size > bestSize) [best, bestSize] = [id, size];
    id++;
  }
  const inside = (x, y) => x >= 0 && y >= 0 && x < w && y < h && label[y * w + x] === best;
  let [x0, y0, x1, y1] = [w, h, 0, 0];
  for (let p = 0; p < w * h; p++) {
    if (label[p] !== best) continue;
    const x = p % w;
    const y = (p / w) | 0;
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  // Horizontal anchor: the middle of the body at belt height.
  const beltY = Math.round(y0 + (y1 - y0) * 0.7);
  let [left, right] = [w, 0];
  for (let x = 0; x < w; x++)
    if (inside(x, beltY)) {
      left = Math.min(left, x);
      right = Math.max(right, x);
    }
  return { data, w, inside, top: y0, bottom: y1, anchor: (left + right) / 2 };
}

function pixelate(pose, scale) {
  const rows = [];
  for (let j = 0; j < H; j++) {
    let row = "";
    for (let i = 0; i < W; i++) {
      const votes = {};
      let total = 0;
      let empty = 0;
      for (let sy = 0; sy < SUB; sy++)
        for (let sx = 0; sx < SUB; sx++) {
          // Feet on the bottom row (less 2px), body centred.
          const x = Math.floor(pose.anchor + (i + sx / SUB - W / 2) / scale);
          const y = Math.floor(pose.bottom - (H - 2 - (j + sy / SUB)) / scale);
          total++;
          if (!pose.inside(x, y)) {
            empty++;
            continue;
          }
          const p = (y * pose.w + x) * 4;
          const ch = nearest(pose.data[p], pose.data[p + 1], pose.data[p + 2]);
          votes[ch] = (votes[ch] ?? 0) + 1;
        }
      if (empty > total * 0.55) row += ".";
      // Thin outlines lose a majority vote; keep them when they are a big minority.
      else if ((votes.k ?? 0) > (total - empty) * 0.4) row += "k";
      else row += Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    }
    rows.push(row);
  }
  return rows;
}

// Volume, light from the top left: within 2px of the outline above or to the
// left a pixel takes the highlight; within 2px below or to the right, the deep
// shade; 2px further in, the shade.
function shade(rows) {
  const at = (x, y) => rows[y]?.[x] ?? ".";
  const edge = (ch) => ch === "k" || ch === ".";
  const near = (x, y, dx, dy, n) => {
    for (let i = 1; i <= n; i++) if (edge(at(x + dx * i, y + dy * i))) return true;
    return false;
  };
  return rows.map((row, y) =>
    [...row]
      .map((ch, x) => {
        const tones = SHADING[ch];
        if (!tones) return ch;
        if (near(x, y, 0, -1, 2) || near(x, y, -1, 0, 2)) return tones[0];
        if (near(x, y, 0, 1, 2) || near(x, y, 1, 0, 2)) return tones[1];
        if (near(x, y, 0, 1, 4) || near(x, y, 1, 0, 4)) return tones[2];
        return ch;
      })
      .join("")
  );
}

const stand = await cutout("brand/wapuu-game-stand.webp");
const step = await cutout("brand/wapuu-game-step.webp");
const gridStep = await cutout("brand/wapuu-game-poses.webp", [0, 0]);
const spray = await cutout("brand/wapuu-game-poses.webp", [0, 1]);
const hit = await cutout("brand/wapuu-game-poses.webp", [1, 1]);

// The standing pose fills the frame; the single step image is at the same
// scale; the 2×2 grid poses share one scale, matched through the two steps.
const scale = (H - 4) / (stand.bottom - stand.top + 1);
const gridScale = (scale * (step.bottom - step.top)) / (gridStep.bottom - gridStep.top);

const frames = [
  pixelate(stand, scale),
  pixelate(gridStep, gridScale),
  pixelate(step, scale),
  pixelate(spray, gridScale),
  pixelate(hit, gridScale)
].map(shade);

// Spray: the foam's outline that stays attached above the nozzle goes; the
// game draws the jet. Only above the helmet, left of the face.
{
  const rows = frames[3];
  const helmet = rows.findIndex((row) => /[rR]/.test(row));
  frames[3] = rows.map((row, y) =>
    [...row]
      .map((ch, x) =>
        y < helmet + 6 && x < 44 && "swk".includes(ch) && !row.slice(Math.max(0, x - 2), x + 3).includes("h") ? "." : ch
      )
      .join("")
  );
}

const sheet = Buffer.alloc(W * frames.length * H * 4);
frames.forEach((rows, f) => {
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const ch = rows[y][x];
      if (ch === ".") continue;
      const p = (y * W * frames.length + f * W + x) * 4;
      sheet.set([...PALETTE[ch], 255], p);
    }
});
await sharp(sheet, { raw: { width: W * frames.length, height: H, channels: 4 } })
  .png({ palette: true, compressionLevel: 9 })
  .toFile(out("src/assets/game/wapuu.png"));
console.log(`src/assets/game/wapuu.png: ${frames.length} frames of ${W}×${H}`);

// Social images of the game pages: the night site, the wapuu big and sharp,
// the name and the tagline. Text in the system's monospace (run on a Mac).
const SOCIAL = {
  en: ["WAPUU CHAMELEON", "FIREFIGHTER", "The site is on fire. Put it out!"],
  "pt-br": ["WAPUU CAMALEÃO", "BOMBEIRO", "O site está pegando fogo. Apague!"]
};
const idle = await sharp(out("src/assets/game/wapuu.png"))
  .extract({ left: 0, top: 0, width: W, height: H })
  .resize(W * 3, H * 3, { kernel: "nearest" })
  .toBuffer();
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
for (const [lang, [line1, line2, tagline]] of Object.entries(SOCIAL)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#151a3d"/>
  <rect x="40" y="0" width="1120" height="630" fill="#1d2452"/>
  <rect x="40" y="0" width="1120" height="44" fill="#283066"/>
  <circle cx="70" cy="22" r="7" fill="#ff5f57"/><circle cx="94" cy="22" r="7" fill="#febc2e"/><circle cx="118" cy="22" r="7" fill="#28c840"/>
  ${[0, 1, 2].map((i) => `<rect x="${60 + i * 370}" y="64" width="350" height="566" fill="#222a5c"/>`).join("")}
  <rect x="0" y="600" width="1200" height="30" fill="#0e1230"/>
  <g font-family="Menlo, SFMono-Regular, ui-monospace, monospace" font-weight="800">
    <text x="520" y="250" font-size="62" fill="#000">${escape(line1)}</text>
    <text x="516" y="246" font-size="62" fill="#c6f35b">${escape(line1)}</text>
    <text x="520" y="330" font-size="62" fill="#000">${escape(line2)}</text>
    <text x="516" y="326" font-size="62" fill="#c6f35b">${escape(line2)}</text>
    <text x="516" y="410" font-size="30" font-weight="700" fill="#ffffff">${escape(tagline)}</text>
    <text x="516" y="520" font-size="24" font-weight="600" fill="#9aa3d6">camaleaun.github.io</text>
  </g>
</svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: idle, left: 70, top: 600 - H * 3 }])
    .png()
    .toFile(out(`src/assets/game/og-${lang}.png`));
}
console.log("src/assets/game/og-en.png, og-pt-br.png");
