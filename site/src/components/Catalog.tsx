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
  const lastTile = useRef<CategoryId | null>(null);

  const animateIn = useCallback((sel: string) => {
    if (reduced() || !stage.current) return;
    const els = stage.current.querySelectorAll(sel);
    gsap.fromTo(els, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out", clearProps: "transform,opacity" });
  }, []);

  const scrollToStage = () => {
    const top = stage.current!.getBoundingClientRect().top + window.scrollY - 64 - 16;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: reduced() ? "auto" : "smooth" });
  };

  const show = useCallback((id: CategoryId | null, push = true) => {
    if (id) lastTile.current = id;
    if (push) {
      const url = id ? `${HASH}${id}` : "#catalogo";
      if (window.location.hash !== url) history.pushState({ cat: id }, "", url);
    }
    setOpen(id);
  }, []);

  // Enlace directo y botón Atrás del navegador.
  useEffect(() => {
    const fromUrl = parseHash();
    if (fromUrl) setOpen(fromUrl);
    const onPop = () => setOpen(parseHash());
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => { window.removeEventListener("popstate", onPop); window.removeEventListener("hashchange", onPop); };
  }, []);

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
      scrollToStage();
      animateIn("[data-tile]");
    }
  }, [open, animateIn]);

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
    <section id="catalogo" aria-labelledby="catalog-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <p className="kicker" data-reveal>Catálogo y stock</p>
        <h2 id="catalog-title" className="display mt-4 text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.04]" data-reveal>
          Elige por <span className="led-text">animal.</span>
        </h2>
        <p className="mt-5 max-w-[52ch] text-bone/75" data-reveal>
          Sin precios: el mostrador cambia cada día. Pulsa <strong className="font-semibold text-bone">Preguntar</strong> en
          cualquier producto y te confirmamos por WhatsApp si lo hay.
        </p>

        <div ref={stage} className="mt-12">
          {!current ? (
            <ul className="flex flex-col gap-2 lg:h-[min(74vh,720px)] lg:flex-row lg:gap-2" aria-label="Categorías">
              {categories.map((c, i) => (
                <CategoryStrip key={c.id} c={c} index={i} onOpen={() => show(c.id)} />
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

/** Franja de categoría. Escritorio: acordeón horizontal que se expande al pasar o enfocar. Móvil: franja apilada. */
function CategoryStrip({ c, index, onOpen }: { c: Category; index: number; onOpen: () => void }) {
  const count = productsByCategory(c.id).length;
  return (
    <li className="group/strip relative h-28 transition-[flex-grow] duration-700 ease-[var(--ease-out)] sm:h-36 lg:h-full lg:flex-1 lg:hover:flex-[3.2] lg:focus-within:flex-[3.2]">
      <button
        type="button"
        data-tile={c.id}
        onClick={onOpen}
        aria-label={`${c.name}: ver ${count} productos`}
        className="relative block size-full overflow-hidden rounded-[6px] text-left"
      >
        {c.cover ? (
          <img
            src={photo(c.cover, 1280)}
            srcSet={photoSet(c.cover)}
            sizes="(min-width: 1024px) 40vw, 100vw"
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover brightness-[0.5] saturate-[0.75] transition duration-700 ease-[var(--ease-out)] group-hover/strip:scale-[1.04] group-hover/strip:brightness-[0.85] group-hover/strip:saturate-100 group-focus-visible/strip:brightness-[0.85]"
          />
        ) : (
          <span className="ledboard absolute inset-0" />
        )}
        <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent lg:bg-gradient-to-t lg:from-black/90 lg:via-black/25" />
        <span className="pointer-events-none absolute inset-0 rounded-[6px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] transition group-hover/strip:shadow-[inset_0_0_0_1px_var(--led),0_0_32px_rgb(255_43_43/0.3)]" />

        <span className="absolute inset-y-0 left-5 flex flex-col justify-center lg:inset-x-6 lg:bottom-7 lg:top-auto lg:justify-end">
          <span className="dot text-xs text-bone/60">{String(index + 1).padStart(2, "0")}</span>
          <span className="display mt-1 block text-[clamp(1.9rem,2.4vw,2.8rem)] leading-[1.04] text-bone [overflow-wrap:anywhere]">
            {c.name}
          </span>
          <span className="mt-2 hidden max-w-xs translate-y-2 text-sm text-bone/75 opacity-0 transition duration-500 lg:block lg:group-hover/strip:translate-y-0 lg:group-hover/strip:opacity-100 lg:group-focus-within/strip:translate-y-0 lg:group-focus-within/strip:opacity-100">
            {c.tagline}
          </span>
        </span>
        <span className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-2 text-sm text-bone lg:right-6 lg:top-6 lg:translate-y-0">
          <span className="dot">{count}</span>
          <span className="grid size-9 place-items-center rounded-full border border-white/25 bg-black/30 transition group-hover/strip:border-led group-hover/strip:bg-brand">
            <ArrowIcon className="size-4" />
          </span>
        </span>
      </button>
    </li>
  );
}

function CategoryPanel({ c, onBack, onSwitch }: { c: Category; onBack: () => void; onSwitch: (id: CategoryId) => void }) {
  const items = productsByCategory(c.id);
  return (
    <div role="region" aria-labelledby="cat-panel-title">
      <div className="sticky top-[var(--header-h)] z-20 -mx-5 border-b border-line bg-ink/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" data-anim>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="btn btn-ghost h-11 min-h-11 shrink-0 px-4">
            <ArrowIcon className="size-4 rotate-180" /> <span>Categorías</span>
          </button>
          <nav aria-label="Cambiar de categoría" className="no-scrollbar -mr-5 flex gap-2 overflow-x-auto pr-5">
            {categories.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => onSwitch(k.id)}
                aria-current={k.id === c.id ? "true" : undefined}
                className={`h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition ${
                  k.id === c.id ? "border-led bg-led/15 text-bone" : "border-white/12 text-mute hover:border-white/30 hover:text-bone"
                }`}
              >
                {k.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4" data-anim>
        <h3 id="cat-panel-title" tabIndex={-1} className="display text-[clamp(2.6rem,6vw,5rem)] leading-none outline-none">
          {c.name}
        </h3>
        <p className="text-sm text-mute">{items.length} productos</p>
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
      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-led">{label}</dt>
      {value ? (
        <dd className="mt-1 text-[0.95rem] font-semibold leading-snug text-bone">
          {value}
          {note && <span className="mt-0.5 block text-xs font-normal text-mute">{note}</span>}
        </dd>
      ) : (
        <dd className="mt-1 text-[0.95rem] leading-snug text-mute">Pendiente de confirmar</dd>
      )}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const wa = whatsappLink(productMessage(p.name), p.whatsapp);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-line bg-ink-2 transition-colors duration-300 hover:border-white/20">
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
            <p className="dot led-text text-2xl leading-tight">{p.name}</p>
          </div>
        )}
        {p.status && (
          <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-bone">
            {p.status === "temporada" ? "De temporada" : "Por encargo"}
          </span>
        )}
      </div>
      {p.stockImage && <p className="px-5 pt-2 text-[0.7rem] text-mute">Imagen ilustrativa</p>}
      <div className="flex flex-1 flex-col p-5 pt-3">
        <h4 className="display text-[1.85rem] leading-[1.04]">{p.name}</h4>
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
              <WhatsAppIcon className="size-5" /> Preguntar disponibilidad
            </span>
            <ArrowIcon className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
