"use client";
import { useState } from "react";
import { press, videos, type VideoItem } from "@/data/content";
import { photo } from "@/data/catalog";
import { ExternalIcon, PlayIcon } from "./Icons";

/** Reproductor oficial que solo se carga al pulsar (más rápido y sin cookies de terceros hasta entonces). */
function LiteVideo({ v, featured }: { v: VideoItem; featured?: boolean }) {
  const [on, setOn] = useState(false);
  return (
    <figure className={`group relative overflow-hidden rounded-[4px] border border-line bg-black ${featured ? "lg:col-span-8" : "lg:col-span-4"}`}>
      <div className={`relative ${featured ? "aspect-video" : "aspect-video lg:aspect-auto lg:h-full lg:min-h-[100%]"}`}>
        {on ? (
          <iframe
            src={v.embed}
            title={`${v.outlet}: ${v.title}`}
            className="absolute inset-0 size-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setOn(true)} className="absolute inset-0 block size-full text-left" aria-label={`Reproducir vídeo de ${v.outlet}: ${v.title}`}>
            <img src={v.thumb} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-90" />
            <span className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
            <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-bone backdrop-blur transition duration-300 group-hover:scale-110 group-hover:border-led group-hover:text-led group-hover:shadow-[0_0_30px_rgb(255_43_43/0.5)]">
              <PlayIcon className="size-7 translate-x-0.5" />
            </span>
            <span className="absolute inset-x-5 bottom-5">
              <span className="dot text-xs tracking-[0.18em] text-led">
                {v.outlet} · <time dateTime={v.dateTime}>{v.date}</time>
                {v.duration ? ` · ${v.duration}` : ""}
              </span>
              <span className={`display mt-2 block ${featured ? "text-[clamp(1.8rem,3.4vw,3rem)]" : "text-[1.9rem]"}`}>{v.title}</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="sr-only">
        Vídeo de {v.outlet}, {v.date}.{" "}
        <a href={v.url}>Ver en {v.platform === "youtube" ? "YouTube" : "Facebook"}</a>
      </figcaption>
      {!on && (
        <a href={v.url} target="_blank" rel="noopener" className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-bone/80 hover:text-bone">
          {v.platform === "youtube" ? "YouTube" : "Facebook"} <ExternalIcon className="size-3" />
        </a>
      )}
    </figure>
  );
}

export default function Press() {
  return (
    <section id="nos-han-visitado" aria-labelledby="press-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p className="kicker" data-reveal>En los medios</p>
        <h2 id="press-title" className="display mt-4 text-[clamp(3.2rem,10vw,9.5rem)]" data-reveal>
          Nos han <span className="led-text">visitado</span>
        </h2>
        <p className="mt-6 max-w-xl text-bone/75" data-reveal>
          Televisión, prensa local y guías: lo que han contado de la tienda quienes han pasado por el mostrador con cámara y
          libreta.
        </p>

        <div className="mt-14 grid gap-4 lg:grid-cols-12" data-reveal>
          {videos.map((v, i) => (
            <LiteVideo key={v.url} v={v} featured={i === 0} />
          ))}
        </div>

        <ol className="mt-20 border-t border-line">
          {press.map((a, i) => (
            <li key={a.url} className="border-b border-line" data-reveal>
              <a
                href={a.url}
                target="_blank"
                rel="noopener"
                className="group grid gap-5 py-8 transition-colors sm:py-10 md:grid-cols-[minmax(0,1fr)_220px] md:items-center lg:grid-cols-[180px_minmax(0,1fr)_260px] lg:gap-10"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:col-span-2 lg:col-span-1 lg:block">
                  <p className="dot text-sm text-led">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-sm font-semibold text-bone lg:mt-3">{a.outlet}</p>
                  <p className="text-sm text-mute lg:mt-1">
                    {a.kind} · <time dateTime={a.dateTime}>{a.date}</time>
                  </p>
                </div>
                <div className="min-w-0">
                  <h3 className="display text-[clamp(1.9rem,3.6vw,3.25rem)] transition-colors group-hover:text-white">
                    {a.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-bone/70">{a.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bone underline decoration-led/70 underline-offset-[6px] group-hover:decoration-led">
                    {a.kind === "Guía" ? "Ver la ficha" : "Leer el reportaje"} en {a.outlet} <ExternalIcon />
                  </span>
                </div>
                <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[4px] md:block">
                  <img
                    src={photo(a.image, 640)}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover brightness-75 grayscale transition duration-700 group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                  />
                  <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_2px_var(--led)] opacity-0 transition group-hover:opacity-100" />
                </div>
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-xs text-mute">Las fotos de esta sección son de la propia tienda. Los artículos y vídeos pertenecen a sus medios.</p>
      </div>
    </section>
  );
}
