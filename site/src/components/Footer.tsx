import { business } from "@/data/business";
import { InstagramIcon } from "./Icons";
import { BASE } from "@/lib/base";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-black pb-10 pt-20">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 md:grid-cols-[auto_1fr] lg:px-10">
        <img src={`${BASE}/media/brand/logo.webp`} alt={business.name} width={720} height={720} loading="lazy" className="-ml-4 -mt-6 w-56" />
        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="dot text-xs tracking-[0.16em] text-led">Tienda</p>
            <p className="mt-3 text-bone/80">
              C/ Real, 40
              <br />
              {business.postalCode} Ceuta
            </p>
          </div>
          <div>
            <p className="dot text-xs tracking-[0.16em] text-led">Horario</p>
            <p className="mt-3 text-bone/80">
              Lunes a viernes: 10:00–14:00 y 17:00–21:00
              <br />
              Sábados: 10:00–14:00 · Domingos cerrado
            </p>
          </div>
          <div>
            <p className="dot text-xs tracking-[0.16em] text-led">Contacto</p>
            <p className="mt-3 space-y-1 text-bone/80">
              <a className="block hover:text-bone" href={`tel:${business.phone.e164}`}>{business.phone.display}</a>
              <a className="inline-flex items-center gap-2 hover:text-bone" href={business.instagram.url} target="_blank" rel="noopener">
                <InstagramIcon className="size-4" /> {business.instagram.handle}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1440px] flex-wrap items-center justify-between gap-3 border-t border-line px-4 pt-6 text-xs text-mute sm:px-6 lg:px-10">
        <p>© {new Date().getFullYear()} {business.name} · Carnicería en Ceuta</p>
        <p>El catálogo muestra lo que trabaja la casa; la disponibilidad se confirma por WhatsApp.</p>
      </div>
      <p aria-hidden="true" className="display pointer-events-none mt-10 select-none whitespace-nowrap text-center text-[22vw] leading-[0.8] text-white/[0.03]">
        Calle Real 40
      </p>
    </footer>
  );
}
