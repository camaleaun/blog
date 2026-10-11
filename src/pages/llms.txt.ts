import type { APIRoute } from "astro";
import { githubUrl, siteName, t } from "../lib/i18n";
import { getPosts } from "../lib/posts";
import { isoDate } from "../lib/isoDate";

// https://llmstxt.org/
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const [en, pt] = await Promise.all([getPosts("en"), getPosts("pt-BR")]);
  const list = (posts: typeof en) =>
    posts.map((post) => `- [${post.title}](${url(post.href)}) (${isoDate(post.date)}): ${post.description}`).join("\n");

  const body = `# ${siteName} (camaleaun)

> ${t("en").tagline}. ${t("en").intro} Posts in English and Brazilian Portuguese.

- Home (English): ${url(t("en").homeUrl)}
- Home (Português): ${url(t("pt-BR").homeUrl)}
- Plugins: ${url(t("en").pluginsUrl)} (Português: ${url(t("pt-BR").pluginsUrl)})
- About the author: ${url(t("en").aboutUrl)} (Português: ${url(t("pt-BR").aboutUrl)})
- GitHub: ${githubUrl}

## Posts (English)

${list(en)}

## Posts (Português)

${list(pt)}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
