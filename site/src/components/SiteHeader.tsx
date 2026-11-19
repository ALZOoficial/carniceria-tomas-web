"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { business, generalMessage, whatsappLink } from "@/data/business";
import { useShopStatus } from "@/lib/status";
import { CloseIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { BASE } from "@/lib/base";

const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#la-carniceria", label: "La carnicería" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#nos-han-visitado", label: "Nos han visitado" },
  { href: "#localizacion", label: "Localización" },
  { href: "#contacto", label: "Contacto" },
];

function useFocusTrap(active: boolean, ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const prev = document.activeElement as HTMLElement | null;
    const q = () => Array.from(root.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"));
    q()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key !== "Tab") return;
      const els = q();
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, [active, ref, onClose]);
}

export default function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const status = useShopStatus();
  const closeMenu = useCallback(() => setMenu(false), []);
  const closeContact = useCallback(() => setContact(false), []);
  useFocusTrap(menu, menuRef, closeMenu);
  useFocusTrap(contact, contactRef, closeContact);

  // Fondo de la cabecera al salir de la portada: se observa la portada entera, que deja de verse
  // tanto al hacer scroll como al saltar a un ancla.
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,border-color] duration-500 ${
          scrolled ? "border-b border-line bg-ink/80 backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-expanded={menu}
              aria-controls="site-menu"
              className="group grid size-11 place-items-center rounded-full border border-white/15 bg-black/30 transition hover:border-led"
            >
              <span className="sr-only">Abrir menú</span>
              <span aria-hidden="true" className="flex w-[18px] flex-col gap-[4px]">
                <span className="h-[2px] w-full bg-bone transition group-hover:bg-led group-hover:shadow-[0_0_8px_var(--led)]" />
                <span className="h-[2px] w-[70%] bg-bone transition-all group-hover:w-full group-hover:bg-led group-hover:shadow-[0_0_8px_var(--led)]" />
                <span className="h-[2px] w-full bg-bone transition group-hover:bg-led group-hover:shadow-[0_0_8px_var(--led)]" />
              </span>
            </button>
            <a href="#inicio" className="hidden items-center sm:flex" aria-label={`${business.name}, ir al inicio`}>
              <img src={`${BASE}/media/brand/logo.webp`} alt="" width={720} height={720} className="h-12 w-auto -my-1" />
            </a>
          </div>

          <nav aria-label="Accesos directos" className="flex items-center gap-2">
            <button type="button" onClick={() => setContact(true)} aria-haspopup="dialog" className="btn btn-ghost h-11 min-h-11 px-3.5 sm:px-4">
              <PhoneIcon className="size-4" />
              <span className="dot text-[0.8rem] tracking-[0.1em]">Contacto</span>
            </button>
            <a href={business.directions} target="_blank" rel="noopener" className="btn btn-led h-11 min-h-11 px-3.5 sm:px-4">
              <PinIcon className="size-4" />
              <span className="dot text-[0.8rem] tracking-[0.1em]">
                <span className="hidden min-[400px]:inline">Cómo </span>llegar
              </span>
            </a>
          </nav>
        </div>
      </header>

      {/* ---------- Side menu ---------- */}
      <div className={`fixed inset-0 z-[60] ${menu ? "" : "pointer-events-none"}`} aria-hidden={!menu}>
        <div onClick={closeMenu} className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${menu ? "opacity-100" : "opacity-0"}`} />
        <div
          ref={menuRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          inert={!menu}
          className={`ledboard absolute inset-y-0 left-0 flex w-full max-w-[460px] flex-col border-r border-line px-6 pb-8 pt-5 transition-transform duration-[650ms] ease-[var(--ease-out)] sm:px-10 ${
            menu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <img src={`${BASE}/media/brand/logo.webp`} alt={business.name} width={720} height={720} className="h-16 w-auto" />
            <button type="button" onClick={closeMenu} className="grid size-11 place-items-center rounded-full border border-white/15 hover:border-led">
              <CloseIcon />
              <span className="sr-only">Cerrar menú</span>
            </button>
          </div>
          <div className="led-rule mt-5 w-16" />
          <ol className="mt-8 flex flex-col gap-1">
            {nav.map((item, i) => (
              <li key={item.href} style={{ transitionDelay: menu ? `${120 + i * 45}ms` : "0ms" }} className={`transition-all duration-500 ${menu ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}>
                <a href={item.href} onClick={closeMenu} className="group flex items-baseline gap-4 py-1.5">
                  <span className="dot w-7 text-sm text-mute transition group-hover:text-led">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[2.6rem] text-bone transition group-hover:text-led group-hover:[text-shadow:var(--glow)] sm:text-5xl">{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-auto space-y-3 pt-8 text-sm text-mute">
            <p className="flex items-center gap-2 text-bone">
              <span className={`status-dot ${status?.open ? "is-open" : ""}`} aria-hidden="true" />
              {status ? status.label : "Horario: L-V 10:00-14:00 y 17:00-21:00 · S 10:00-14:00"}
            </p>
            <p>{business.street} · {business.city}</p>
            <a href={business.instagram.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-bone">
              <InstagramIcon className="size-4" /> {business.instagram.handle}
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Contact sheet ---------- */}
      <div className={`fixed inset-0 z-[60] ${contact ? "" : "pointer-events-none"}`} aria-hidden={!contact}>
        <div onClick={closeContact} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${contact ? "opacity-100" : "opacity-0"}`} />
        <div
          ref={contactRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          inert={!contact}
          className={`absolute right-3 top-[calc(var(--header-h)+6px)] w-[min(360px,calc(100vw-24px))] origin-top-right rounded-2xl border border-white/12 bg-ink-2 p-5 shadow-2xl transition-all duration-300 ease-[var(--ease-out)] sm:right-6 ${
            contact ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="kicker">Contacto</p>
              <h2 id="contact-title" className="display mt-1 text-3xl">Habla con la tienda</h2>
            </div>
            <button type="button" onClick={closeContact} className="grid size-10 place-items-center rounded-full border border-white/15 hover:border-led">
              <CloseIcon className="size-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <a href={whatsappLink(generalMessage)} target="_blank" rel="noopener" className="btn btn-led w-full justify-start">
              <WhatsAppIcon /> WhatsApp · {business.phone.display}
            </a>
            <a href={`tel:${business.phone.e164}`} className="btn btn-ghost w-full justify-start">
              <PhoneIcon /> Llamar · {business.phone.display}
            </a>
            <a href={business.instagram.url} target="_blank" rel="noopener" className="btn btn-ghost w-full justify-start">
              <InstagramIcon /> {business.instagram.handle}
            </a>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-mute">
            <span className={`status-dot ${status?.open ? "is-open" : ""}`} aria-hidden="true" />
            {status ? status.label : "L-V 10:00-14:00 y 17:00-21:00 · S 10:00-14:00"}
          </p>
        </div>
      </div>
    </>
  );
}
