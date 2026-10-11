# Astro Blog

This project uses the posts folder as the single source of truth for blog content.

## Structure

- Primary content: posts/<slug>/post.md + thumbnail.jpg|png
- Portuguese content: i18n/pt-BR/<slug>/post.md

## How It Works

1. Astro reads posts directly from the posts folder.
2. List and detail pages are generated statically.

## Commands

- npm run dev: start Astro in development mode.
- npm run build: generate a static production build.
- npm run check: type-check the project (astro check).
- npm run preview: preview the production build locally (http://127.0.0.1:4321; stop with `npx astro preview stop`).
- npm run brand: rebuild the logos, favicon, social images and color tokens from brand/palette.json, and check contrast.
- npm run lighthouse: Lighthouse (all five categories) on the built pages, mobile and desktop, light and dark; `-- --all` for every page, `-- --pages=/a/,/b/` for some, `-- --base=https://camaleaun.github.io` for the live site.

## Brand and design system

Internal references, not published on the blog:

- [BRAND.md](BRAND.md): the mark, logo versions, colors, type, images and voice. Files in [brand/](brand/).
- [DESIGN.md](DESIGN.md): principles, tokens, breakpoints, components and content patterns.

If you use a web container, you can run:

- docker compose exec web bash -lc "npm run dev"
