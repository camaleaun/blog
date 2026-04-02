import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: "*/post.md",
    base: "./posts"
  }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      timestamp: z.string(),
      slug: z.string(),
      sourceId: z.string(),
      thumbnail: z.string().optional()
    })
});

const postsPt = defineCollection({
  loader: glob({
    pattern: "*/post.md",
    base: "./i18n/pt-BR"
  }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      timestamp: z.string(),
      slug: z.string(),
      sourceId: z.string(),
      origin: z.string(),
      thumbnail: z.string().optional()
    })
});

export const collections = { posts, postsPt };
