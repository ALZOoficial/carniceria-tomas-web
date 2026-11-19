"use client";
import { useEffect, useRef, useState } from "react";
import { BASE } from "@/lib/base";
import { press, videos } from "@/data/content";
import { photo } from "@/data/catalog";
import { CloseIcon, ExternalIcon, PlayIcon } from "./Icons";

/**
 * «Nos han visitado»: cada medio tiene su propia pieza.
 *  - FaroTV (YouTube): un televisor de tubo que se enciende y reproduce el reportaje.
 *  - El Pueblo de Ceuta: el «despertador rockero», un radio-reloj LED que marca las 09:00 y suena.
 *  - El Faro de Ceuta: el periódico, con el haz de un faro barriendo la portada.
 *  - RTVCE (Facebook): el visor de una cámara grabando en la tienda.
 * Los objetos son imágenes generadas con Higgsfield; el contenido (titulares, miniatura, fechas) es real.
 */

const yt = videos.find((v) => v.platform === "youtube")!;
const fb = videos.find((v) => v.platform === "facebook")!;
const pueblo = press.find((p) => p.outlet === "El Pueblo de Ceuta")!;
const faro = press.find((p) => p.outlet === "El Faro de Ceuta")!;
const guia = press.find((p) => p.kind === "Guía")!;

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function Caption({ outlet, date, dateTime, title, href, cta, onClick }: { outlet: string; date: string; dateTime: string; title: string; href?: string; cta: string; onClick?: () => void }) {
  return (
    <div className="mt-6">
      <p className="text-sm text-mute">
        <span className="font-semibold text-bone">{outlet}</span>, <time dateTime={dateTime}>{date}</time>
      </p>
      <h3 className="display mt-2 text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.04]">{title}</h3>
      {onClick ? (
        <button type="button" onClick={onClick} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bone underline decoration-led/70 underline-offset-[6px] hover:decoration-led">
          {cta} <PlayIcon className="size-3.5" />
        </button>
      ) : (
        <a href={href} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bone underline decoration-led/70 underline-offset-[6px] hover:decoration-led">
          {cta} <ExternalIcon />
        </a>
      )}
    </div>
  );
}

/** Reproductor en ventana: el vídeo oficial solo se carga al pulsar. */
function Player({ src, title, vertical, onClose }: { src: string; title: string; vertical?: boolean; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; prev?.focus?.(); };
  }, [onClose]);
  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4 backdrop-blur-sm" onClick={onClose}>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 text-bone hover:border-led">
        <CloseIcon />
        <span className="sr-only">Cerrar vídeo</span>
      </button>
      <div onClick={(e) => e.stopPropagation()} className={`overflow-hidden rounded-[6px] bg-black ${vertical ? "aspect-[9/16] h-[86vh]" : "aspect-video w-[min(1100px,94vw)]"}`}>
        <iframe src={src} title={title} className="size-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    </div>
  );
}

function TvPiece({ onPlay }: { onPlay: () => void }) {
  const [ref, on] = useInView<HTMLDivElement>(0.45);
  return (
    <article className="lg:col-span-7" data-reveal>
      <div ref={ref} className="relative mx-auto max-w-[760px]">
        <img src={`${BASE}/media/press/tv.webp`} alt="" width={1200} height={896} loading="lazy" className="relative w-full mix-blend-lighten" />
        {/* Pantalla */}
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Ver el reportaje de ${yt.outlet}`}
          className="group absolute left-[15.4%] top-[16.7%] h-[58%] w-[57.1%] overflow-hidden rounded-[7%/10%]"
        >
          <span className={`crt absolute inset-0 ${on ? "crt-on" : ""}`}>
            <img src={yt.thumb} alt="" loading="lazy" className="size-full object-cover saturate-[0.85]" />
            <span className="crt-lines absolute inset-0" />
            <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.65))]" />
          </span>
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand/90 text-white shadow-[0_0_30px_rgb(255_43_43/0.6)] transition group-hover:scale-110">
            <PlayIcon className="size-6 translate-x-0.5" />
          </span>
          <span className="dot absolute left-[6%] top-[7%] text-[clamp(0.6rem,1.2vw,0.85rem)] text-white/85 [text-shadow:0_0_6px_rgb(255_255_255/0.6)]">FaroTV · {yt.duration}</span>
        </button>
      </div>
      <Caption outlet={yt.outlet} date={yt.date} dateTime={yt.dateTime} title={yt.title} cta="Ver el reportaje" onClick={onPlay} />
    </article>
  );
}

function ClockPiece() {
  const [ref, on] = useInView<HTMLDivElement>(0.5);
  const [time, setTime] = useState("08:59");
  useEffect(() => {
    if (!on) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setTime("09:00"), reduce ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [on]);
  const ringing = time === "09:00";
  return (
    <article className="lg:col-span-5 lg:pt-24" data-reveal>
      <div ref={ref} className="relative mx-auto max-w-[560px]">
        <img src={`${BASE}/media/press/clock.webp`} alt="" width={1200} height={679} loading="lazy" className="w-full mix-blend-lighten" />
        {/* Pantalla LED */}
        <div className="absolute left-[40.4%] top-[30.9%] grid h-[37.6%] w-[50.4%] place-items-center rounded-[4%] [container-type:inline-size]">
          <span className={`dot led-text text-[25cqw] leading-none tracking-[0.02em] ${ringing ? "animate-[ring_1.1s_steps(1)_3]" : ""}`} aria-label={`Son las ${time}`}>
            {time}
          </span>
        </div>
        {/* Altavoz: ecualizador cuando suena */}
        <div aria-hidden="true" className={`absolute left-[11%] top-[36%] flex h-[28%] w-[23%] items-end justify-between transition-opacity duration-500 ${ringing ? "opacity-100" : "opacity-0"}`}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="eq-bar w-[7%] rounded-sm bg-led shadow-[0_0_8px_var(--led)]" style={{ animationDelay: `${(i * 137) % 600}ms` }} />
          ))}
        </div>
      </div>
      <Caption outlet={pueblo.outlet} date={pueblo.date} dateTime={pueblo.dateTime} title={pueblo.title} href={pueblo.url} cta="Leer el reportaje" />
      <p className="mt-3 max-w-md text-sm text-mute">Entre las nueve y las diez, mientras se monta el mostrador, suenan Guns N&apos; Roses o The Police.</p>
    </article>
  );
}

function PaperPiece() {
  return (
    <article className="lg:col-span-5" data-reveal>
      <a href={faro.url} target="_blank" rel="noopener" className="group relative mx-auto block max-w-[560px] overflow-hidden" aria-label={`Leer en ${faro.outlet}: ${faro.title}`}>
        <img src={`${BASE}/media/press/paper.webp`} alt="" width={1200} height={896} loading="lazy" className="w-full mix-blend-lighten transition duration-700 group-hover:scale-[1.02]" />
        {/* Cabecera y titular reales */}
        <div className="absolute left-[16.7%] top-[14.8%] flex h-[12.8%] w-[63.3%] -rotate-[6.6deg] flex-col justify-center px-[2%] text-[#151515] [container-type:inline-size]">
          <span className="font-serif text-[7.4cqw] font-bold leading-none tracking-tight">El Faro de Ceuta</span>
          <span className="mt-[1.4cqw] text-[3.1cqw] font-semibold leading-tight">La carnicería de Tomás, las mejores carnes y de todos los tipos en el centro</span>
        </div>
        {/* Haz del faro */}
        <span aria-hidden="true" className="beam pointer-events-none absolute -inset-[40%]" />
      </a>
      <Caption outlet={faro.outlet} date={faro.date} dateTime={faro.dateTime} title="Las mejores carnes y de todos los tipos en el centro" href={faro.url} cta="Leer el artículo" />
    </article>
  );
}

function RecPiece({ onPlay }: { onPlay: () => void }) {
  return (
    <article className="lg:col-span-7 lg:pt-16" data-reveal>
      <button type="button" onClick={onPlay} aria-label={`Ver el vídeo de ${fb.outlet}`} className="group relative block w-full overflow-hidden rounded-[6px] text-left">
        <img src={photo("mostrador-2", 1280)} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover brightness-[0.7] saturate-[0.85] transition duration-700 group-hover:scale-[1.03] group-hover:brightness-90" />
        {/* Visor de cámara */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-[5%]">
          <span className="absolute left-0 top-0 size-8 border-l-2 border-t-2 border-white/80" />
          <span className="absolute right-0 top-0 size-8 border-r-2 border-t-2 border-white/80" />
          <span className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-white/80" />
          <span className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-white/80" />
          <span className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-1/2 top-0 h-full w-px bg-white/60" />
            <span className="absolute left-0 top-1/2 h-px w-full bg-white/60" />
          </span>
          <span className="dot absolute left-4 top-3 flex items-center gap-2 text-sm text-white">
            <span className="size-2.5 animate-[rec_1.4s_steps(1)_infinite] rounded-full bg-led shadow-[0_0_8px_var(--led)]" /> REC
          </span>
          <span className="dot absolute right-4 top-3 text-sm text-white/85">19.10.2017</span>
          <span className="dot absolute bottom-3 left-4 text-sm text-white/85">RTVCE</span>
        </span>
        <span className="absolute bottom-[12%] right-[8%] grid size-16 place-items-center rounded-full bg-brand text-white shadow-[0_0_30px_rgb(255_43_43/0.6)] transition group-hover:scale-110">
          <PlayIcon className="size-6 translate-x-0.5" />
        </span>
      </button>
      <Caption outlet={fb.outlet} date={fb.date} dateTime={fb.dateTime} title={fb.title} cta="Ver el vídeo" onClick={onPlay} />
    </article>
  );
}

export default function Press() {
  const [player, setPlayer] = useState<null | "yt" | "fb">(null);
  return (
    <section id="nos-han-visitado" aria-labelledby="press-title" className="relative overflow-hidden border-t border-line bg-[#080808] py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h2 id="press-title" className="display text-[clamp(3rem,8vw,7.5rem)] leading-[1.04]" data-reveal>
          Nos han <span className="led-text">visitado.</span>
        </h2>
        <p className="mt-5 max-w-[46ch] text-lg text-bone/75" data-reveal>
          Televisión y prensa de Ceuta han pasado por el mostrador.
        </p>

        <div className="mt-16 grid gap-x-12 gap-y-20 lg:grid-cols-12">
          <TvPiece onPlay={() => setPlayer("yt")} />
          <ClockPiece />
          <PaperPiece />
          <RecPiece onPlay={() => setPlayer("fb")} />
        </div>

        <a
          href={guia.url}
          target="_blank"
          rel="noopener"
          className="group mt-20 flex flex-col justify-between gap-4 rounded-[6px] border border-line bg-ink-2 p-6 transition hover:border-led/60 sm:flex-row sm:items-center sm:p-8"
          data-reveal
        >
          <span>
            <span className="text-sm text-mute">{guia.outlet}, {guia.date}</span>
            <span className="display mt-1 block text-2xl sm:text-3xl">También en la guía de carnicerías de Ceuta</span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            Ver la ficha <ExternalIcon />
          </span>
        </a>
        <p className="mt-6 text-xs text-mute">Los reportajes y vídeos pertenecen a sus medios.</p>
      </div>

      {player === "yt" && <Player src={yt.embed} title={`${yt.outlet}: ${yt.title}`} onClose={() => setPlayer(null)} />}
      {player === "fb" && <Player src={fb.embed} title={`${fb.outlet}: ${fb.title}`} onClose={() => setPlayer(null)} />}
    </section>
  );
}
