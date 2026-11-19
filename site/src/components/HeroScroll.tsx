"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { business, generalMessage, whatsappLink } from "@/data/business";
import { ArrowIcon, WhatsAppIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * Portada con scroll: la tienda real está a oscuras y, al desplazarse, se enciende el rótulo,
 * después los focos y por último el mostrador. Vídeo generado con Higgsfield (Kling 4.0) a partir
 * de la foto real del interior (fotograma final = foto real), sin audio.
 *
 * Alternativa ligera (movimiento reducido o ahorro de datos): imagen fija de la tienda encendida.
 */
export default function HeroScroll() {
  const wrap = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"scroll" | "static">("scroll");

  useEffect(() => {
    const announce = () => {
      (window as unknown as { __ctIntroReady?: boolean }).__ctIntroReady = true;
      window.dispatchEvent(new Event("ct:intro-ready"));
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const lowData = !!conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g";
    if (reduce || lowData) {
      setMode("static");
      announce();
      return;
    }

    const v = video.current!;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const src = mobile ? "/media/intro/intro-m.mp4" : "/media/intro/intro-d.mp4";
    let objectUrl: string | null = null;
    let cancelled = false;

    // Cargar el vídeo completo en memoria permite buscar fotogramas sin cortes al hacer scroll.
    fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(b);
        v.src = objectUrl;
      })
      .catch(() => { if (!cancelled) v.src = src; });

    const onData = () => {
      v.classList.add("is-ready");
      announce();
    };
    v.addEventListener("loadeddata", onData, { once: true });
    // Si tarda demasiado (red lenta) no bloqueamos: el póster ya está visible.
    const late = window.setTimeout(announce, 2600);

    // iOS: un primer toque "desbloquea" el decodificador para poder buscar fotogramas.
    const unlock = () => { v.play().then(() => v.pause()).catch(() => {}); };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    const ctx = gsap.context(() => {
      const proxy = { t: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
      tl.to(proxy, {
        t: 1,
        duration: 0.86,
        onUpdate: () => {
          const d = v.duration;
          if (d && Number.isFinite(d)) {
            const target = Math.min(d - 0.04, proxy.t * d);
            if (Math.abs(v.currentTime - target) > 0.01) v.currentTime = target;
          }
        },
      }, 0)
        .to("[data-hero='cue']", { autoAlpha: 0, duration: 0.05 }, 0.02)
        .to("[data-hero='p0']", { autoAlpha: 0, y: -40, duration: 0.1 }, 0.12)
        .fromTo("[data-hero='p1']", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.3)
        .to("[data-hero='p1']", { autoAlpha: 0, y: -40, duration: 0.08 }, 0.54)
        .fromTo("[data-hero='shade']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.68)
        .fromTo("[data-hero='p2']", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.72)
        .to({}, { duration: 0.14 });
    }, wrap);

    return () => {
      cancelled = true;
      window.clearTimeout(late);
      window.removeEventListener("touchstart", unlock);
      ctx.revert();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const isStatic = mode === "static";

  return (
    <section
      id="inicio"
      ref={wrap}
      aria-label="Portada"
      className={`relative ${isStatic ? "h-svh min-h-[560px]" : "h-[340svh]"}`}
    >
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-black">
        {/* Póster (tienda a oscuras) mientras llega el vídeo; tienda encendida en modo estático */}
        <picture>
          <source media="(max-width: 767px)" srcSet={isStatic ? "/media/intro/lit-m.webp" : "/media/intro/poster-m.webp"} />
          <img
            src={isStatic ? "/media/intro/lit-d.webp" : "/media/intro/poster-d.webp"}
            alt="Interior de La Carnicería de Tomás: mostrador de carnes, paredes rojas y la vaca de la entrada"
            className="absolute inset-0 size-full object-cover"
            fetchPriority="high"
          />
        </picture>
        {!isStatic && (
          <video
            ref={video}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className="hero-video absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 [&.is-ready]:opacity-100"
          />
        )}
        {/* Viñeta y legibilidad */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_40%,rgb(0_0_0/0.75)_100%)]" />
        <div data-hero="shade" className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 ${isStatic ? "" : "invisible opacity-0"}`} />

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-[max(2.5rem,6vh)] sm:px-6 lg:px-10">
          {/* Fase 0 — a oscuras */}
          {!isStatic && (
            <div data-hero="p0" className="absolute inset-x-4 top-[24%] sm:inset-x-6 lg:inset-x-10">
              <p className="kicker">Calle Real, 40 · Ceuta</p>
              <p className="display mt-4 max-w-[12ch] text-[clamp(3.2rem,10vw,9rem)] text-bone">
                Se enciende la <span className="led-text">carnicería</span>.
              </p>
            </div>
          )}

          {/* Fase 1 — el rótulo encendido */}
          {!isStatic && (
            <div data-hero="p1" className="invisible isolate absolute inset-x-4 bottom-[14%] opacity-0 sm:inset-x-6 md:left-auto md:right-10 md:max-w-[40rem] md:text-right">
              <span aria-hidden="true" className="absolute -inset-x-20 -inset-y-16 -z-10 bg-[radial-gradient(closest-side,rgb(0_0_0/0.82),rgb(0_0_0/0.5)_60%,transparent)]" />
              <p className="kicker">Lo que pone en la fachada</p>
              <p className="display mt-3 text-[clamp(2.6rem,6.4vw,6rem)]">
                Carnes naturales, nacionales <span className="led-text">y de importación.</span>
              </p>
            </div>
          )}

          {/* Fase 2 — todo encendido */}
          <div data-hero="p2" className={`max-w-3xl ${isStatic ? "" : "invisible opacity-0"}`}>
            <h1>
              <span className="sr-only">La Carnicería de Tomás — </span>
              <img
                src="/media/brand/logo.webp"
                alt=""
                width={720}
                height={720}
                className="-mb-6 -ml-4 h-auto w-[min(62vw,300px)] drop-shadow-[0_0_30px_rgba(255,43,43,0.35)] sm:w-[340px]"
              />
              <span className="display mt-2 block text-[clamp(2rem,4.8vw,3.75rem)] text-bone">Tu carnicería en el centro de Ceuta</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-bone/85">
              Más de 35 años de oficio, elaborados de la casa y un mostrador que se llena cada mañana en la calle Real.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#catalogo" className="btn btn-led">
                Ver el catálogo <ArrowIcon />
              </a>
              <a href={whatsappLink(generalMessage)} target="_blank" rel="noopener" className="btn btn-ghost">
                <WhatsAppIcon /> Escríbenos
              </a>
            </div>
          </div>

          {!isStatic && (
            <div data-hero="cue" className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3" aria-hidden="true">
              <span className="dot text-[0.7rem] tracking-[0.3em] text-mute">Desliza para encender</span>
              <span className="block h-12 w-px overflow-hidden bg-white/15">
                <span className="block h-1/2 w-full animate-[cue_1.8s_ease-in-out_infinite] bg-led shadow-[0_0_8px_var(--led)]" />
              </span>
              <style>{`@keyframes cue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
            </div>
          )}
        </div>
      </div>
      <span className="sr-only">{business.claims.join(". ")}.</span>
    </section>
  );
}
