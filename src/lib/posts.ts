import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { baseUrl, type Locale } from "./i18n";
import { getPostThumbnail } from "./getPostThumbnail";
import { readingTime } from "./readingTime";
import { sanitizeEmoji } from "./sanitizeEmoji";

export interface Post {
  entry: CollectionEntry<"posts"> | CollectionEntry<"postsPt">;
  locale: Locale;
  title: string;
  description: string;
  date: Date;
  href: string;
  thumbnail: ImageMetadata | null;
  minutes: number;
  /** URL of the same post in the other language, when it exists. */
  translationHref?: string;
}

// LinkedIn cuts descriptions mid-sentence; mark the cut.
const excerpt = (text: string) => {
  const clean = sanitizeEmoji(text).trim();
  return /[.!?…:)"”]$/.test(clean) ? clean : `${clean.replace(/[\s,;–—-]+$/, "")}…`;
};

const enHref = (slug: string) => `${baseUrl}${slug}/`;
const ptHref = (slug: string) => `${baseUrl}pt-br/${slug}/`;
const newestFirst = (a: Post, b: Post) => b.date.getTime() - a.date.getTime();

export const getPosts = async (locale: Locale): Promise<Post[]> => {
  const [en, pt] = await Promise.all([getCollection("posts"), getCollection("postsPt")]);

  if (locale === "pt-BR") {
    const enSlugs = new Set(en.map((post) => post.data.slug));
    return pt
      .map((entry): Post => ({
        entry,
        locale,
        title: sanitizeEmoji(entry.data.title),
        description: excerpt(entry.data.description),
        date: entry.data.pubDate,
        href: ptHref(entry.data.slug),
        thumbnail: getPostThumbnail(entry.data.slug, "pt-BR", entry.data.origin),
        minutes: readingTime(entry.body),
        translationHref: enSlugs.has(entry.data.origin) ? enHref(entry.data.origin) : undefined
      }))
      .sort(newestFirst);
  }

  const translations = new Map(pt.map((post) => [post.data.origin, post.data.slug]));
  return en
    .map((entry): Post => {
      const translation = translations.get(entry.data.slug);
      return {
        entry,
        locale,
        title: sanitizeEmoji(entry.data.title),
        description: excerpt(entry.data.description),
        date: entry.data.pubDate,
        href: enHref(entry.data.slug),
        thumbnail: getPostThumbnail(entry.data.slug, "en"),
        minutes: readingTime(entry.body),
        translationHref: translation ? ptHref(translation) : undefined
      };
    })
    .sort(newestFirst);
};
