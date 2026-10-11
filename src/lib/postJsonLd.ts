import { githubUrl, siteName } from "./i18n";
import type { Post } from "./posts";

export const postJsonLd = (post: Post, url: URL, image?: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  datePublished: post.date.toISOString(),
  inLanguage: post.locale,
  mainEntityOfPage: url.href,
  url: url.href,
  ...(image ? { image } : {}),
  author: { "@type": "Person", name: siteName, alternateName: "camaleaun", url: githubUrl }
});
