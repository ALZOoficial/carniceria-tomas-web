"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Encendido del rótulo: el trazo rojo del logo se dibuja como un neón y el nombre parpadea hasta quedarse fijo.
 * - Solo en la primera visita de la sesión (sessionStorage).
 * - Mínimo ~1,7 s, máximo ~2,8 s: se retira en cuanto el vídeo de la portada está listo.
 * - Movimiento reducido: logo fijo durante un instante, sin parpadeos.
 * - Sin JS no se muestra (la clase .js la pone un script en <head>).
 */
const KEY = "ct-intro-seen";

export default function Preloader() {
  const [phase, setPhase] = useState<"on" | "leaving" | "gone">("on");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen) { setPhase("gone"); return; }
    try { sessionStorage.setItem(KEY, "1"); } catch {}

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 500 : 1750;
    const maxMs = reduce ? 900 : 2800;
    const start = performance.now();
    let ready = false;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setPhase("leaving");
      window.setTimeout(() => setPhase("gone"), 700);
    };
    const onReady = () => {
      ready = true;
      const wait = Math.max(0, minMs - (performance.now() - start));
      window.setTimeout(finish, wait);
    };
    window.addEventListener("ct:intro-ready", onReady, { once: true });
    if ((window as unknown as { __ctIntroReady?: boolean }).__ctIntroReady) onReady();
    const cap = window.setTimeout(finish, maxMs);
    const skip = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish(); };
    window.addEventListener("keydown", skip);
    void ready;
    return () => {
      window.clearTimeout(cap);
      window.removeEventListener("ct:intro-ready", onReady);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("preloading", phase === "on");
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      ref={ref}
      className={`preloader fixed inset-0 z-[100] grid place-items-center bg-black transition-[opacity,visibility] duration-700 ease-[var(--ease-out)] ${
        phase === "leaving" ? "invisible opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      onClick={() => setPhase((p) => (p === "on" ? "leaving" : p))}
    >
      <span className="sr-only">Cargando La Carnicería de Tomás</span>
      <div className="preloader-sign relative aspect-square w-[min(68vw,420px)]" aria-hidden="true">
        <img src="/media/brand/logo-stroke.webp" alt="" width={720} height={720} className="pl-stroke absolute inset-0 size-full" />
        <img src="/media/brand/logo-words.webp" alt="" width={720} height={720} className="pl-words absolute inset-0 size-full" />
      </div>
      <p className="pl-caption dot absolute bottom-[12vh] text-xs tracking-[0.3em] text-mute" aria-hidden="true">
        Encendiendo el escaparate
      </p>
      <style>{`
        .seen-intro .preloader { display: none; }
        html:not(.js) .preloader { display: none; }
        .preloader-sign { transition: transform 0.7s var(--ease-out); }
        .preloader.invisible .preloader-sign { transform: scale(1.08); }
        .pl-stroke {
          clip-path: inset(0 0 100% 0);
          filter: drop-shadow(0 0 6px rgb(255 43 43 / 0.9)) drop-shadow(0 0 22px rgb(255 43 43 / 0.55));
          animation: pl-draw 0.95s cubic-bezier(0.65, 0, 0.35, 1) 0.15s forwards;
        }
        .pl-words {
          opacity: 0;
          filter: drop-shadow(0 0 4px rgb(255 255 255 / 0.6)) drop-shadow(0 0 18px rgb(255 43 43 / 0.45));
          animation: led-on 0.9s steps(1, end) 0.95s forwards;
        }
        .pl-caption { opacity: 0; animation: led-on 0.6s steps(1, end) 1.25s forwards; }
        @keyframes pl-draw { to { clip-path: inset(0 0 0 0); } }
        @media (prefers-reduced-motion: reduce) {
          .pl-stroke { clip-path: none; animation: none; }
          .pl-words, .pl-caption { opacity: 1; animation: none; }
        }
      `}</style>
    </div>
  );
}
