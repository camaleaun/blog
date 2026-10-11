// Strings of the 404 game, used by the component (server) and the game (browser).
// The mascot's name is a proper name in each language (BRAND.md → Mascot).
import type { Locale } from "../lib/i18n";

const strings = {
  en: {
    name: "Wapuu Chameleon Firefighter",
    tagline: "The site is on fire. Put it out!",
    canvas:
      "Wapuu Chameleon Firefighter, an arcade game: flames fall down the three columns of a site and the wapuu, at the bottom, changes columns to spray foam on them.",
    keys: "← → or A D to change columns · P to pause. The extinguisher sprays on its own.",
    touch: "Swipe or tap left and right to change columns. The extinguisher sprays on its own.",
    play: "Play",
    resume: "Resume",
    playAgain: "Play again",
    loading: "Loading…",
    pause: "Pause",
    soundOn: "Sound on",
    soundOff: "Sound off",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    score: "Score",
    best: "Best",
    lives: "Lives",
    combo: "Combo",
    paused: "Paused",
    level: (n: number) => `Level ${n}`,
    faster: "Faster!",
    gameOver: "Nice work, firefighter!",
    final: (flames: number, score: number, best: number) =>
      `You put out ${flames} ${flames === 1 ? "flame" : "flames"} · ${score} points · best ${best}`,
    newBest: "New best!",
    share: "Share",
    shareOn: "Share on",
    copyLink: "Copy link",
    copied: "Link copied",
    shareText: (flames: number, score: number) =>
      `I put out ${flames} flames and scored ${score} points with the Wapuu Chameleon Firefighter. Can you beat it?`,
    burned: (lives: number) => `The fire reached the site! ${lives} ${lives === 1 ? "life" : "lives"} left.`,
    extraLife: "Extra life!"
  },
  "pt-BR": {
    name: "Wapuu Camaleão Bombeiro",
    tagline: "O site está pegando fogo. Apague!",
    canvas:
      "Wapuu Camaleão Bombeiro, um jogo de fliperama: chamas descem pelas três colunas de um site e o wapuu, embaixo, troca de coluna para jogar espuma nelas.",
    keys: "← → ou A D para trocar de coluna · P para pausar. O extintor dispara sozinho.",
    touch: "Deslize ou toque à esquerda e à direita para trocar de coluna. O extintor dispara sozinho.",
    play: "Jogar",
    resume: "Continuar",
    playAgain: "Jogar de novo",
    loading: "Carregando…",
    pause: "Pausar",
    soundOn: "Som ligado",
    soundOff: "Som desligado",
    fullscreen: "Tela cheia",
    exitFullscreen: "Sair da tela cheia",
    score: "Pontos",
    best: "Recorde",
    lives: "Vidas",
    combo: "Combo",
    paused: "Pausado",
    level: (n: number) => `Nível ${n}`,
    faster: "Mais rápido!",
    gameOver: "Mandou bem, bombeiro!",
    final: (flames: number, score: number, best: number) =>
      `Você apagou ${flames} ${flames === 1 ? "chama" : "chamas"} · ${score} pontos · recorde ${best}`,
    newBest: "Novo recorde!",
    share: "Compartilhar",
    shareOn: "Compartilhar no",
    copyLink: "Copiar link",
    copied: "Link copiado",
    shareText: (flames: number, score: number) =>
      `Apaguei ${flames} chamas e fiz ${score} pontos com o Wapuu Camaleão Bombeiro. Consegue bater?`,
    burned: (lives: number) => `O fogo chegou no site! ${lives === 1 ? "Resta 1 vida" : `Restam ${lives} vidas`}.`,
    extraLife: "Vida extra!"
  }
} as const;

export type GameStrings = (typeof strings)["en"] | (typeof strings)["pt-BR"];
export const gameStrings = (locale: Locale): GameStrings => strings[locale];
