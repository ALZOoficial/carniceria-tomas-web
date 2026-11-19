"use client";
import { useEffect } from "react";

/** Añade .is-in a los elementos [data-reveal] cuando entran en pantalla (una sola vez). */
export default function Reveal() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
        if (!seen.has(el)) { seen.add(el); io.observe(el); }
      });
    scan();
    // El catálogo cambia el DOM al abrir categorías.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}
