// Wapuu Chameleon Firefighter — an endless lane game. Flames fall down the
// three columns of a site; the wapuu, at the bottom, changes columns and its
// extinguisher sprays on its own. A flame that reaches the bottom burns the
// site and costs a life. Loaded on the first click on Play (see
// src/components/ExtinguisherGame.astro).
import sheetUrl from "../assets/game/wapuu.png?url";
import { makeArt, FLAMES, type Art, type FlameKind } from "./art";
import { Sound } from "./audio";
import { drawText } from "./font";
import { gameStrings } from "./i18n";

const H = 720; // logical height; the width follows the canvas' aspect ratio
const GROUND = 704; // the wapuu's feet
const FRAME_W = 128;
const FRAME_H = 144;
const NOZZLE_X = 24; // the nozzle's tip in the sprite
const NOZZLE_Y = 8;
const FRAMES = { idle: 0, stepA: 1, stepB: 2, spray: 3, hit: 4 };
const MAX_LIVES = 3;
const LEVEL_TIME = 30;
const BEST_KEY = "wapuu-firefighter-best";
const SOUND_KEY = "wapuu-firefighter-sound";

const POINTS: Record<FlameKind, number> = { flame: 100, blue: 150, big: 300 };
const HP: Record<FlameKind, number> = { flame: 4, blue: 3, big: 10 };
const SPEED: Record<FlameKind, number> = { flame: 1, blue: 1.6, big: 0.75 };

interface Flame {
  kind: FlameKind | "heart";
  lane: number;
  y: number;
  hp: number;
  max: number;
  hitTime: number;
}
interface Drop {
  x: number;
  y: number;
  lane: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
}
interface Popup {
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
}

type State = "loading" | "playing" | "paused" | "over";

const store = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export async function boot(root: HTMLElement) {
  const $ = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-${name}]`)!;
  const lang = document.documentElement.lang === "pt-BR" ? "pt-BR" : "en";
  const s = gameStrings(lang);
  const canvas = $<HTMLCanvasElement>("canvas");
  const ctx = canvas.getContext("2d")!;
  const stage = $("stage");
  const overlay = $("overlay");
  const primary = $<HTMLButtonElement>("primary");
  const live = $("live");
  const shareBox = $("share");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  primary.disabled = true;
  primary.textContent = s.loading;
  const [sheet] = await Promise.all([loadImage(sheetUrl)]);
  const art: Art = makeArt();
  const sound = new Sound();

  // --- State ----------------------------------------------------------------
  let state: State = "loading";
  let width = 960;
  let scale = 1;
  let lane = 1;
  let x = 0;
  let moveFrom = 0;
  let moving = 0;
  let time = 0;
  let level = 1;
  let speed = 90;
  let spawnEvery = 1.8;
  let spawnIn = 1;
  let heartIn = 25;
  let dropIn = 0;
  let score = 0;
  let best = Number(store.get(BEST_KEY)) || 0;
  let lives = MAX_LIVES;
  let combo = 0;
  let putOut = 0;
  let hurt = 0;
  let shake = 0;
  let scroll = 0;
  let banner = { text: "", life: 0 };
  let flames: Flame[] = [];
  let drops: Drop[] = [];
  let particles: Particle[] = [];
  let popups: Popup[] = [];
  let scorch = [0, 0, 0];
  let last = 0;

  // The wapuu stands right of its nozzle (the column's centre): the columns
  // shift left and narrow so it fits in the right one on a phone.
  const SHIFT = 16;
  const laneWidth = () =>
    Math.min(250, width / 2 - (FRAME_W - NOZZLE_X) + SHIFT - 8, (width / 2 - SHIFT - 12) / 1.5);
  const laneX = (i: number) => width / 2 - SHIFT + (i - 1) * laneWidth();
  const multiplier = () => Math.min(5, 1 + Math.floor(combo / 10));

  // --- HUD and overlay --------------------------------------------------------
  const hud = {
    score: $("hud-score"),
    best: $("hud-best"),
    lives: $("hud-lives"),
    combo: $("hud-combo")
  };
  let shown = "";
  const updateHud = () => {
    const key = `${score}|${best}|${lives}|${multiplier()}`;
    if (key === shown) return;
    shown = key;
    hud.score.textContent = String(score);
    hud.best.textContent = String(best);
    hud.lives.textContent = "♥".repeat(lives) + "♡".repeat(MAX_LIVES - lives);
    hud.lives.setAttribute("aria-label", `${lives}/${MAX_LIVES}`);
    hud.combo.textContent = `×${multiplier()}`;
  };
  let lastSaid = "";
  const say = (text: string) => {
    if (text === lastSaid) live.textContent = "";
    lastSaid = text;
    live.textContent = text;
  };
  const showOverlay = (title: string, text: string, button: string, share = false) => {
    $("overlay-title").textContent = title;
    $("overlay-text").textContent = text;
    primary.textContent = button;
    primary.disabled = false;
    shareBox.hidden = !share;
    overlay.hidden = false;
    primary.focus({ preventScroll: true });
  };

  // --- Size: the canvas buffer matches its box, in device pixels ---------------
  const resize = () => {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    scale = canvas.height / H;
    width = canvas.width / scale;
    x = laneX(lane);
    draw();
  };
  new ResizeObserver(resize).observe(canvas);

  // --- Game flow ----------------------------------------------------------------
  const start = () => {
    lane = 1;
    x = laneX(1);
    moving = 0;
    time = 0;
    level = 1;
    speed = 90;
    spawnEvery = 1.8;
    spawnIn = 0.8;
    heartIn = 25;
    score = 0;
    lives = MAX_LIVES;
    combo = 0;
    putOut = 0;
    hurt = 0;
    flames = [];
    drops = [];
    particles = [];
    popups = [];
    scorch = [0, 0, 0];
    banner = { text: s.level(1), life: 1.6 };
    resume();
  };
  const resume = () => {
    state = "playing";
    overlay.hidden = true;
    if (!document.fullscreenElement) stage.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
    $<HTMLButtonElement>("pause").disabled = false;
    canvas.focus({ preventScroll: true });
    last = performance.now();
  };
  const pause = () => {
    if (state !== "playing") return;
    state = "paused";
    $<HTMLButtonElement>("pause").disabled = true;
    showOverlay(s.paused, "", s.resume);
  };
  const gameOver = () => {
    state = "over";
    $<HTMLButtonElement>("pause").disabled = true;
    const record = score > best;
    if (record) {
      best = score;
      store.set(BEST_KEY, String(best));
    }
    updateHud();
    sound.over();
    showOverlay(s.gameOver, `${record && score > 0 ? `${s.newBest} ` : ""}${s.final(putOut, score, best)}`, s.playAgain, true);
    prepareShare();
    say(`${s.gameOver}. ${s.final(putOut, score, best)}`);
  };
  primary.addEventListener("click", () => (state === "paused" ? resume() : start()));

  // --- Input: lanes ---------------------------------------------------------------
  const go = (dir: number) => {
    if (state !== "playing") return;
    const next = Math.max(0, Math.min(2, lane + dir));
    if (next === lane) return;
    lane = next;
    moveFrom = x;
    moving = 1;
    sound.move();
  };
  root.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLButtonElement && (e.key === " " || e.key === "Enter")) return;
    const key = e.key.toLowerCase();
    if (key === "arrowleft" || key === "a") go(-1);
    else if (key === "arrowright" || key === "d") go(1);
    else if (key === "p" || key === "escape") state === "paused" ? resume() : pause();
    else return;
    e.preventDefault();
  });
  let touch: { x: number; y: number; moved: boolean; at: number } | null = null;
  const toWorld = (clientX: number) => {
    const box = canvas.getBoundingClientRect();
    return ((clientX - box.left) / box.width) * width;
  };
  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    touch = { x: e.clientX, y: e.clientY, moved: false, at: performance.now() };
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!touch) return;
    const dx = e.clientX - touch.x;
    // Each 40px of swipe is one column, so a long swipe crosses two.
    if (Math.abs(dx) > 40) {
      go(Math.sign(dx));
      touch.x = e.clientX;
      touch.moved = true;
    }
  });
  canvas.addEventListener("pointerup", (e) => {
    if (touch && !touch.moved && Math.abs(e.clientY - touch.y) < 30) go(toWorld(e.clientX) < x ? -1 : 1);
    touch = null;
  });
  canvas.addEventListener("pointercancel", () => (touch = null));

  // --- Buttons ------------------------------------------------------------------------
  const soundButton = $<HTMLButtonElement>("sound");
  const setSound = (on: boolean) => {
    sound.enable(on);
    soundButton.setAttribute("aria-pressed", String(on));
    soundButton.querySelector("[data-sound-label]")!.textContent = on ? s.soundOn : s.soundOff;
    store.set(SOUND_KEY, on ? "1" : "0");
  };
  soundButton.addEventListener("click", () => setSound(!sound.enabled));
  // A saved "on" can only start audio after a gesture: the Play click was one.
  if (store.get(SOUND_KEY) === "1") setSound(true);
  $("pause").addEventListener("click", pause);
  const full = $<HTMLButtonElement>("fullscreen");
  if (document.fullscreenEnabled) {
    full.hidden = false;
    full.addEventListener("click", () =>
      document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen().catch(() => {})
    );
    document.addEventListener("fullscreenchange", () => {
      const on = document.fullscreenElement === stage;
      full.setAttribute("aria-pressed", String(on));
      full.querySelector("[data-fullscreen-label]")!.textContent = on ? s.exitFullscreen : s.fullscreen;
      canvas.focus({ preventScroll: true });
    });
  }
  document.addEventListener("visibilitychange", () => document.hidden && pause());
  window.addEventListener("blur", pause);

  // --- Share ------------------------------------------------------------------------------
  const shareUrl = () => (lang === "pt-BR" ? root.dataset.sharePt : root.dataset.shareEn) ?? location.href;
  const card = () => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 630;
    const g = c.getContext("2d")!;
    g.imageSmoothingEnabled = false;
    g.fillStyle = "#151a3d";
    g.fillRect(0, 0, 1200, 630);
    g.drawImage(art.flames.big[0], 980, 70, 128, 156);
    g.drawImage(art.flames.flame[1], 1040, 300, 88, 108);
    g.drawImage(sheet, 0, 0, FRAME_W, FRAME_H, 70, 120, FRAME_W * 3, FRAME_H * 3);
    drawText(g, s.name, 520, 150, { size: 5, color: "#c6f35b" });
    drawText(g, String(score), 520, 250, { size: 18, color: "#fff" });
    drawText(g, lang === "pt-BR" ? "pontos" : "points", 520, 400, { size: 6, color: "#facd1e" });
    drawText(g, shareUrl().replace(/^https?:\/\//, ""), 520, 520, { size: 3, color: "#9aa3d6", shadow: "" });
    return new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/png"));
  };
  const prepareShare = () => {
    const url = shareUrl();
    const text = s.shareText(putOut, score);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      x: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    shareBox.querySelectorAll<HTMLAnchorElement>("[data-net]").forEach((a) => (a.href = links[a.dataset.net!]));
  };
  const native = $<HTMLButtonElement>("share-native");
  if ("share" in navigator) {
    native.hidden = false;
    native.addEventListener("click", async () => {
      const url = shareUrl();
      const text = s.shareText(putOut, score);
      try {
        const blob = await card();
        const file = blob && new File([blob], "wapuu-firefighter.png", { type: "image/png" });
        if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text, url });
        else await navigator.share({ text, url });
      } catch {}
    });
  }
  $("copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(`${s.shareText(putOut, score)} ${shareUrl()}`);
      say(s.copied);
      $("copy").querySelector("[data-copy-label]")!.textContent = s.copied;
    } catch {}
  });

  // --- Simulation -----------------------------------------------------------------------
  const burst = (px: number, py: number, n: number, colors: string[], spread = 120, up = 60) => {
    if (reduceMotion) n = Math.ceil(n / 2);
    for (let i = 0; i < n; i++)
      particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * spread,
        vy: -Math.random() * up - 20,
        life: 0,
        max: 0.4 + Math.random() * 0.5,
        size: 2 + Math.floor(Math.random() * 3) * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
  };
  const spawn = () => {
    const pick = Math.random();
    const kind: FlameKind =
      level >= 3 && pick < 0.12 + level * 0.01 ? "big" : level >= 2 && pick < 0.35 ? "blue" : "flame";
    const lanes = [0, 1, 2].filter((l) => !flames.some((f) => f.lane === l && f.y < 60));
    if (!lanes.length) return;
    const first = lanes[Math.floor(Math.random() * lanes.length)];
    flames.push({ kind, lane: first, y: -FLAMES[kind].h, hp: HP[kind], max: HP[kind], hitTime: 0 });
    // From level 4, sometimes two at once in different columns.
    if (level >= 4 && Math.random() < 0.25) {
      const other = lanes.filter((l) => l !== first);
      if (other.length)
        flames.push({ kind: "flame", lane: other[0], y: -FLAMES.flame.h - 40, hp: HP.flame, max: HP.flame, hitTime: 0 });
    }
  };

  const update = (dt: number) => {
    time += dt;
    scroll += speed * 0.35 * dt;
    if (time > level * LEVEL_TIME) {
      level++;
      speed = Math.min(360, speed + 22);
      spawnEvery = Math.max(0.42, spawnEvery * 0.86);
      banner = { text: `${s.level(level)} · ${s.faster}`, life: 1.8 };
      sound.level();
      say(s.level(level));
    }
    // Walk to the column.
    if (moving > 0) {
      moving = Math.max(0, moving - dt / 0.14);
      const t = 1 - moving;
      x = moveFrom + (laneX(lane) - moveFrom) * (1 - (1 - t) * (1 - t));
    } else x = laneX(lane);

    // Spawning.
    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawn();
      spawnIn = spawnEvery * (0.75 + Math.random() * 0.5);
    }
    heartIn -= dt;
    if (heartIn <= 0) {
      heartIn = 22 + Math.random() * 12;
      if (lives < MAX_LIVES) flames.push({ kind: "heart", lane: Math.floor(Math.random() * 3), y: -30, hp: 2, max: 2, hitTime: 0 });
    }

    // Foam: 12 drops a second from the nozzle, straight up the column.
    dropIn -= dt;
    if (dropIn <= 0 && moving === 0) {
      dropIn = 0.08;
      drops.push({ x: laneX(lane) + (Math.random() - 0.5) * 6, y: GROUND - FRAME_H + NOZZLE_Y, lane });
    }
    for (const d of drops) d.y -= 1050 * dt;

    // Flames fall; foam hits the lowest one in its column.
    for (const f of flames) {
      const kindSpeed = f.kind === "heart" ? 0.8 : SPEED[f.kind];
      f.y += speed * kindSpeed * dt;
      f.hitTime = Math.max(0, f.hitTime - dt);
    }
    for (const d of drops) {
      const target = flames
        .filter((f) => f.lane === d.lane && f.hp > 0)
        .sort((a, b) => b.y - a.y)
        .find((f) => {
          const h = f.kind === "heart" ? 22 : FLAMES[f.kind].h;
          return d.y <= f.y + h * 0.9 && d.y >= f.y - 30;
        });
      if (!target) continue;
      d.y = -999;
      target.hp--;
      target.hitTime = 0.08;
      const cx = laneX(target.lane);
      burst(cx, target.y + 30, 2, ["#ffffff", "#d6f1ff"], 80, 40);
      if (target.hp > 0) continue;
      if (target.kind === "heart") {
        lives = Math.min(MAX_LIVES, lives + 1);
        popups.push({ x: cx, y: target.y, text: s.extraLife, life: 1.2, color: "#ff8a95" });
        sound.life();
        say(s.extraLife);
        continue;
      }
      combo++;
      putOut++;
      const points = POINTS[target.kind] * multiplier();
      score += points;
      popups.push({ x: cx, y: target.y + 10, text: `+${points}`, life: 0.9, color: "#facd1e" });
      burst(cx, target.y + FLAMES[target.kind].h / 2, 14, ["#ffffff", "#c9d3e6", "#9aa3b8"], 160, 120);
      sound.out();
    }
    drops = drops.filter((d) => d.y > -40);

    // A flame at the bottom burns the site.
    for (const f of flames) {
      if (f.hp <= 0) continue;
      const h = f.kind === "heart" ? 22 : FLAMES[f.kind].h;
      if (f.y + h < GROUND - 6) continue;
      f.hp = 0;
      if (f.kind === "heart") continue;
      lives--;
      combo = 0;
      hurt = 0.8;
      shake = reduceMotion ? 0 : 0.3;
      scorch[f.lane] = 1;
      burst(laneX(f.lane), GROUND - 20, 24, ["#f06e1e", "#facd1e", "#d61e18", "#555a6e"], 260, 200);
      sound.hurt();
      if (lives <= 0) {
        flames = flames.filter((o) => o.hp > 0);
        gameOver();
        return;
      }
      say(s.burned(lives));
    }
    flames = flames.filter((f) => f.hp > 0);

    for (const p of particles) {
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 160 * dt;
    }
    particles = particles.filter((p) => p.life < p.max);
    for (const p of popups) {
      p.life -= dt;
      p.y -= 50 * dt;
    }
    popups = popups.filter((p) => p.life > 0);
    banner.life = Math.max(0, banner.life - dt);
    hurt = Math.max(0, hurt - dt);
    shake = Math.max(0, shake - dt);
    scorch = scorch.map((v) => Math.max(0, v - dt / 3));
  };

  // --- Drawing --------------------------------------------------------------------------
  // The playfield is a site: a browser bar and three columns of placeholder content.
  const drawSite = () => {
    ctx.fillStyle = "#151a3d";
    ctx.fillRect(0, 0, width, H);
    const lw = laneWidth();
    const left = laneX(0) - lw / 2;
    ctx.fillStyle = "#1d2452";
    ctx.fillRect(left - 8, 0, lw * 3 + 16, H);
    ctx.fillStyle = "#283066";
    ctx.fillRect(left - 8, 0, lw * 3 + 16, 34);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(left + 6 + i * 16, 12, 10, 10);
    });
    ctx.fillStyle = "#151a3d";
    ctx.fillRect(left + 64, 9, lw * 3 - 80, 16);
    for (let i = 0; i < 3; i++) {
      const cx = laneX(i);
      const x0 = cx - lw / 2 + 10;
      const w = lw - 20;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 40, w, GROUND - 40);
      ctx.clip();
      ctx.fillStyle = "#222a5c";
      ctx.fillRect(x0, 40, w, GROUND - 40);
      const block = 190;
      for (let y = (scroll % block) - block + 40; y < GROUND; y += block) {
        ctx.fillStyle = "#2b3470";
        ctx.fillRect(x0 + 12, y + 12, w - 24, 70);
        ctx.fillStyle = "#323d80";
        [0.9, 0.75, 0.55].forEach((f, j) => ctx.fillRect(x0 + 12, y + 98 + j * 16, (w - 24) * f, 8));
        ctx.fillStyle = "#3a4796";
        ctx.fillRect(x0 + 12, y + 150, 56, 20);
      }
      if (scorch[i] > 0) {
        const g = ctx.createLinearGradient(0, GROUND - 260, 0, GROUND);
        g.addColorStop(0, "rgba(214,30,24,0)");
        g.addColorStop(1, `rgba(214,30,24,${0.55 * scorch[i]})`);
        ctx.fillStyle = g;
        ctx.fillRect(x0, GROUND - 260, w, 260);
      }
      ctx.restore();
    }
    ctx.fillStyle = "#0e1230";
    ctx.fillRect(0, GROUND, width, H - GROUND);
  };

  const draw = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    if (shake > 0) ctx.translate(Math.round((Math.random() - 0.5) * 12), Math.round((Math.random() - 0.5) * 8));
    drawSite();
    const frame = Math.floor(time * 6) % 2;
    for (const f of flames) {
      const cx = laneX(f.lane);
      if (f.kind === "heart") {
        const k = 3;
        ctx.drawImage(art.heart, Math.round(cx - (art.heart.width * k) / 2), Math.round(f.y), art.heart.width * k, art.heart.height * k);
        continue;
      }
      const look = FLAMES[f.kind];
      // It shrinks as the foam puts it out.
      const k = 0.55 + 0.45 * (f.hp / f.max);
      const w = Math.round(look.w * k);
      const h = Math.round(look.h * k);
      ctx.globalAlpha = f.hitTime > 0 ? 0.7 : 1;
      ctx.drawImage(art.flames[f.kind][frame], Math.round(cx - w / 2), Math.round(f.y + look.h - h), w, h);
      ctx.globalAlpha = 1;
    }
    for (const d of drops) ctx.drawImage(art.foam, Math.round(d.x - 10), Math.round(d.y), 20, 18);
    // The wapuu: the nozzle on the column's centre.
    const left = Math.round(x - NOZZLE_X);
    const top = GROUND - FRAME_H;
    const frameIndex =
      hurt > 0 && Math.floor(hurt * 10) % 2 === 0
        ? FRAMES.hit
        : moving > 0
          ? lane < 1 || (lane === 1 && x > laneX(1))
            ? FRAMES.stepA
            : FRAMES.stepB
          : state === "playing" && Math.floor(time * 5) % 2
            ? FRAMES.spray
            : FRAMES.idle;
    ctx.drawImage(sheet, frameIndex * FRAME_W, 0, FRAME_W, FRAME_H, left, top, FRAME_W, FRAME_H);
    for (const p of particles) {
      ctx.globalAlpha = 1 - p.life / p.max;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
    for (const p of popups) drawText(ctx, p.text, p.x, p.y, { size: 3, color: p.color, align: "center" });
    if (banner.life > 0 && state === "playing")
      drawText(ctx, banner.text, width / 2, 250, { size: width < 600 ? 4 : 6, color: "#c6f35b", align: "center" });
  };

  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (state === "playing") update(dt);
    updateHud();
    draw();
    requestAnimationFrame(loop);
  };

  resize();
  updateHud();
  start();
  requestAnimationFrame((now) => {
    last = now;
    loop(now);
  });
}
