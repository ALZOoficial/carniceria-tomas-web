"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BASE } from "@/lib/base";
import { generalMessage, whatsappLink } from "@/data/business";
import { ArrowIcon, WhatsAppIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * Portada «Abrimos la persiana».
 * Plano 1: la fachada real de C/ Real 40 de noche, persiana bajada; se enciende el neón del rótulo y sube la persiana.
 * Plano 2: la cámara entra por la puerta hasta el mostrador real.
 * Vídeo generado con Higgsfield (Kling 4.0) a partir de las fotos reales de la fachada y del interior. Sin audio.
 * El scroll controla el vídeo; las bandas de cine se abren al entrar en la tienda.
 * Movimiento reducido o ahorro de datos: imagen fija del interior y el texto final.
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
    const src = `${BASE}/media/intro/${mobile ? "hero-m" : "hero-d"}.mp4`;
    let objectUrl: string | null = null;
    let cancelled = false;

    // El vídeo completo en memoria permite buscar fotogramas sin saltos al hacer scroll.
    fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(b);
        v.src = objectUrl;
      })
      .catch(() => { if (!cancelled) v.src = src; });

    const onData = () => { v.classList.add("is-ready"); announce(); };
    v.addEventListener("loadeddata", onData, { once: true });
    const late = window.setTimeout(announce, 2600);
    const unlock = () => { v.play().then(() => v.pause()).catch(() => {}); };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    const ctx = gsap.context(() => {
      const proxy = { t: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (st) => gsap.set("[data-hero='progress']", { scaleX: st.progress }),
        },
      });
      tl.to(proxy, {
        t: 1,
        duration: 0.88,
        onUpdate: () => {
          const d = v.duration;
          if (d && Number.isFinite(d)) {
            const target = Math.min(d - 0.04, proxy.t * d);
            if (Math.abs(v.currentTime - target) > 0.01) v.currentTime = target;
          }
        },
      }, 0)
        // Texto 1: la calle a oscuras
        .to("[data-hero='p0']", { autoAlpha: 0, y: -30, duration: 0.07 }, 0.14)
        // Texto 2: sube la persiana
        .fromTo("[data-hero='p1']", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.3)
        .to("[data-hero='p1']", { autoAlpha: 0, y: -30, duration: 0.07 }, 0.47)
        // Al entrar en la tienda se abren las bandas de cine
        .to("[data-hero='bar-top']", { yPercent: -100, duration: 0.2 }, 0.58)
        .to("[data-hero='bar-bottom']", { yPercent: 100, duration: 0.2 }, 0.58)
        // Texto final dentro de la tienda
        .fromTo("[data-hero='shade']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.8)
        .fromTo("[data-hero='p2'] > *", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.06, stagger: 0.015 }, 0.84)
        .to({}, { duration: 0.06 });
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
  const posterD = `${BASE}/media/intro/${isStatic ? "hero-end-d" : "hero-poster-d"}.jpg`;
  const posterM = `${BASE}/media/intro/${isStatic ? "hero-end-m" : "hero-poster-m"}.jpg`;

  return (
    <section id="inicio" ref={wrap} aria-label="Portada" className={`relative ${isStatic ? "min-h-[100dvh]" : "h-[440svh]"}`}>
      <div className="sticky top-0 h-[100dvh] min-h-[560px] overflow-hidden bg-[#050505]">
        <picture>
          <source media="(max-width: 767px)" srcSet={posterM} />
          <img
            src={posterD}
            alt="Fachada de La Carnicería de Tomás en la calle Real de Ceuta, de noche"
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
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 [&.is-ready]:opacity-100"
          />
        )}

        {/* Viñeta de cine */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_42%,transparent_45%,rgb(5_5_5/0.8)_100%)]" />
        <div data-hero="shade" className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent ${isStatic ? "" : "invisible opacity-0"}`} />

        {/* Bandas de cine 2.39:1 */}
        {!isStatic && (
          <>
            <div data-hero="bar-top" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[11vh] bg-[#050505]" />
            <div data-hero="bar-bottom" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[11vh] bg-[#050505]" />
          </>
        )}

        {/* Texto 1 */}
        {!isStatic && (
          <div data-hero="p0" className="absolute inset-x-0 bottom-[16vh] px-6 text-center">
            <p className="kicker">C/ Real, 40</p>
            <p className="display mx-auto mt-4 max-w-[18ch] text-[clamp(2.2rem,5vw,4.25rem)] leading-[0.95] text-bone">
              En pleno centro de Ceuta.
            </p>
          </div>
        )}

        {/* Texto 2 */}
        {!isStatic && (
          <div data-hero="p1" className="invisible absolute inset-x-0 bottom-[16vh] px-6 text-center opacity-0">
            <p className="display mx-auto max-w-[20ch] text-[clamp(2.2rem,5vw,4.25rem)] leading-[0.95] text-bone">
              Se levanta la persiana.
            </p>
            <p className="mx-auto mt-4 max-w-md text-bone/75">Más de 35 años de oficio detrás de este mostrador.</p>
          </div>
        )}

        {/* Texto final */}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-[max(2.75rem,7vh)] sm:px-8 lg:px-12">
          <div data-hero="p2" className="max-w-2xl">
            <h1 className={`display text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[0.92] text-bone ${isStatic ? "" : "invisible opacity-0"}`}>
              <span className="sr-only">La Carnicería de Tomás. </span>
              Tu carnicería en el centro de <span className="led-text">Ceuta.</span>
            </h1>
            <p className={`mt-5 max-w-lg text-[1.05rem] text-bone/80 ${isStatic ? "" : "invisible opacity-0"}`}>
              Carnes naturales nacionales y de importación, elaborados de la casa y atención personalizada.
            </p>
            <div className={`mt-7 flex flex-wrap gap-3 ${isStatic ? "" : "invisible opacity-0"}`}>
              <a href="#catalogo" className="btn btn-led">
                Ver el catálogo <ArrowIcon />
              </a>
              <a href={whatsappLink(generalMessage)} target="_blank" rel="noopener" className="btn btn-ghost bg-black/40 backdrop-blur">
                <WhatsAppIcon /> Escríbenos
              </a>
            </div>
          </div>
        </div>

        {/* Progreso de la secuencia */}
        {!isStatic && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.06]">
            <div data-hero="progress" className="h-full origin-left scale-x-0 bg-led shadow-[0_0_10px_var(--led)]" />
          </div>
        )}
      </div>
    </section>
  );
}
