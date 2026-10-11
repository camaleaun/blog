export type Locale = "en" | "pt-BR";

export const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const siteName = "Gilberto Tavares";
export const handle = "camaleaun";
export const githubUrl = "https://github.com/camaleaun";
export const wordpressOrgUrl = "https://profiles.wordpress.org/camaleaun/";
export const linkedinUrl = "https://www.linkedin.com/in/gilbertoetavares/";
export const instagramUrl = "https://www.instagram.com/camaleaun/";

const strings = {
  en: {
    homeUrl: baseUrl,
    ogLocale: "en_US",
    tagline: "Notes on building with WordPress",
    intro: "Practice, opinions and lessons from real WordPress projects — themes, plugins, performance and the business around them.",
    skip: "Skip to content",
    home: "Gilberto Tavares, camaleaun — home",
    language: "Language",
    languageName: "English",
    allPosts: "All posts",
    postsHeading: "Latest posts",
    readingTime: (minutes: number) => `${minutes} min read`,
    readIn: "Leia em português",
    tags: "Tags",
    theme: "Theme",
    themeModes: { auto: "Auto", light: "Light", dark: "Dark" },
    footer: "Written in English and Brazilian Portuguese.",
    github: "GitHub",
    menu: "Main",
    about: "About",
    aboutUrl: `${baseUrl}about/`,
    plugins: "Plugins",
    pluginsUrl: `${baseUrl}plugins/`,
    aboutAuthor: "About the author",
    notFoundTitle: "Page not found",
    notFoundText: "This page went up in smoke — or never existed. The wapuu is on it.",
    notFoundHome: "Go to the latest posts"
  },
  "pt-BR": {
    homeUrl: `${baseUrl}pt-br/`,
    ogLocale: "pt_BR",
    tagline: "Notas sobre construir com WordPress",
    intro: "Prática, opiniões e lições de projetos WordPress reais — temas, plugins, performance e o negócio em volta deles.",
    skip: "Ir para o conteúdo",
    home: "Gilberto Tavares, camaleaun — início",
    language: "Idioma",
    languageName: "Português",
    allPosts: "Todos os posts",
    postsHeading: "Posts recentes",
    readingTime: (minutes: number) => `${minutes} min de leitura`,
    readIn: "Read in English",
    tags: "Tags",
    theme: "Tema",
    themeModes: { auto: "Automático", light: "Claro", dark: "Escuro" },
    footer: "Escrito em inglês e português do Brasil.",
    github: "GitHub",
    menu: "Principal",
    about: "Sobre",
    aboutUrl: `${baseUrl}pt-br/sobre/`,
    plugins: "Plugins",
    pluginsUrl: `${baseUrl}pt-br/plugins/`,
    aboutAuthor: "Sobre o autor",
    notFoundTitle: "Página não encontrada",
    notFoundText: "Esta página virou fumaça — ou nunca existiu. O wapuu já está cuidando disso.",
    notFoundHome: "Ver os posts recentes"
  }
} as const;

export const t = (locale: Locale) => strings[locale];
