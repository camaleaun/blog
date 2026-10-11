# Gilberto Tavares · camaleaun — brand

How the blog shows itself: the mark and what it means, the logo’s versions and space, colors, type, icons, images and voice. Internal reference only — never published as a page. The files are in [`brand/`](brand/), built by [`scripts/brand.mjs`](scripts/brand.mjs) (`npm run brand`) from [`brand/palette.json`](brand/palette.json).

<p><img src="brand/logo-horizontal.svg" alt="Gilberto Tavares, camaleaun — horizontal logo" width="320" height="64"></p>

## Concept

**camaleaun** — the handle — is a chameleon: a developer who adapts to whatever a WordPress project asks for — a block theme, a plugin, a migration, a performance fix — while keeping an identity of their own.

The mark is the **chameleon’s tail, curled** into a spiral. One drawing carries both names:

- **the curl reads as a G** — for Gilberto, so the mark holds the person’s name and the handle at once;
- **the dot is the chameleon’s eye** (lime `#c6f35b`): the one bright detail, the color a chameleon changes into;
- **the square is the brand green** (`#0f6d5a`) — the green the blog always used, refined for contrast — rounded at 14/64 (22%).

One stroke width, round caps and joins — the same line as the icons, so the mark and the icons read as one family.

<p><img src="brand/mark.svg" alt="The mark" width="96" height="96"></p>

## Name

The brand is the name **Gilberto Tavares** with the handle **camaleaun** under it — no connector word (“aka”, “by”) between them. “Gilberto Tavares” is the person and leads; “camaleaun” is the handle (GitHub, the domain) and follows, smaller and lighter, in the primary color. In running text, “Gilberto Tavares” is enough; use “camaleaun” lowercase, always.

## Logo

| Version | File | Use |
| --- | --- | --- |
| Horizontal | [`logo-horizontal.svg`](brand/logo-horizontal.svg) | Default: README, documents, light backgrounds |
| Horizontal, dark | [`logo-horizontal-dark.svg`](brand/logo-horizontal-dark.svg) | Dark backgrounds (light name, light-green handle) |
| Stacked | [`logo-stacked.svg`](brand/logo-stacked.svg) | Square spaces, avatars with room, covers |
| Mark | [`mark.svg`](brand/mark.svg) | Favicon, avatars, small spaces |
| Mark, one color | [`mark-mono.svg`](brand/mark-mono.svg) | Uses `currentColor` — inline in the site header |
| Mark, white | [`mark-white.svg`](brand/mark-white.svg) | On the brand green, the deep green or photos |

The wordmark uses the **system font** (bold for the name, medium for the handle), so the SVGs keep it as `<text>` and it renders in each device’s own sans-serif. On the site it is real HTML text, never an image. The PNGs (touch icon, social images) are rendered on a Mac and committed.

## Clear space and sizes

- **Clear space:** a quarter of the mark’s height on every side.
- **Smallest mark:** 16px (favicon). Below 24px the eye may drop out; that is fine.
- **Smallest horizontal logo:** 160px wide; below that, use the mark alone.

## Don’ts

- Don’t rotate or mirror the mark — the curl opens to the upper right.
- Don’t recolor the eye to anything but lime, white (mark-white) or `currentColor` (mono).
- Don’t put lime text on a light background: it fails contrast. Lime is for the eye and small accents on dark.
- Don’t swap the order or weights: the name leads, the handle follows.
- Don’t set the name in a webfont or outline it in a document that will be edited.
- Don’t use the WordPress logo next to the mark as if they were one brand.

## Color

Source: [`brand/palette.json`](brand/palette.json). Contrast is checked by `npm run brand` (WCAG; it fails below the minimum). Every color has a light and a dark value.

| Name | Light | Dark | Token | Use |
| --- | --- | --- | --- | --- |
| Primary | `#0f6d5a` | `#7de2bf` | `--gt-primary` | Links, focus ring, the mark’s square |
| Primary strong | `#0b5c4c` | `#a6efd4` | `--gt-primary-strong` | Hover and pressed |
| Primary soft | `#e3f1ec` | `#16352d` | `--gt-primary-soft` | Tinted backgrounds, selected items |
| Accent (lime) | `#c6f35b` | `#c6f35b` | `--gt-accent` | The eye, small highlights on dark — never text on light |
| Deep | `#0b3d33` | `#0b3d33` | `--gt-deep` | Brand backgrounds: social image, gradient end |
| Ink | `#1e1f22` | `#eef0f1` | `--gt-ink` | Text |
| Muted | `#5b6168` | `#a9b0b6` | `--gt-muted` | Dates, reading time, captions |
| Paper | `#ffffff` | `#121418` | `--gt-paper` | Page background |
| Surface | `#f7f5f0` | `#1a1d1f` | `--gt-surface` | Cards, panels, code blocks (warm paper) |
| Border | `#e2ddd3` | `#2c3135` | `--gt-border` | Lines and dividers |

Measured contrast (light / dark): ink on paper 16.48 / 16.13; muted on paper 6.26 / 8.40; muted on surface 5.75 / 7.72; primary on paper 6.26 / 11.86; primary on surface 5.74 / 10.89; primary on primary soft 5.38 / 8.54; white on primary 6.26; lime on deep 9.47.

**Gradient:** primary → deep, top-left to bottom-right, with a lime glow (28% → 0) at the top right — social images and any brand banner.

## Typography

**System fonts only** — no webfont request, no layout shift, the device’s own reading face.

- Sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (with `system-ui` first on the site).
- Mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`.
- Headings bold (700) with a tight track (−0.02em; −0.03em for the h1); text regular at 1rem or more, line height 1.6 (1.7 in articles).
- Fluid scale (`clamp()`): h1 2–3.25rem, h2 1.375–1.75rem, h3 1.125–1.25rem, lead 1.125–1.25rem, small 0.875rem.

## Mascot

The **Wapuu Chameleon Firefighter** — in Portuguese, **Wapuu Camaleão Bombeiro**: a green chameleon in firefighter gear and helmet, hugging a red extinguisher with the WordPress logo, its tail curled in the same spiral as the mark. It says the other half of the name: adapting to each project, and putting out the fires when a site breaks. The gear is also a true story: at WordCamp São Paulo 2019 the owner, a volunteer, smelled something burning and got ready with an extinguisher — an electrical fire that went out when the device was unplugged. Prepared, not needed. (Told on the About page.)

- **Name:** a proper name, one per language — “Wapuu Chameleon Firefighter” on English pages, “Wapuu Camaleão Bombeiro” on Portuguese ones. Never abbreviated, never mixed (no English name on a Portuguese page).
- **Source:** [`brand/wapuu-firefighter.webp`](brand/wapuu-firefighter.webp) (1024², on white), made by the owner in a wapuu generator.
- **On the site:** `src/assets/wapuu.webp`, generated by `npm run brand` as a **sticker** (WhatsApp style): the white around it removed (flood fill from the edges), then a 20px white outline around the visible drawing (the alpha mask grown with a distance transform, one-pixel soft edge) and a soft deep-green shadow 8px below — so it reads the same on light and dark backgrounds.
- **Where:** the About page (large, next to the intro), small in the footer as the link to About, and as a pixel-art sprite in the game (the 404 and `/game/`). Not in the header, not on post cards — the mark is the logo; the mascot is the personality.
- **Alt text:** describe it (“A green chameleon wapuu in firefighter gear…”) where it is content; `alt=""` where a text link next to it already says where it goes (footer).
- **Credit:** Wapuu is the WordPress community’s mascot, created by Kazuko Kaneuchi and shared under the GPL — credited on the About page.
- Don’t recolor it, crop the tail, or use it as the favicon.

### In the game

The game ([`/game/`](src/pages/game/index.astro), [`/pt-br/jogo/`](src/pages/pt-br/jogo/index.astro) and the 404) draws the mascot as a **32-bit-era pixel sprite**: 128×144, black outline, a fixed palette taken from the artwork, light from the top left (a highlight, a shade and a deep shade per material).

- **Poses:** made by the owner in an image generator from the mascot, with the mascot attached as the reference — standing with the hose nozzle pointing straight up ([`brand/wapuu-game-stand.webp`](brand/wapuu-game-stand.webp)), a step with the right foot ([`brand/wapuu-game-step.webp`](brand/wapuu-game-step.webp)) and a 2×2 sheet with a step with the left foot, spraying and hit ([`brand/wapuu-game-poses.webp`](brand/wapuu-game-poses.webp)). New poses: same character, same framing, full body, plain white background.
- **Sprite sheet:** `npm run game-sprites` ([`scripts/game-sprites.mjs`](scripts/game-sprites.mjs)) cuts each pose from its background (foam, smoke and impact lines go: the game draws them), puts them at one scale aligned at the feet, and writes the five frames to `src/assets/game/wapuu.png`, plus the game pages’ social images (`og-en.png`, `og-pt-br.png`). Run it on a Mac and commit the output.
- **Never** redraw the face or the helmet by hand: a hand-made sprite loses the character. Change the source pose instead.

## Icons

Line icons on a 24px grid, 1.75px stroke, round caps and joins — the mark’s line at small size. Inline SVG, `aria-hidden="true"` unless the icon is the only label (then a visually hidden text).

## Images

- **Post thumbnails:** square, 1024×1024 JPG or PNG, next to the post (`thumbnail.jpg`). The site crops them with `object-fit: cover` in cards and shows them whole on the post.
- They are decorative next to the title (`alt=""`); the title names the post.
- **Social image:** 1200×630, generated per language (`src/assets/og-en.png`, `og-pt-br.png`) for listings; a post uses its own thumbnail.

## Voice

- **A senior developer talking to peers.** Direct, practical, opinionated — and honest about trade-offs (“it depends” followed by what it depends on).
- **WordPress’s own words.** Blocks, hooks, theme.json, the Site Editor — named as WordPress names them.
- **Short sentences, real examples.** A question at the end invites the reader to answer.
- **Two languages, same voice.** English first; Brazilian Portuguese is a translation that reads as if written in Portuguese, not word for word.
- UI copy is plain: “All posts”, “5 min read”, “Read in Portuguese”.
