"use client";
import { useState } from "react";
import { business, generalMessage, whatsappLink } from "@/data/business";
import { reviewHighlights, reviews } from "@/data/content";
import { photo } from "@/data/catalog";
import HoursBoard from "./HoursBoard";
import { ExternalIcon, InstagramIcon, PhoneIcon, PinIcon, Stars, WhatsAppIcon } from "./Icons";

export default function Visit() {
  const [map, setMap] = useState(false);

  return (
    <section id="localizacion" aria-labelledby="visit-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <p className="kicker" data-reveal>Localización y contacto</p>
        <h2 id="visit-title" className="display mt-4 text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.04]" data-reveal>
          Te esperamos en la calle <span className="led-text">Real.</span>
        </h2>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal>
            <HoursBoard />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5" data-reveal>
            {/* Mapa (se carga desde Google al pulsar) */}
            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-[6px] border border-line">
              {map ? (
                <iframe src={business.mapEmbed} title="Mapa: La Carnicería de Tomás, C/ Real 40, Ceuta" className="absolute inset-0 size-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <>
                  <img src={photo("fachada", 1280)} alt="Fachada de la tienda en la calle Real" loading="lazy" className="absolute inset-0 size-full object-cover brightness-[0.45]" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 p-6">
                    <address className="not-italic">
                      <p className="display text-3xl">C/ Real, 40</p>
                      <p className="text-bone/80">{business.postalCode} Ceuta. {business.landmark}.</p>
                    </address>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => setMap(true)} className="btn btn-ghost bg-black/40 backdrop-blur">
                        Mostrar mapa
                      </button>
                      <a href={business.googleMaps} target="_blank" rel="noopener" className="btn btn-ghost bg-black/40 backdrop-blur">
                        Google Maps <ExternalIcon />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div id="contacto" className="scroll-mt-24 rounded-[6px] border border-line bg-ink p-6">
              <p className="text-bone/80">Encargos, dudas o disponibilidad: escríbenos y te contestamos.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a href={business.directions} target="_blank" rel="noopener" className="btn btn-led">
                  <PinIcon /> Cómo llegar
                </a>
                <a href={whatsappLink(generalMessage)} target="_blank" rel="noopener" className="btn btn-ghost">
                  <WhatsAppIcon /> WhatsApp
                </a>
                <a href={`tel:${business.phone.e164}`} className="btn btn-ghost">
                  <PhoneIcon /> {business.phone.display}
                </a>
                <a href={business.instagram.url} target="_blank" rel="noopener" className="btn btn-ghost">
                  <InstagramIcon /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        <div className="mt-24 grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <h3 className="display text-4xl">Lo que dicen en Google</h3>
            <p className="dot led-text mt-6 text-8xl leading-none">{business.rating.value.toString().replace(".", ",")}</p>
            <div className="mt-3 flex items-center gap-3">
              <Stars value={business.rating.value} />
              <span className="text-sm text-mute">{business.rating.count} reseñas</span>
            </div>
            <a href={business.googleMaps} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-led/70 underline-offset-[6px]">
              Ver todas en Google <ExternalIcon />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {reviews.map((r) => (
              <figure key={r.author} className="flex flex-col rounded-[6px] border border-line bg-ink-2 p-6 sm:p-8" data-reveal>
                <Stars value={r.rating} />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-bone">“{r.text}”</blockquote>
                <figcaption className="mt-5 text-sm text-mute">
                  <span className="font-semibold text-bone">{r.author}</span>, reseña en {r.source}, {r.when.toLowerCase()}
                </figcaption>
              </figure>
            ))}
            <ul className="flex flex-wrap gap-2 sm:col-span-2" data-reveal aria-label="Frases destacadas por Google">
              {reviewHighlights.map((h) => (
                <li key={h} className="rounded-full border border-white/12 px-4 py-2 text-sm text-bone/80">“{h}”</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
