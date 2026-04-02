import type { ImageMetadata } from "astro";

type Locale = "en" | "pt-BR";

const enThumbJpg = import.meta.glob<{ default: ImageMetadata }>("/posts/*/thumbnail.jpg", { eager: true });
const enThumbPng = import.meta.glob<{ default: ImageMetadata }>("/posts/*/thumbnail.png", { eager: true });
const ptThumbJpg = import.meta.glob<{ default: ImageMetadata }>("/i18n/pt-BR/*/thumbnail.jpg", { eager: true });
const ptThumbPng = import.meta.glob<{ default: ImageMetadata }>("/i18n/pt-BR/*/thumbnail.png", { eager: true });

const getEnThumbnail = (slug: string): ImageMetadata | null => {
  const jpgPath = `/posts/${slug}/thumbnail.jpg`;
  const pngPath = `/posts/${slug}/thumbnail.png`;

  return enThumbJpg[jpgPath]?.default ?? enThumbPng[pngPath]?.default ?? null;
};

export const getPostThumbnail = (slug: string, locale: Locale, originSlug?: string): ImageMetadata | null => {
  if (locale === "pt-BR") {
    const jpgPath = `/i18n/pt-BR/${slug}/thumbnail.jpg`;
    const pngPath = `/i18n/pt-BR/${slug}/thumbnail.png`;

    const ptThumbnail = ptThumbJpg[jpgPath]?.default ?? ptThumbPng[pngPath]?.default ?? null;
    if (ptThumbnail) {
      return ptThumbnail;
    }

    return originSlug ? getEnThumbnail(originSlug) : null;
  }

  return getEnThumbnail(slug);
};
