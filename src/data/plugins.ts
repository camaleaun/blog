// The owner's public WordPress plugins. Facts come from each repository's
// README/description; keep links to things that exist.
import type { Locale } from "../lib/i18n";

export interface PluginLink {
  label: string;
  href: string;
}

export interface Plugin {
  name: string;
  status: string;
  text: string;
  facts: string[];
  links: PluginLink[];
  /** Kept for later; not shown on the page yet (owner's call). */
  hidden?: boolean;
}

interface PluginsPage {
  title: string;
  description: string;
  heading: string;
  intro: string;
  plugins: Plugin[];
}

const gh = (repo: string) => `https://github.com/${repo}`;
const playground = (blueprint: string) => `https://playground.wordpress.net/?blueprint-url=${blueprint}`;
const eizBlueprint = "https://raw.githubusercontent.com/eizport/exporter-importer-z/main/playground/blueprint.json";
const cupBlueprint = "https://raw.githubusercontent.com/camaleaun/camaleaun-worldcup2026/trunk/blueprints/blueprint.json";

export const pluginsPage: Record<Locale, PluginsPage> = {
  en: {
    title: "WordPress plugins by Gilberto Tavares",
    description: "Free, open source WordPress plugins by Gilberto Tavares (camaleaun), starting with Exporter Importer Z: move WordPress content with its media, settings and files.",
    heading: "Plugins",
    intro: "Free and open source, under the GPL.",
    plugins: [
      {
        name: "Exporter Importer Z",
        status: "Plugin",
        text: "Moves WordPress content with its media, settings and files: .wxrz bundles for the WordPress Importer, WordPress Playground zips, and abilities for AI agents.",
        facts: ["Abilities API", "WooCommerce", "Playground"],
        links: [
          { label: "Site and docs", href: "https://eizport.github.io/" },
          { label: "Live demo", href: playground(eizBlueprint) },
          { label: "GitHub", href: gh("eizport/exporter-importer-z") }
        ]
      },
      {
        name: "Camaleaunmail",
        hidden: true,
        status: "Plugin",
        text: "Sends WordPress email through any SMTP server, keeps a log of every email you can read, resend or delete, and stops local and staging copies of a site from mailing real people.",
        facts: ["SMTP", "Email log", "WordPress 6.9+"],
        links: [{ label: "GitHub", href: gh("camaleaun/camaleaunmail") }]
      },
      {
        name: "FIFA World Cup 2026™ Schedule",
        hidden: true,
        status: "Block",
        text: "The World Cup 2026 schedule as a Gutenberg block: calendar, matches, groups and knockout views, standings computed from the scores you enter, time zones and local flags for all 48 teams.",
        facts: ["Block", "TypeScript + React", "REST API"],
        links: [
          { label: "Live demo", href: playground(cupBlueprint) },
          { label: "GitHub", href: gh("camaleaun/camaleaun-worldcup2026") }
        ]
      },
      {
        name: "wp-kses-svg",
        hidden: true,
        status: "Proof of concept",
        text: "SVG uploads sanitized with WordPress’s own wp_kses() — no external libraries. A proposal for Core Trac #24251.",
        facts: ["Core proposal", "Security"],
        links: [
          { label: "Trac #24251", href: "https://core.trac.wordpress.org/ticket/24251" },
          { label: "GitHub", href: gh("camaleaun/wp-kses-svg") }
        ]
      },
      {
        name: "Gutenberg Content Types — Meta Fields",
        hidden: true,
        status: "Proof of concept",
        text: "Adds a Meta Fields section to the post type form of Gutenberg Content Types: a sortable list of custom fields, with conditional logic, that shows up as a meta box when editing.",
        facts: ["Gutenberg", "Custom fields"],
        links: [{ label: "GitHub", href: gh("camaleaun/gutenbergcontenttypesmetafields") }]
      }
    ]
  },
  "pt-BR": {
    title: "Plugins WordPress de Gilberto Tavares",
    description: "Plugins WordPress gratuitos e de código aberto de Gilberto Tavares (camaleaun), a começar pelo Exporter Importer Z: leve conteúdo WordPress com mídia, configurações e arquivos.",
    heading: "Plugins",
    intro: "Gratuitos e de código aberto, sob a GPL.",
    plugins: [
      {
        name: "Exporter Importer Z",
        status: "Plugin",
        text: "Leva conteúdo WordPress com mídia, configurações e arquivos: pacotes .wxrz para o WordPress Importer, zips para o WordPress Playground e abilities para agentes de IA.",
        facts: ["Abilities API", "WooCommerce", "Playground"],
        links: [
          { label: "Site e documentação", href: "https://eizport.github.io/" },
          { label: "Demo ao vivo", href: playground(eizBlueprint) },
          { label: "GitHub", href: gh("eizport/exporter-importer-z") }
        ]
      },
      {
        name: "Camaleaunmail",
        hidden: true,
        status: "Plugin",
        text: "Envia os e-mails do WordPress por qualquer servidor SMTP, guarda um log de cada e-mail para ler, reenviar ou apagar, e impede que cópias locais e de homologação mandem e-mail para pessoas reais.",
        facts: ["SMTP", "Log de e-mails", "WordPress 6.9+"],
        links: [{ label: "GitHub", href: gh("camaleaun/camaleaunmail") }]
      },
      {
        name: "FIFA World Cup 2026™ Schedule",
        hidden: true,
        status: "Bloco",
        text: "A tabela da Copa de 2026 como bloco do Gutenberg: calendário, jogos, grupos e mata-mata, classificação calculada pelos placares informados, fusos horários e bandeiras locais das 48 seleções.",
        facts: ["Bloco", "TypeScript + React", "REST API"],
        links: [
          { label: "Demo ao vivo", href: playground(cupBlueprint) },
          { label: "GitHub", href: gh("camaleaun/camaleaun-worldcup2026") }
        ]
      },
      {
        name: "wp-kses-svg",
        hidden: true,
        status: "Prova de conceito",
        text: "Upload de SVG sanitizado com o próprio wp_kses() do WordPress — sem bibliotecas externas. Uma proposta para o Core Trac #24251.",
        facts: ["Proposta para o core", "Segurança"],
        links: [
          { label: "Trac #24251", href: "https://core.trac.wordpress.org/ticket/24251" },
          { label: "GitHub", href: gh("camaleaun/wp-kses-svg") }
        ]
      },
      {
        name: "Gutenberg Content Types — Meta Fields",
        hidden: true,
        status: "Prova de conceito",
        text: "Adiciona uma seção Meta Fields ao formulário de tipos de post do Gutenberg Content Types: uma lista ordenável de campos personalizados, com lógica condicional, que aparece como meta box na edição.",
        facts: ["Gutenberg", "Campos personalizados"],
        links: [{ label: "GitHub", href: gh("camaleaun/gutenbergcontenttypesmetafields") }]
      }
    ]
  }
};
