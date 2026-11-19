// Prepares every media file the site uses. Run: node build-assets.mjs
// Sources: real photos from ../../carniceria-tomas-reel/sources, Higgsfield intro clip in ../_gen.
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(ROOT, "../../edits/carniceria-tomas-reel/sources");
const OUT = path.join(ROOT, "site/public/media");
const GEN = path.join(ROOT, "_gen");
for (const d of ["intro", "brand", "photos"]) mkdirSync(path.join(OUT, d), { recursive: true });

const ff = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const kb = (f) => `${Math.round(statSync(f).size / 1024)} KB`;

// ---------- 1. Scroll-scrubbed intro (Kling 4.0, start/end frames from the real shop photo) ----------
// Short GOP so seeking while scrolling stays smooth. No audio track.
const intro = path.join(GEN, "k4.mp4");
const enc = ["-an", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", "-g", "2", "-keyint_min", "1", "-sc_threshold", "0", "-bf", "0"];
ff(["-i", intro, "-vf", "scale=1600:900:flags=lanczos", "-crf", "27", ...enc, path.join(OUT, "intro/intro-d.mp4")]);
// Portrait crop keeps the wall sign, the cow and the head of the counter.
ff(["-i", intro, "-vf", "crop=640:1080:40:0,scale=576:972:flags=lanczos", "-crf", "27", ...enc, path.join(OUT, "intro/intro-m.mp4")]);
for (const [name, t, vf] of [
  ["poster-d", "0", "scale=1600:900"],
  ["poster-m", "0", "crop=640:1080:40:0,scale=576:972"],
  ["lit-d", "5.95", "scale=1600:900"],
  ["lit-m", "5.95", "crop=640:1080:40:0,scale=576:972"],
]) {
  const tmp = path.join(GEN, `${name}.png`);
  ff(["-ss", t, "-i", intro, "-frames:v", "1", "-vf", vf, tmp]);
  await sharp(tmp).webp({ quality: 72 }).toFile(path.join(OUT, `intro/${name}.webp`));
}
console.log("intro-d", kb(path.join(OUT, "intro/intro-d.mp4")), "intro-m", kb(path.join(OUT, "intro/intro-m.mp4")));

// ---------- 2. Logo layers from the official logo (white wordmark + red brush stroke on black) ----------
{
  const logoSrc = path.resolve(ROOT, "../../edits/carniceria-tomas-reel/logo.webp");
  const { data, info } = await sharp(logoSrc).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const full = Buffer.alloc(data.length), stroke = Buffer.alloc(data.length), words = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.max(r, g, b); // black background -> transparent
    const isRed = r > 90 && r > g * 2.2 && r > b * 2.2;
    const put = (buf, R, G, B, A) => { buf[i] = R; buf[i + 1] = G; buf[i + 2] = B; buf[i + 3] = A; };
    const un = (c) => (a ? Math.min(255, Math.round((c * 255) / a)) : 0);
    put(full, un(r), un(g), un(b), a);
    if (isRed) put(stroke, 227, 6, 19, a); else put(stroke, 0, 0, 0, 0);
    if (!isRed) put(words, 255, 255, 255, Math.min(r, g, b) > 40 ? Math.min(255, Math.round(Math.min(r, g, b) * 1.05)) : 0); else put(words, 0, 0, 0, 0);
  }
  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  await sharp(full, raw).resize(720).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, "brand/logo.webp"));
  await sharp(full, raw).resize(512).png().toFile(path.join(OUT, "brand/logo.png"));
  await sharp(stroke, raw).resize(720).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, "brand/logo-stroke.webp"));
  await sharp(words, raw).resize(720).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, "brand/logo-words.webp"));
  // Social / icon assets (logo on black, as published by the shop)
  await sharp(logoSrc).resize(1200, 630, { fit: "contain", background: "#000" }).jpeg({ quality: 85 }).toFile(path.join(OUT, "brand/og.jpg"));
  await sharp(logoSrc).resize(180).png().toFile(path.join(ROOT, "site/src/app/apple-icon.png"));
  await sharp(logoSrc).resize(512).png().toFile(path.join(ROOT, "site/src/app/icon.png"));
}

// ---------- 3. Real photos (Google Business + Instagram @lacarniceriadetomas) ----------
const photos = {
  fachada: "google/g01.jpg",
  interior: "google/g02.jpg",
  "chuleton-madera": "google/g03.jpg",
  chorizos: "google/g04.jpg",
  "fachada-nueva": "ig/ig93.jpg",
  mostrador: "ig/ig16.jpg",
  "mostrador-2": "ig/ig17.jpg",
  vaca: "ig/ig36.jpg",
  chuleton: "ig/ig18.jpg",
  "lomo-alto": "ig/ig35.jpg",
  solomillo: "ig/ig32.jpg",
  wagyu: "ig/ig66.jpg",
  "black-angus": "ig/ig45.jpg",
  "lomo-vacuno": "ig/ig58.jpg",
  osobuco: "ig/ig86.jpg",
  "ternera-guadarrama": "ig/ig92.jpg",
  "vitrina-vacuno": "ig/ig21.jpg",
  cordero: "ig/ig25.jpg",
  "pollo-relleno": "ig/ig07.jpg",
  "carne-mechada": "ig/ig37.jpg",
  hamburguesas: "ig/ig27.jpg",
  "pastel-tomate": "ig/ig31.jpg",
  "pasteles-tomate": "ig/ig47.jpg",
  "roscon-salado": "ig/ig88.jpg",
  hojaldres: "ig/ig19.jpg",
  halloween: "ig/ig50.jpg",
  "tronco-navidad": "ig/ig53.jpg",
  cocinado: "ig/ig14.jpg",
  "relleno-seron": "ig/ig24.jpg",
  "morcilla-burgos": "ig/ig46.jpg",
  "chorizos-colgados": "ig/ig57.jpg",
};
for (const [name, rel] of Object.entries(photos)) {
  const src = path.join(SRC, rel);
  if (!existsSync(src)) { console.warn("missing", rel); continue; }
  for (const w of [640, 1280]) {
    await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 700 ? 74 : 70 }).toFile(path.join(OUT, `photos/${name}-${w}.webp`));
  }
}
console.log("done");
