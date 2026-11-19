"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photo, photoSet } from "@/data/catalog";

gsap.registerPlugin(ScrollTrigger);

/** Lo que sale del obrador de la tienda (todas son fotos reales de Instagram @lacarniceriadetomas). */
const pieces = [
  { img: "pastel-tomate", name: "Pastel de carne «tomate»", note: "El trampantojo de la casa." },
  { img: "hamburguesas", name: "Hamburguesas con nombre", note: "«Legendario», «La locura», «Te la tienes que ganar»…" },
  { img: "roscon-salado", name: "Roscón de Reyes salado", note: "Carne picada, jamón, queso y hojaldre." },
  { img: "chorizos", name: "Chorizos de la casa", note: "Elaboración artesanal, a la vista." },
  { img: "hojaldres", name: "Hojaldres rellenos", note: "Listos para el horno." },
  { img: "halloween", name: "Creaciones de temporada", note: "Cada fecha trae sus piezas." },
];

/**
 * Galería horizontal fijada: el scroll vertical desplaza las piezas en horizontal (desde 1024 px).
 * En móvil y con movimiento reducido es un carrusel con scroll-snap.
 */
export default function HechoEnCasa() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const distance = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      // Ligero desplazamiento interno de cada foto: sensación de profundidad.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={wrap} aria-labelledby="casa-title" className="relative overflow-hidden border-y border-line bg-[#0a0a0b]">
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-20 sm:px-8 lg:h-[100dvh] lg:w-max lg:snap-none lg:items-center lg:gap-8 lg:overflow-visible lg:px-12 lg:py-0"
      >
        <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-center sm:w-[420px] lg:w-[34vw] lg:pr-8">
          <h2 id="casa-title" className="display text-[clamp(3rem,7vw,6.5rem)] leading-[1.04]">
            Hecho <span className="led-text">en casa.</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-lg text-bone/75">
            Casi todo lo que ves en el mostrador sale del obrador de la tienda.
          </p>
        </div>
        {pieces.map((p, i) => (
          <figure key={p.img} className={`w-[78vw] shrink-0 snap-start sm:w-[420px] ${i % 2 ? "lg:w-[30vw] lg:self-end lg:pb-[10vh]" : "lg:w-[34vw] lg:self-start lg:pt-[12vh]"}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-ink-3">
              <img
                data-parallax
                src={photo(p.img, 1280)}
                srcSet={photoSet(p.img)}
                sizes="(min-width: 1024px) 34vw, 78vw"
                alt={p.name}
                loading="lazy"
                className="absolute inset-y-0 -left-[10%] h-full w-[120%] max-w-none object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="display text-2xl">{p.name}</span>
            </figcaption>
            <p className="mt-1 text-sm text-mute">{p.note}</p>
          </figure>
        ))}
        <div className="w-4 shrink-0 lg:w-[8vw]" aria-hidden="true" />
      </div>
    </section>
  );
}
