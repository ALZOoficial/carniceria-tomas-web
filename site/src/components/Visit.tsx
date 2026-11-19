"use client";
import { useState } from "react";
import { business, dayNames, generalMessage, hours, whatsappLink } from "@/data/business";
import { reviewHighlights, reviews } from "@/data/content";
import { photo } from "@/data/catalog";
import { useShopStatus } from "@/lib/status";
import { ExternalIcon, InstagramIcon, PhoneIcon, PinIcon, Stars, WhatsAppIcon } from "./Icons";

const week = [1, 2, 3, 4, 5, 6, 0];

export default function Visit() {
  const status = useShopStatus();
  const [map, setMap] = useState(false);

  return (
    <section id="localizacion" aria-labelledby="visit-title" className="relative border-t border-line bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p className="kicker" data-reveal>Localización y contacto</p>
        <h2 id="visit-title" className="display mt-4 text-[clamp(3rem,8vw,7rem)]" data-reveal>
          Calle Real, <span className="led-text">40.</span>
        </h2>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* Datos */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-[4px] border border-line bg-ink p-6 sm:p-8" data-reveal>
              <address className="not-italic">
                <p className="text-xl font-semibold text-bone">{business.name}</p>
                <p className="mt-1 text-bone/80">
                  C/ Real, 40 · {business.postalCode} {business.city}
                </p>
                <p className="text-sm text-mute">{business.landmark}</p>
              </address>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <a href={business.directions} target="_blank" rel="noopener" className="btn btn-led">
                  <PinIcon /> Cómo llegar
                </a>
                <a href={`tel:${business.phone.e164}`} className="btn btn-ghost">
                  <PhoneIcon /> {business.phone.display}
                </a>
              </div>
            </div>

            <div className="rounded-[4px] border border-line bg-ink p-6 sm:p-8" data-reveal>
              <div className="flex items-center justify-between gap-4">
                <h3 className="dot text-sm tracking-[0.16em] text-led">Horario</h3>
                <p className="flex items-center gap-2 text-sm text-bone" aria-live="polite">
                  <span className={`status-dot ${status?.open ? "is-open" : ""}`} aria-hidden="true" />
                  {status ? status.label : "Consulta el horario"}
                </p>
              </div>
              <table className="mt-4 w-full text-[0.95rem]">
                <caption className="sr-only">Horario de apertura</caption>
                <tbody>
                  {week.map((d) => {
                    const slots = hours[d];
                    const today = status?.today === d;
                    return (
                      <tr key={d} className={`border-t border-line ${today ? "text-bone" : "text-bone/70"}`}>
                        <th scope="row" className="py-2.5 text-left font-normal">
                          <span className="flex items-center gap-2">
                            {dayNames[d]}
                            {today && <span className="dot rounded-full bg-led/15 px-2 py-0.5 text-[0.65rem] tracking-[0.12em] text-led">Hoy</span>}
                          </span>
                        </th>
                        <td className="py-2.5 text-right tabular-nums">
                          {slots.length ? slots.map(([o, c]) => `${o}–${c}`).join("  ·  ") : <span className="text-mute">Cerrado</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-mute">Horario publicado en Google. Festivos: consúltalo por WhatsApp.</p>
            </div>

            <div id="contacto" className="scroll-mt-24 rounded-[4px] border border-line bg-ink p-6 sm:p-8" data-reveal>
              <h3 className="dot text-sm tracking-[0.16em] text-led">Contacto</h3>
              <p className="mt-2 text-bone/80">Encargos, dudas o disponibilidad: escríbenos y te contestamos.</p>
              <div className="mt-5 grid gap-2">
                <a href={whatsappLink(generalMessage)} target="_blank" rel="noopener" className="btn btn-ghost justify-start">
                  <WhatsAppIcon className="size-5 text-[#3ddc84]" /> WhatsApp · {business.phone.display}
                </a>
                <a href={business.instagram.url} target="_blank" rel="noopener" className="btn btn-ghost justify-start">
                  <InstagramIcon /> {business.instagram.handle}
                </a>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="relative min-h-[420px] overflow-hidden rounded-[4px] border border-line lg:col-span-7" data-reveal>
            {map ? (
              <iframe
                src={business.mapEmbed}
                title="Mapa: La Carnicería de Tomás, C/ Real 40, Ceuta"
                className="absolute inset-0 size-full [filter:grayscale(0.35)_contrast(1.05)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0">
                <img src={photo("fachada", 1280)} alt="Fachada de la tienda en la calle Real" loading="lazy" className="size-full object-cover brightness-[0.45]" />
                <div className="absolute inset-0 grid place-items-center p-6 text-center">
                  <div>
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand text-white shadow-[0_0_40px_rgb(255_43_43/0.6)]">
                      <PinIcon className="size-7" />
                    </span>
                    <p className="display mt-5 text-4xl">Centro de Ceuta</p>
                    <p className="mt-1 text-bone/75">C/ Real, 40 · {business.landmark}</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <button type="button" onClick={() => setMap(true)} className="btn btn-led">
                        Mostrar mapa
                      </button>
                      <a href={business.googleMaps} target="_blank" rel="noopener" className="btn btn-ghost">
                        Abrir en Google Maps <ExternalIcon />
                      </a>
                    </div>
                    <p className="mx-auto mt-4 max-w-xs text-xs text-mute">El mapa se carga desde Google al pulsar.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reseñas */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12" aria-labelledby="reviews-title">
          <div className="lg:col-span-4" data-reveal>
            <h3 id="reviews-title" className="kicker">Reseñas en Google</h3>
            <p className="dot led-text mt-4 text-8xl leading-none">{business.rating.value.toString().replace(".", ",")}</p>
            <div className="mt-3 flex items-center gap-3">
              <Stars value={business.rating.value} />
              <span className="text-sm text-mute">{business.rating.count} reseñas · {business.rating.checkedOn}</span>
            </div>
            <a href={business.googleMaps} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-led/70 underline-offset-[6px]">
              Ver todas en Google <ExternalIcon />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {reviews.map((r) => (
              <figure key={r.author} className="flex flex-col rounded-[4px] border border-line bg-ink p-6 sm:p-8" data-reveal>
                <Stars value={r.rating} />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-bone">«{r.text}»</blockquote>
                <figcaption className="mt-5 text-sm text-mute">
                  <span className="font-semibold text-bone">{r.author}</span> · {r.source} · {r.when}
                </figcaption>
              </figure>
            ))}
            <div className="sm:col-span-2" data-reveal>
              <p className="text-xs text-mute">Frases que Google destaca de las reseñas:</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {reviewHighlights.map((h) => (
                  <li key={h} className="rounded-full border border-white/12 px-4 py-2 text-sm text-bone/85">«{h}»</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
