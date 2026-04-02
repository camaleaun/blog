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
- npm run preview: preview the production build locally.

If you use a web container, you can run:

- docker compose exec web bash -lc "npm run dev"
