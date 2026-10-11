---
title: "Exporter Importer Z: move your WordPress content, not your mess"
description: "I built a free, open source plugin that moves WordPress content with its images, settings and homepage — no database dump, no search-and-replace."
pubDate: "2026-10-11T03:02:19.000Z"
timestamp: "20261011030219"
slug: "exporter-importer-z-move-your-wordpress-content-not-your-mess"
sourceId: "20261011030219"
---
Every WordPress developer knows this moment: you need to move *part* of a site — a landing page, a product catalog, a set of pages from staging to production — and the tools you have don't quite fit.

**WordPress's own export** only points to your media. The importer has to download every image from the old site, and if it's offline, slow or behind a login, you get gray boxes. Settings don't travel either: your homepage, posts page, shop and checkout arrive as ordinary pages.

**Migration plugins** go the other way: they copy the whole database — transients, logs, sessions, tables from plugins you deleted years ago — and overwrite the site you were importing into.

So I built the middle way: **Exporter Importer Z**.

**What it does:**
- **You choose what moves.** On Tools → Export, pick content types, exact items or filters, and the settings that go with them. The homepage, the shop and the checkout wear badges, so you never leave a key page behind.
- **One complete file.** Content, the media it uses (attached or just used in the content), the settings that point to it and each post as readable .html — in one .wxrz or .zip.
- **Imported with the tool you know.** Upload it to the WordPress Importer: media comes from the file, IDs are remapped, the homepage is still the homepage. No search-and-replace.
- **A whole site in the browser.** Export a WordPress Playground .zip with the theme and plugins you choose. A copy made on your local server opens on playground.wordpress.net, or offline with `npx @wp-playground/cli`.
- **Built for AI agents.** Every export, import, copy and setting is an ability of the WordPress Abilities API — callable over MCP, REST, PHP or WP-CLI. The docs are agent-ready too (llms.txt and every page as Markdown).

It's **free and open source** under the GPL: no account, no license key, no "pro" version holding features back.

**Try it:**
- [Site, docs and a 1-minute demo video](https://eizport.github.io/)
- [Live demo in your browser](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/eizport/exporter-importer-z/main/playground/blueprint.json) (WordPress Playground)
- [Source and releases on GitHub](https://github.com/eizport/exporter-importer-z)

If it saves you an afternoon of re-uploading images and rebuilding a homepage, a star on GitHub, an issue or a note to someone moving a site helps a lot — and so does [supporting it](https://eizport.github.io/donate/).

What's the most painful content move you've had to do in WordPress?

#WordPress #WordPressPlugin #OpenSource #WebDevelopment #WordPressPlayground #AI
