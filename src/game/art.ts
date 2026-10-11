// Pixel art drawn once into small canvases: the flames (three kinds, two
// flicker frames each), the foam drop, the heart, the steam puff. One canvas
// pixel is one logical pixel of the game; the game draws them without smoothing.

export type FlameKind = "flame" | "blue" | "big";

interface FlameLook {
  w: number;
  h: number;
  colors: [outline: string, edge: string, mid: string, inner: string, core: string];
  angry?: boolean;
}

export const FLAMES: Record<FlameKind, FlameLook> = {
  flame: { w: 44, h: 54, colors: ["#3b0d06", "#d61e18", "#f06e1e", "#facd1e", "#fff4b0"] },
  blue: { w: 38, h: 48, colors: ["#0b1d4a", "#1f5fd6", "#3fa9f5", "#9ee6ff", "#ffffff"] },
  big: { w: 64, h: 78, colors: ["#2b0606", "#a3120f", "#e2361c", "#f59a1e", "#ffe27a"], angry: true }
};

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

function drawFlame({ w, h, colors, angry }: FlameLook, frame: number) {
  const c = canvas(w, h);
  const ctx = c.getContext("2d")!;
  const cx = w / 2;
  const r = w / 2 - 3;
  const cy = h - r - 3;
  // A teardrop: a round base and a flickering tip.
  const shape = (x: number, y: number) => {
    if (y >= cy) return Math.hypot(x - cx, y - cy) / r;
    const t = (y - 2) / (cy - 2);
    if (t <= 0) return 2;
    const wobble = Math.sin(y * 0.3 + frame * 2.4) * 2.5 * (1 - t);
    const half = r * Math.pow(t, 1.3);
    return Math.abs(x - cx - wobble) / Math.max(half, 0.5);
  };
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && shape(x + 0.5, y + 0.5) <= 1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (inside(x, y)) {
        // Hotter towards the middle and the base.
        const d = shape(x + 0.5, y + 0.5) - (y / h) * 0.25;
        ctx.fillStyle = d < 0.2 ? colors[4] : d < 0.45 ? colors[3] : d < 0.72 ? colors[2] : colors[1];
      } else if (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1)) {
        ctx.fillStyle = colors[0];
      } else continue;
      ctx.fillRect(x, y, 1, 1);
    }
  // A face: it is a bug on fire.
  const ex = Math.round(w * 0.16);
  const ey = Math.round(cy - 2);
  for (const side of [-1, 1]) {
    const x = Math.round(cx + side * ex - (side < 0 ? 3 : 0));
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 1, ey - 1, 5, 6);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + (side < 0 ? 1 : 0), ey + 1, 3, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + (side < 0 ? 1 : 0), ey + 1, 1, 1);
    if (angry) {
      ctx.fillStyle = "#111";
      for (let i = 0; i < 5; i++) ctx.fillRect(x - 1 + i, ey - 3 + (side < 0 ? i >> 1 : 2 - (i >> 1)), 1, 2);
    }
  }
  ctx.fillStyle = "#111";
  ctx.fillRect(cx - 3, ey + 8, 6, 2);
  return c;
}

function fromRows(rows: string[], colors: Record<string, string>) {
  const c = canvas(rows[0].length, rows.length);
  const ctx = c.getContext("2d")!;
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (!colors[ch]) return;
      ctx.fillStyle = colors[ch];
      ctx.fillRect(x, y, 1, 1);
    })
  );
  return c;
}

const FOAM = [
  "...kkkk...",
  "..kwwwwk..",
  ".kwwwwwbk.",
  "kwwwwwwbbk",
  "kwwwwwwbbk",
  "kwwwwwbbbk",
  ".kwwwbbbk.",
  "..kbbbbk..",
  "...kkkk..."
];

const HEART = [
  "..kkk...kkk..",
  ".krrrk.krrrk.",
  "krwwrrkrrrrRk",
  "krwrrrrrrrrRk",
  "krrrrrrrrrrRk",
  ".krrrrrrrrRk.",
  "..krrrrrrRk..",
  "...krrrrRk...",
  "....krrRk....",
  ".....kRk.....",
  "......k......"
];

export interface Art {
  flames: Record<FlameKind, HTMLCanvasElement[]>;
  foam: HTMLCanvasElement;
  heart: HTMLCanvasElement;
}

export function makeArt(): Art {
  const flames = Object.fromEntries(
    (Object.keys(FLAMES) as FlameKind[]).map((kind) => [kind, [0, 1].map((f) => drawFlame(FLAMES[kind], f))])
  ) as Record<FlameKind, HTMLCanvasElement[]>;
  return {
    flames,
    foam: fromRows(FOAM, { k: "#1b4f80", w: "#ffffff", b: "#a8e4ff" }),
    heart: fromRows(HEART, { k: "#2b0606", r: "#e8323c", R: "#a3120f", w: "#ffffff" })
  };
}
