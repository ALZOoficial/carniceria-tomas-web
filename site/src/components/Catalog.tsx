"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { categories, photo, photoSet, productsByCategory, type Category, type CategoryId, type Product } from "@/data/catalog";
import { productMessage, whatsappLink } from "@/data/business";
import { ArrowIcon, WhatsAppIcon } from "./Icons";

const HASH = "#catalogo/";
const parseHash = (): CategoryId | null => {
  if (typeof window === "undefined" || !window.location.hash.startsWith(HASH)) return null;
  const id = window.location.hash.slice(HASH.length) as CategoryId;
  return categories.some((c) => c.id === id) ? id : null;
};
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Catalog() {
  const [open, setOpen] = useState<CategoryId | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const lastTile = useRef<CategoryId | null>(null);

  const animateIn = useCallback((sel: string) => {
    if (reduced() || !stage.current) return;
    const els = stage.current.querySelectorAll(sel);
    gsap.fromTo(els, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out", clearProps: "transform,opacity" });
  }, []);

  // Lleva la vista al principio del catálogo abierto (bajo la cabecera fija).
  const scrollToStage = () => {
    const top = stage.current!.getBoundingClientRect().top + window.scrollY - 64 - 16;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: reduced() ? "auto" : "smooth" });
  };

  const show = useCallback(
    (id: CategoryId | null, push = true) => {
      if (id) lastTile.current = id;
      if (push) {
        const url = id ? `${HASH}${id}` : "#catalogo";
        if (window.location.hash !== url) history.pushState({ cat: id }, "", url);
      }
      setOpen(id);
    },
    [],
  );

  // Abrir desde la URL (enlace directo) y responder al botón Atrás del navegador.
  useEffect(() => {
    const fromUrl = parseHash();
    if (fromUrl) setOpen(fromUrl);
    const onPop = () => setOpen(parseHash());
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => { window.removeEventListener("popstate", onPop); window.removeEventListener("hashchange", onPop); };
  }, []);

  // Animación y foco al cambiar de vista.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (open) {
      stage.current?.querySelector<HTMLElement>("#cat-panel-title")?.focus({ preventScroll: true });
      scrollToStage();
      animateIn("[data-anim]");
    } else {
      const t = lastTile.current;
      const tile = t ? stage.current?.querySelector<HTMLElement>(`[data-tile="${t}"]`) : null;
      tile?.focus({ preventScroll: true });
      // Al volver, la categoría que estaba abierta queda a la vista.
      tile?.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
      animateIn("[data-tile]");
    }
  }, [open, animateIn]);

  // Esc cierra la categoría.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[aria-modal='true']:not([inert])")) show(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, show]);

  const current = open ? categories.find((c) => c.id === open)! : null;

  return (
    <section id="catalogo" ref={section} aria-labelledby="catalog-title" className="relative border-t border-line bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="kicker" data-reveal>Catálogo · Stock</p>
            <h2 id="catalog-title" className="display mt-4 text-[clamp(3rem,8vw,7rem)]" data-reveal>
              Elige <span className="led-text">animal.</span>
            </h2>
          </div>
          <p className="max-w-md text-bone/75" data-reveal>
            Esto es lo que trabaja la casa. Sin precios, porque el mostrador cambia cada día: pulsa{" "}
            <strong className="text-bone">Preguntar</strong> en cualquier producto y te confirmamos por WhatsApp si lo hay.
          </p>
        </div>

        <div ref={stage} className="mt-12">
          {!current ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3" aria-label="Categorías">
              {categories.map((c, i) => (
                <li key={c.id}>
                  <CategoryTile c={c} index={i} onOpen={() => show(c.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <CategoryPanel c={current} onBack={() => show(null)} onSwitch={(id) => show(id)} />
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ c, index, onOpen }: { c: Category; index: number; onOpen: () => void }) {
  const count = productsByCategory(c.id).length;
  return (
    <button
      type="button"
      data-tile={c.id}
      onClick={onOpen}
      aria-label={`${c.name}: ver ${count} productos`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[4px] border border-line text-left sm:aspect-[5/4] lg:aspect-[4/3.4]"
    >
      {c.cover ? (
        <img
          src={photo(c.cover, 640)}
          srcSet={photoSet(c.cover)}
          sizes="(min-width: 1024px) 33vw, 50vw"
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover brightness-[0.55] grayscale-[0.55] transition duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05] group-hover:brightness-[0.8] group-hover:grayscale-0 group-focus-visible:brightness-[0.8] group-focus-visible:grayscale-0"
        />
      ) : (
        <span className="ledboard absolute inset-0 grid place-items-center">
          <span className="dot led-text text-[clamp(2.4rem,7vw,5rem)] opacity-70 transition group-hover:opacity-100">{c.name}</span>
        </span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      {/* Borde LED al pasar */}
      <span className="pointer-events-none absolute inset-0 rounded-[4px] opacity-0 shadow-[inset_0_0_0_2px_var(--led),0_0_28px_rgb(255_43_43/0.35)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="dot absolute left-3 top-3 text-xs text-bone/70 sm:left-5 sm:top-5 sm:text-sm">{String(index + 1).padStart(2, "0")}</span>
      <span className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
        <span className="display block text-[clamp(1.75rem,4.2vw,3.25rem)] text-bone transition group-hover:text-white">{c.name}</span>
        <span className="mt-1 flex items-center justify-between gap-2 text-xs text-bone/70 sm:text-sm">
          <span className="line-clamp-1">{c.tagline}</span>
          <span className="flex shrink-0 items-center gap-1.5 text-bone">
            <span className="dot">{count}</span>
            <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </span>
      </span>
    </button>
  );
}

function CategoryPanel({ c, onBack, onSwitch }: { c: Category; onBack: () => void; onSwitch: (id: CategoryId) => void }) {
  const items = productsByCategory(c.id);
  return (
    <div role="region" aria-labelledby="cat-panel-title">
      <div className="sticky top-[var(--header-h)] z-20 -mx-4 border-b border-line bg-ink-2/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10" data-anim>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="btn btn-ghost h-11 min-h-11 shrink-0 px-4">
            <ArrowIcon className="size-4 rotate-180" /> <span>Categorías</span>
          </button>
          <nav aria-label="Cambiar de categoría" className="no-scrollbar -mr-4 flex gap-2 overflow-x-auto pr-4">
            {categories.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => onSwitch(k.id)}
                aria-current={k.id === c.id ? "true" : undefined}
                className={`dot h-11 shrink-0 rounded-full border px-4 text-[0.78rem] tracking-[0.08em] transition ${
                  k.id === c.id ? "border-led bg-led/15 text-bone shadow-[0_0_14px_rgb(255_43_43/0.35)]" : "border-white/12 text-mute hover:border-white/30 hover:text-bone"
                }`}
              >
                {k.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4" data-anim>
        <h3 id="cat-panel-title" tabIndex={-1} className="display text-[clamp(2.6rem,7vw,5.5rem)] outline-none">
          {c.name}
        </h3>
        <p className="dot text-sm text-mute">{items.length} productos</p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <li key={p.id} data-anim>
            <ProductCard p={p} />
          </li>
        ))}
      </ul>

      <div className="mt-12 flex justify-center" data-anim>
        <button type="button" onClick={onBack} className="btn btn-ghost">
          <ArrowIcon className="size-4 rotate-180" /> Volver a las categorías
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, note }: { label: string; value: string | null; note?: string }) {
  return (
    <div className="min-w-0">
      <dt className="dot text-[0.7rem] tracking-[0.16em] text-led">{label}</dt>
      {value ? (
        <dd className="mt-1 text-[0.95rem] font-semibold leading-snug text-bone">
          {value}
          {note && <span className="mt-0.5 block text-xs font-normal text-mute">{note}</span>}
        </dd>
      ) : (
        <dd className="mt-1 text-[0.95rem] leading-snug text-mute">
          <span className="border-b border-dashed border-white/25">Pendiente de confirmar</span>
        </dd>
      )}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const wa = whatsappLink(productMessage(p.name), p.whatsapp);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-ink transition-colors duration-300 hover:border-white/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        {p.image ? (
          <img
            src={photo(p.image, 640)}
            srcSet={photoSet(p.image)}
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 48vw, 100vw"
            alt={p.name}
            loading="lazy"
            className="size-full object-cover transition duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="ledboard grid size-full place-items-center p-6 text-center">
            <div>
              <p className="dot led-text text-2xl leading-tight">{p.name}</p>
              <p className="mt-3 text-xs text-mute">Foto real próximamente</p>
            </div>
          </div>
        )}
        {p.status && (
          <span className="dot absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[0.68rem] tracking-[0.14em] text-bone">
            {p.status === "temporada" ? "De temporada" : "Por encargo"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="display text-[1.85rem] leading-[0.95]">{p.name}</h4>
        {p.description && <p className="mt-2 text-[0.95rem] text-bone/70">{p.description}</p>}
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
          <Field label="Procedencia" value={p.origin} note={p.originNote} />
          <Field label="Proveedor" value={p.supplier} note={p.supplierNote} />
        </dl>
        <div className="mt-auto pt-5">
          <a
            href={wa}
            target="_blank"
            rel="noopener"
            className="btn btn-ghost w-full justify-between border-white/15 hover:bg-led/10"
            aria-label={`Preguntar por WhatsApp si hay ${p.name}`}
          >
            <span className="flex items-center gap-2">
              <WhatsAppIcon className="size-5 text-[#3ddc84]" /> Preguntar disponibilidad
            </span>
            <ArrowIcon className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
