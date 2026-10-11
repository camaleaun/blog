---
title: "Exporter Importer Z: leve seu conteúdo WordPress, não a bagunça"
description: "Criei um plugin gratuito e de código aberto que move conteúdo WordPress com imagens, configurações e página inicial — sem dump de banco, sem buscar e substituir."
pubDate: "2026-10-11T03:02:19.000Z"
timestamp: "20261011030219"
slug: "exporter-importer-z-leve-seu-conteudo-wordpress-nao-a-bagunca"
sourceId: "20261011030219"
origin: "exporter-importer-z-move-your-wordpress-content-not-your-mess"
---
Todo desenvolvedor WordPress conhece este momento: você precisa mover *parte* de um site — uma landing page, um catálogo de produtos, um conjunto de páginas de homologação para produção — e as ferramentas que você tem não encaixam.

**A exportação do próprio WordPress** só aponta para as mídias. O importador precisa baixar cada imagem do site antigo e, se ele estiver fora do ar, lento ou atrás de login, ficam caixas cinzas. As configurações também não vão junto: página inicial, página de posts, loja e checkout chegam como páginas comuns.

**Os plugins de migração** vão para o outro extremo: copiam o banco inteiro — transients, logs, sessões, tabelas de plugins apagados há anos — e sobrescrevem o site de destino.

Então criei o caminho do meio: o **Exporter Importer Z**.

**O que ele faz:**
- **Você escolhe o que vai.** Em Ferramentas → Exportar, escolha tipos de conteúdo, itens exatos ou filtros, e as configurações que vão junto. A página inicial, a loja e o checkout têm selos, para nenhuma página importante ficar para trás.
- **Um arquivo completo.** O conteúdo, as mídias que ele usa (anexadas ou só usadas no conteúdo), as configurações que apontam para ele e cada post como .html legível — num .wxrz ou .zip.
- **Importado com a ferramenta que você já conhece.** Envie para o Importador do WordPress: as mídias vêm do arquivo, os IDs são remapeados e a página inicial continua sendo a página inicial. Sem buscar e substituir.
- **O site inteiro no navegador.** Exporte um .zip do WordPress Playground com o tema e os plugins que você escolher. Uma cópia feita no seu servidor local abre no playground.wordpress.net, ou offline com `npx @wp-playground/cli`.
- **Feito para agentes de IA.** Cada exportação, importação, cópia e configuração é uma ability da Abilities API do WordPress — por MCP, REST, PHP ou WP-CLI. A documentação também está pronta para agentes (llms.txt e cada página em Markdown).

É **gratuito e de código aberto**, sob a GPL: sem conta, sem chave de licença, sem versão "pro" segurando recursos.

**Experimente:**
- [Site, documentação e um vídeo de 1 minuto](https://eizport.github.io/) (em inglês, com legendas)
- [Demonstração no navegador](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/eizport/exporter-importer-z/main/playground/blueprint.json) (WordPress Playground)
- [Código e versões no GitHub](https://github.com/eizport/exporter-importer-z)

Se ele te poupar uma tarde de reenviar imagens e remontar a página inicial, uma estrela no GitHub, uma issue ou indicar para quem está migrando um site ajuda muito — e [apoiar](https://eizport.github.io/donate/) também.

Qual foi a migração de conteúdo mais dolorosa que você já fez no WordPress?

#WordPress #PluginWordPress #CódigoAberto #DesenvolvimentoWeb #WordPressPlayground #IA
