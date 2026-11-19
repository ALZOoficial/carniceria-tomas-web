import { business } from "@/data/business";
import { photo } from "@/data/catalog";
import { Stars } from "./Icons";

/** Presentación breve. Fuentes: El Pueblo de Ceuta (2023) y El Faro de Ceuta (2021). */
export default function About() {
  return (
    <section id="la-carniceria" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
        <div className="lg:col-span-6">
          <h2 id="about-title" className="display text-[clamp(2.6rem,5.4vw,4.75rem)] leading-[1.04]" data-reveal>
            Más de 35 años detrás del <span className="led-text">mostrador.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg text-bone/80" data-reveal>
            Tomás empezó en el oficio con 16 años, en Madrid. Hoy despacha en la calle Real con carne de la península y casi
            todo hecho en casa.
          </p>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6" data-reveal>
            <div>
              <dd className="dot led-text text-[clamp(2.4rem,4.6vw,3.4rem)] leading-none">35+</dd>
              <dt className="mt-3 text-sm text-mute">años de oficio</dt>
            </div>
            <div>
              <dd className="dot led-text text-[clamp(2.4rem,4.6vw,3.4rem)] leading-none">7</dd>
              <dt className="mt-3 text-sm text-mute">carnicerías en Madrid antes de Ceuta</dt>
            </div>
            <div>
              <dd className="dot led-text text-[clamp(2.4rem,4.6vw,3.4rem)] leading-none">{business.rating.value.toString().replace(".", ",")}</dd>
              <dt className="mt-3 flex flex-col gap-1.5 text-sm text-mute">
                <Stars value={business.rating.value} className="size-3.5" />
                en Google
              </dt>
            </div>
          </dl>
        </div>

        <figure className="relative lg:col-span-6" data-reveal>
          <div className="relative overflow-hidden rounded-[6px]">
            <img
              src={photo("interior", 1280)}
              srcSet={`${photo("interior", 640)} 640w, ${photo("interior", 1280)} 1280w`}
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt="Interior de la tienda: mostrador refrigerado, paredes rojas y la vaca de la entrada"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgb(0_0_0/0.55)]" />
          </div>
          <figcaption className="mt-3 text-sm text-mute">C/ Real, 40. {business.landmark}.</figcaption>
        </figure>
      </div>
    </section>
  );
}
