// Copy of the About page. Facts come from the owner's public profiles
// (GitHub bio, repositories); ask before adding anything new.
import { githubUrl, instagramUrl, linkedinUrl, t, wordpressOrgUrl, type Locale } from "../lib/i18n";

interface Project {
  name: string;
  href: string;
  text: string;
}

interface About {
  title: string;
  description: string;
  heading: string;
  intro: string[];
  projectsHeading: string;
  projects: Project[];
  mascotHeading: string;
  mascot: string[];
  wapuuCredit: string;
  linksHeading: string;
  links: { label: string; href: string }[];
  mascotAlt: string;
  photoAlt: string;
}

const links = [
  { label: "GitHub", href: githubUrl },
  { label: "WordPress.org", href: wordpressOrgUrl },
  { label: "LinkedIn", href: linkedinUrl },
  { label: "Instagram", href: instagramUrl }
];

export const about: Record<Locale, About> = {
  en: {
    title: "About Gilberto Tavares",
    description:
      "Gilberto Tavares (camaleaun) is a WordPress specialist from Joinville, Brazil, using WordPress since 2007 and building with it professionally since 2013.",
    heading: "Hi, I’m Gilberto Tavares",
    intro: [
      "I’m a WordPress specialist from Joinville, Santa Catarina, Brazil — camaleaun on the web. I’ve used WordPress since 2007, built with it professionally since 2013, and graduated in IT in 2016.",
      "This blog is where I write down what real projects teach me: themes and blocks, plugins, performance and security, and the business around them — pricing, deadlines, teams. The posts start on LinkedIn and live here in English and Brazilian Portuguese.",
      "I care about web development and open source, so most of what I build is public."
    ],
    projectsHeading: "Things I build",
    projects: [
      {
        name: "Exporter Importer Z",
        href: t("en").pluginsUrl,
        text: "Exporter Importer Z moves WordPress content with its media, settings and files — free and open source."
      }
    ],
    mascotHeading: "Why a chameleon?",
    mascot: [
      "camaleaun comes from camaleão, Portuguese for chameleon: every project asks for something different, and the job is to adapt without losing your own color.",
      "My wapuu is a chameleon in firefighter gear holding a WordPress extinguisher — for the days the work is putting out fires: the broken site, the update that went wrong, the deadline that is tomorrow.",
      "There is a true story behind the gear, too. At WordCamp São Paulo 2019, where I was a volunteer, we smelled something burning. I found an extinguisher and got ready. It was an electrical fire, and it went out as soon as the device was unplugged — I didn’t need to put anything out, but I was prepared."
    ],
    wapuuCredit: "Wapuu is the WordPress community’s mascot, created by Kazuko Kaneuchi and shared under the GPL.",
    linksHeading: "Find me",
    links,
    mascotAlt: "A green chameleon wapuu in firefighter gear, hugging a red extinguisher with the WordPress logo, its tail curled in a spiral",
    photoAlt: "Gilberto Tavares smiling outdoors, with a laptop in front of him"
  },
  "pt-BR": {
    title: "Sobre Gilberto Tavares",
    description:
      "Gilberto Tavares (camaleaun) é especialista em WordPress em Joinville (SC), usa WordPress desde 2007 e trabalha com ele profissionalmente desde 2013.",
    heading: "Oi, eu sou o Gilberto Tavares",
    intro: [
      "Sou especialista em WordPress em Joinville, Santa Catarina — camaleaun na internet. Uso WordPress desde 2007, trabalho com ele profissionalmente desde 2013 e me formei em TI em 2016.",
      "Este blog é onde registro o que os projetos reais me ensinam: temas e blocos, plugins, performance e segurança, e o negócio em volta disso — preço, prazo, equipe. Os posts nascem no LinkedIn e moram aqui, em inglês e português.",
      "Gosto de desenvolvimento web e de código aberto, então quase tudo o que eu construo é público."
    ],
    projectsHeading: "O que eu construo",
    projects: [
      {
        name: "Exporter Importer Z",
        href: t("pt-BR").pluginsUrl,
        text: "O Exporter Importer Z leva conteúdo WordPress com mídia, configurações e arquivos — gratuito e de código aberto."
      }
    ],
    mascotHeading: "Por que um camaleão?",
    mascot: [
      "camaleaun vem de camaleão: cada projeto pede uma coisa diferente, e o trabalho é se adaptar sem perder a própria cor.",
      "Meu wapuu é um camaleão de bombeiro abraçado a um extintor do WordPress — para os dias em que o trabalho é apagar incêndio: o site fora do ar, a atualização que deu errado, o prazo que é amanhã.",
      "E tem uma história real por trás da roupa. No WordCamp São Paulo 2019, onde eu era voluntário, sentimos cheiro de queimado. Localizei um extintor e me preparei. Era um fogo elétrico, e ele se apagou assim que o aparelho foi desligado da tomada — não precisei apagar nada, mas estava preparado."
    ],
    wapuuCredit: "O wapuu é o mascote da comunidade WordPress, criado por Kazuko Kaneuchi e compartilhado sob a GPL.",
    linksHeading: "Onde me encontrar",
    links,
    mascotAlt: "Um wapuu camaleão verde com roupa de bombeiro, abraçado a um extintor vermelho com o logo do WordPress, com a cauda enrolada em espiral",
    photoAlt: "Gilberto Tavares sorrindo ao ar livre, com um notebook à frente"
  }
};
