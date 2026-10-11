// A 5×7 bitmap font for the canvas: A–Z, 0–9, a little punctuation and the
// Portuguese accents (drawn as marks over or under the base letter).
const GLYPHS: Record<string, string> = {
  A: "01110 10001 10001 11111 10001 10001 10001",
  B: "11110 10001 10001 11110 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110",
  D: "11110 10001 10001 10001 10001 10001 11110",
  E: "11111 10000 10000 11110 10000 10000 11111",
  F: "11111 10000 10000 11110 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01111",
  H: "10001 10001 10001 11111 10001 10001 10001",
  I: "01110 00100 00100 00100 00100 00100 01110",
  J: "00111 00010 00010 00010 00010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001",
  L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001",
  N: "10001 10001 11001 10101 10011 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110",
  P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101",
  R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110",
  T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110",
  V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 10101 01010",
  X: "10001 10001 01010 00100 01010 10001 10001",
  Y: "10001 10001 01010 00100 00100 00100 00100",
  Z: "11111 00001 00010 00100 01000 10000 11111",
  "0": "01110 10001 10011 10101 11001 10001 01110",
  "1": "00100 01100 00100 00100 00100 00100 01110",
  "2": "01110 10001 00001 00010 00100 01000 11111",
  "3": "11111 00010 00100 00010 00001 10001 01110",
  "4": "00010 00110 01010 10010 11111 00010 00010",
  "5": "11111 10000 11110 00001 00001 10001 01110",
  "6": "00110 01000 10000 11110 10001 10001 01110",
  "7": "11111 00001 00010 00100 01000 01000 01000",
  "8": "01110 10001 10001 01110 10001 10001 01110",
  "9": "01110 10001 10001 01111 00001 00010 01100",
  "!": "00100 00100 00100 00100 00100 00000 00100",
  "?": "01110 10001 00001 00010 00100 00000 00100",
  ".": "00000 00000 00000 00000 00000 01100 01100",
  ",": "00000 00000 00000 00000 01100 00100 01000",
  ":": "00000 01100 01100 00000 01100 01100 00000",
  "-": "00000 00000 00000 11111 00000 00000 00000",
  "+": "00000 00100 00100 11111 00100 00100 00000",
  "'": "00100 00100 01000 00000 00000 00000 00000",
  "/": "00001 00010 00010 00100 01000 01000 10000",
  "·": "00000 00000 00000 01100 01100 00000 00000",
  "♥": "00000 01010 11111 11111 01110 00100 00000",
  "×": "00000 10001 01010 00100 01010 10001 00000",
  " ": "00000 00000 00000 00000 00000 00000 00000"
};

// Marks: two rows over the letter (or under it, for the cedilla).
const MARKS: Record<string, string> = {
  acute: "00010 00100",
  grave: "01000 00100",
  tilde: "01101 10110",
  circumflex: "00100 01010",
  cedilla: "00100 01000"
};
const ACCENTED: Record<string, [string, keyof typeof MARKS]> = {
  Á: ["A", "acute"],
  À: ["A", "grave"],
  Ã: ["A", "tilde"],
  Â: ["A", "circumflex"],
  É: ["E", "acute"],
  Ê: ["E", "circumflex"],
  Í: ["I", "acute"],
  Ó: ["O", "acute"],
  Ô: ["O", "circumflex"],
  Õ: ["O", "tilde"],
  Ú: ["U", "acute"],
  Ç: ["C", "cedilla"]
};

const bits = (rows: string) => rows.split(" ").map((row) => [...row].map((b) => b === "1"));

/** Width in font pixels of a line (6 per character: 5 + 1 of spacing). */
export const textWidth = (text: string) => text.length * 6 - 1;

export interface TextStyle {
  size?: number; // logical px per font pixel
  color?: string;
  shadow?: string;
  align?: "left" | "center" | "right";
}

export function drawText(ctx: CanvasRenderingContext2D, raw: string, x: number, y: number, style: TextStyle = {}) {
  const { size = 4, color = "#fff", shadow = "#000", align = "left" } = style;
  const text = raw.toLocaleUpperCase();
  const width = textWidth(text) * size;
  const left = Math.round(align === "center" ? x - width / 2 : align === "right" ? x - width : x);
  const top = Math.round(y);
  const paint = (dx: number, fill: string) => {
    ctx.fillStyle = fill;
    let cx = left + dx;
    for (const ch of text) {
      const [base, mark] = ACCENTED[ch] ?? [ch, undefined];
      const glyph = GLYPHS[base] ?? GLYPHS["?"];
      bits(glyph).forEach((row, j) =>
        row.forEach((on, i) => on && ctx.fillRect(cx + i * size, top + dx + j * size, size, size))
      );
      if (mark) {
        const below = mark === "cedilla";
        bits(MARKS[mark]).forEach((row, j) =>
          row.forEach(
            (on, i) =>
              on && ctx.fillRect(cx + i * size, top + dx + (below ? 7 + j : j - 3) * size, size, size)
          )
        );
      }
      cx += 6 * size;
    }
  };
  if (shadow) paint(size, shadow);
  paint(0, color);
}
