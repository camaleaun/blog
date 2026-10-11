import { githubUrl, instagramUrl, linkedinUrl, siteName, wordpressOrgUrl } from "./i18n";

export const aboutJsonLd = (url: URL, description: string) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: url.href,
  mainEntity: {
    "@type": "Person",
    name: siteName,
    alternateName: "camaleaun",
    description,
    address: { "@type": "PostalAddress", addressLocality: "Joinville", addressRegion: "SC", addressCountry: "BR" },
    sameAs: [githubUrl, wordpressOrgUrl, linkedinUrl, instagramUrl]
  }
});
