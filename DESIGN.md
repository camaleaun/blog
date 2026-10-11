# Blog — design system

What the blog is made of: principles, tokens, breakpoints, components and content patterns. Internal reference only — never published as a page. For the mark, colors’ meaning, type and voice, see [BRAND.md](BRAND.md). Keep this file in step with the code: a change to a token or component changes this file in the same commit.

## Principles

- **Reading first.** The post is the product: a calm page, a comfortable measure (~68ch), generous line height, no clutter around the text.
- **Semantic HTML.** Landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, lists for lists, `article` per post, `time datetime` for dates.
- **Accessible (WCAG 2.2 AA).** A skip link, a visible focus ring (`:focus-visible`, 2px primary, 2px offset), 40px minimum targets, contrast checked by `npm run brand`, `prefers-reduced-motion` respected, everything usable by keyboard.
- **Fast.** Static HTML, CSS inlined per page, system fonts, AVIF/WebP images with `srcset`, the LCP image eager with `fetchpriority="high"`. The only script on every page is the theme switch; the game (404 and `/game/`) adds its own, and its code loads only on Play. Lighthouse 100 in all five categories (performance, accessibility, best practices, SEO, agentic browsing), mobile and desktop, light and dark (`npm run lighthouse`).
- **Light and dark.** Every color token uses `light-dark()`; the theme follows the system unless the reader picks one (stored in `localStorage`, applied before first paint).
- **Two languages.** English at `/`, Brazilian Portuguese at `/pt-br/`; every page links to its translation (`hreflang`) and the UI strings come from one file.
- **Agent-ready.** `/llms.txt` lists every post in both languages with its summary; `robots.txt` points to the sitemap.

## Tokens

Colors are generated from [`brand/palette.json`](brand/palette.json) into [`src/styles/_colors.scss`](src/styles/_colors.scss); the rest live in [`src/styles/tokens.scss`](src/styles/tokens.scss), emitted once by the global stylesheet. All tokens use the `--gt-` prefix.

| Group | Tokens |
| --- | --- |
| Color | `--gt-primary`, `--gt-primary-strong`, `--gt-primary-soft`, `--gt-accent`, `--gt-deep`, `--gt-ink`, `--gt-muted`, `--gt-paper`, `--gt-surface`, `--gt-border` (values in BRAND.md) |
| Type | `--gt-font` (system sans), `--gt-mono`; sizes `--gt-text-sm` 0.875rem, `--gt-text` 1rem, `--gt-text-lg` (lead, fluid), `--gt-h3`, `--gt-h2`, `--gt-h1` (fluid, `clamp()`); `--gt-leading` 1.6, `--gt-leading-prose` 1.7 |
| Space | `--gt-space-1 … 24` in 0.25rem steps (1, 2, 3, 4, 6, 8, 12, 16, 24) |
| Radius | `--gt-radius-sm` 0.375rem, `--gt-radius` 0.75rem, `--gt-radius-lg` 1.25rem, `--gt-radius-full` |
| Shadow | `--gt-shadow` (rest), `--gt-shadow-lg` (hover) — soft, tinted with ink, lighter in dark |
| Width | `--gt-width` 80rem (container), `--gt-reading` 68ch (prose), `--gt-gutter` fluid 1rem → 2rem |
| Target | `--gt-target` 2.5rem (40px) |
| Motion | `--gt-ease` `cubic-bezier(.2, .7, .2, 1)`, `--gt-duration` 200ms; zero under `prefers-reduced-motion` |

## Breakpoints

WordPress’s **viewport style states** — the same `@mobile` / `@tablet` / `@desktop` the block editor uses (Gutenberg `WP_Theme_JSON::DEFAULT_VIEWPORT_BREAKPOINTS`, since WordPress 7.1: mobile 480px, tablet 782px), written in rem with the same range queries. Mixins in [`src/styles/_mq.scss`](src/styles/_mq.scss) (mixins only — `@use '../styles/mq' as *`).

| State | Query | Mixin | On this blog |
| --- | --- | --- | --- |
| `@mobile` | `(width <= 30rem)` | `mobile` | One column; header stacks brand over tools; 1rem gutter |
| `@tablet` | `(30rem < width <= 48.875rem)` | `tablet` | Two-column post grid (`above-mobile`); header on one row; featured post stacks (image over text) |
| `@desktop` | `(width > 48.875rem)` | `desktop` | Featured post and the post header side by side; 2rem gutter |

Inside `@desktop`, two content widths from `@wordpress/base-styles` (`break-large` 960px, `break-wide` 1280px), as `min-width` mixins `large` (60rem) and `wide` (80rem): the post grid goes to **three columns at 60rem**, and the container stops growing at 80rem.

`above-mobile` (`width > 30rem`) covers tablet and desktop together. Mobile first: base styles are the phone; the mixins add. Test at 375, 480, 600, 782, 960, 1280 and 1440px — no sideways scroll anywhere.

## Layout

- **Header** (`site-header`): the brand (mark + “Gilberto Tavares” + “camaleaun”) linking home, a `nav` labelled “Main” with the Plugins and About links, a thin rule (dropped on `@mobile`) and the two language links, and the theme button. On `@mobile` the nav drops to a second row. **Sticky** (`position: sticky; top: 0`), translucent paper with a backdrop blur (solid paper where `backdrop-filter` is missing); `scroll-padding-top: 6rem` keeps anchors clear of it.
- **Main** (`#main`): the page; a skip link (“Skip to content”) is the first focusable element.
- **Footer**: the small mascot + “About the author” link, © year, name and handle, a note that the blog is written in both languages, and a link to GitHub (`rel="me"`).
- Container: `min(100% - 2 × gutter, --gt-width)`, centered.

## Components

All in [`src/components/`](src/components/). No client JavaScript except `ThemeToggle` and `ExtinguisherGame`.

| Component | Props | Notes |
| --- | --- | --- |
| `Brand` | `locale` | The mark inline (same path as `brand/mark.svg`; the square stays brand green in both themes) + name + handle as text, linking to the locale’s home |
| `LanguageSwitch` | `locale`, `enUrl`, `ptUrl` | Two links, “English” and “Português”, with `lang` and `hreflang`; the current one has `aria-current="page"`. On a post they point to its translation when there is one, otherwise to the other language’s home |
| `ThemeToggle` | `locale` | One button cycling Auto → Light → Dark; its name says the current mode (“Theme: Auto”). Stored as `theme-mode` in `localStorage`; an inline script in `head` sets `data-theme`/`data-theme-mode` and the `.js` class before paint. Hidden without JavaScript |
| `PostList` | `posts`, `locale` | Page header (`h1` tagline + intro), then a `section` with a visually hidden `h2` and an `ol` of `PostCard`s; the newest is `featured` and spans the row |
| `PostCard` | `post`, `featured` | `article` inside `li`. One link — the title, an `h2` — stretched over the card (`::after`), so the whole card is clickable and is one stop for keyboards and screen readers. Square image, `alt=""`, lazy (the featured one is eager, `fetchpriority="high"`: the listing’s LCP, and keeps the image’s own ratio below desktop). Meta: `time` + reading time. Excerpt clamped to 3 lines (4 when featured). Hover: lift + image zoom (none with reduced motion) |
| `PostArticle` | `post` | `article` (max 64rem) with a `header` (back link, `h1`, meta: `time`, reading time, “Read in …” link to the translation), the square cover beside it on desktop (eager, high priority, `alt=""`), the `.prose` body and a `footer` (back to all posts). No lead paragraph: LinkedIn descriptions repeat the first lines. The page adds JSON-LD `BlogPosting` |
| `.prose` (global style) | — | The Markdown body: 68ch measure, fluid size, 1.7 line height, styled lists, links (underlined, 0.15em offset), `blockquote`, `code`/`pre` (Shiki high-contrast light/dark, following the color scheme), `hr`, images. A paragraph made only of hashtags becomes a `ul.tags` of chips (`src/lib/rehypeHashtags.ts`) |
| `AboutPage` | `locale` | `/about/` and `/pt-br/sobre/`: the author photo in a circle (`src/assets/avatar.jpg`, the GitHub avatar saved locally — no request to GitHub; 7rem, brand-green ring, centered on the face with `object-position: 60% 30%`) above the `h1`, intro beside the mascot (above it on mobile, eager — the LCP), “Things I build” cards (one stretched link each; today only Exporter Importer Z, linking to Plugins), “Why a chameleon?”, links (`rel="me"`: GitHub, WordPress.org, LinkedIn, Instagram). Copy in [`src/data/about.ts`](src/data/about.ts) — only facts from the owner’s public profiles. JSON-LD `ProfilePage` + `Person` |
| `PluginsPage` | `locale` | `/plugins/` and `/pt-br/plugins/`: page header, then one `article` per plugin (status, `h2`, text, fact chips, links — several links, so no stretched link); the first spans the row as the featured one. Data in [`src/data/plugins.ts`](src/data/plugins.ts); a plugin with `hidden: true` stays in the data but is not shown — today only Exporter Importer Z is visible (owner’s call) |
| 404 | — | [`src/pages/404.astro`](src/pages/404.astro): no canonical (GitHub Pages answers it with status 404, so it is never indexed; a `noindex` would cost the Lighthouse SEO score). One page for both languages (GitHub Pages serves a single `404.html`) that **follows the URL**: under `/pt-br/` everything is Portuguese, elsewhere English. Header, footer and message come in both languages, each tagged `data-locale`; `BaseLayout`’s `bilingual` prop adds a script in `head` that sets `lang`, the title and the description before first paint, and a global rule hides the other language (`display: none`, so it is out of the accessibility tree too). Without JavaScript it is English. Then the message, a button to the locale’s home, one to the game page, and the game |
| `SiteHeader` | `locale`, `enUrl`, `ptUrl`, `tagged` | The skip link + header, out of `BaseLayout`; `tagged` adds `data-locale` (the 404 renders one per language) |
| `SiteFooter` | `locales` | The footer; given both locales (the 404) it is one footer with each text tagged `data-locale` and the mascot image once — a hidden copy of an image costs the Lighthouse best-practices score |
| `ExtinguisherGame` | `locale` (none on the 404: both languages) | The **Wapuu Chameleon Firefighter** game: a stage (canvas + overlay with the idle sprite, the name, the tagline, Play and hints — keys, or swipe on touch screens), a bar with the score, best, lives and combo (`dl`) and the sound, pause and full-screen buttons. Static until Play: then the code in `src/game/` loads (the 11 KB sprite sheet is already there, for the idle frame). Hidden without JavaScript. 16:10 (3:4 `@mobile`), never taller than the viewport under the header; the canvas buffer matches its box in device pixels and draws without smoothing. Endless lanes game: flames fall down three columns, the wapuu changes column (←/→, A/D, swipe or tap) and sprays on its own; a flame at the bottom costs a life; combo multiplies points; a level every 30 s. The end screen celebrates (“Nice work, firefighter!”) and offers sharing: the system share sheet with a score card image where supported, plus WhatsApp, X, LinkedIn, Facebook links and Copy link (plain links, no third-party script) to the game page. Its own night palette in both themes; strings in [`src/game/i18n.ts`](src/game/i18n.ts); best score and sound choice in `localStorage` |
| `GamePage` | `locale` | `/game/` and `/pt-br/jogo/`: `h1` with the mascot’s name, intro, the game, the Wapuu credit; social image from `npm run game-sprites`, JSON-LD `VideoGame` |
| `Icon` | `name`, `size`, `label` | 24px line icons (sun, moon, auto, arrows, globe, GitHub); decorative unless `label` |

Layout: [`BaseLayout`](src/layouts/BaseLayout.astro) — `head` (title, description, canonical, `hreflang` alternates only when the page is translated, Open Graph/Twitter with the post’s thumbnail or the locale’s social image, `theme-color`, favicon, touch icon, JSON-LD), `SiteHeader` (skip link + header), main, `SiteFooter`; with `bilingual` (the 404) header and footer once per language.

Data: [`src/lib/posts.ts`](src/lib/posts.ts) `getPosts(locale)` gives every page the same shape (title and excerpt without emoji, date, link, thumbnail, reading time, translation link).

## Content patterns

- **Title:** the post’s title, emoji removed in cards and the `h1` (`sanitizeEmoji`), kept in the frontmatter.
- **Excerpt:** the frontmatter `description`, emoji removed, an ellipsis added when LinkedIn cut it mid-sentence, up to 24 words (40 when featured, `truncateSummary`), clamped to 3 lines.
- **Date:** `time datetime="YYYY-MM-DD"`, shown as “Jul 1, 2025” / “1 de jul. de 2025” (`formatDate`).
- **Reading time:** words ÷ 200, at least 1 — “5 min read” / “5 min de leitura”.
- **UI strings:** [`src/lib/i18n.ts`](src/lib/i18n.ts), one object per locale. No string is hard-coded in a component.

## Images

Thumbnails go through `astro:assets` `<Picture formats={["avif", "webp"]}>` with `widths` and `sizes`; cards are lazy except the featured one (the LCP on listings), the cover on a post is eager with `fetchpriority="high"`. Always pass real `width`/`height` (Astro does) so nothing shifts.
