import { business } from "@/data/business";
import { photo } from "@/data/catalog";
import { Stars } from "./Icons";

/**
 * Presentación breve. Fuentes: El Pueblo de Ceuta (21/10/2023) y El Faro de Ceuta (27/04/2021).
 */
export default function About() {
  return (
    <section id="la-carniceria" aria-labelledby="about-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        {/* Texto */}
        <div className="lg:col-span-6 lg:pt-6">
          <p className="kicker" data-reveal>La carnicería</p>
          <h2 id="about-title" className="display mt-4 text-[clamp(2.9rem,7vw,6.25rem)]" data-reveal>
            Se apellida <span className="led-text">Carnicero.</span>
            <span className="block text-mute">Dice que es casualidad.</span>
          </h2>
          <div className="mt-8 max-w-[34rem] space-y-5 text-bone/85" data-reveal>
            <p>
              Tomás Carnicero Jiménez es madrileño y lleva en el oficio desde los 16 años. En Madrid llegó a tener siete
              carnicerías. En Ceuta abrió primero en la calle Algeciras y hoy despacha en la calle Real, 40; su clientela se
              mudó con él.
            </p>
            <p>
              Casi todo lo que hay en el mostrador se elabora dentro: hamburguesas, albóndigas, pinchitos, chorizos y unos
              pasteles de carne que parecen tomates. Lo único que llega de fábrica son las morcillas. La carne viene sobre
              todo de Madrid, de varios proveedores de la península.
            </p>
            <p>
              Y antes de abrir, entre las nueve y las diez, mientras se monta el mostrador, suenan Guns N&apos; Roses o
              The Police. Tomás lo llama el despertador del barrio.
            </p>
          </div>

          <figure className="mt-10 max-w-[34rem] border-l-2 border-led pl-6" data-reveal>
            <blockquote className="display text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[0.95]">
              «Aquí no entra nada que no sea bueno».
            </blockquote>
            <figcaption className="mt-3 text-sm text-mute">
              Tomás, en{" "}
              <a className="underline decoration-led/60 underline-offset-4 hover:text-bone" href="https://www.elpueblodeceuta.es/art/86732/la-carniceria-de-tomas-el-despertador-rockero-de-la-calle-real" target="_blank" rel="noopener">
                El Pueblo de Ceuta
              </a>{" "}
              (2023)
            </figcaption>
          </figure>
        </div>

        {/* Fotos */}
        <div className="relative lg:col-span-6">
          <figure className="relative overflow-hidden rounded-[4px]" data-reveal>
            <img
              src={photo("fachada-nueva", 1280)}
              srcSet={`${photo("fachada-nueva", 640)} 640w, ${photo("fachada-nueva", 1280)} 1280w`}
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt="Fachada de La Carnicería de Tomás en la calle Real, 40, con el toldo «Carnes naturales nacionales y de importación»"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
            />
            <figcaption className="dot absolute bottom-0 left-0 bg-black/75 px-3 py-2 text-[0.72rem] tracking-[0.18em] text-bone/80">
              C/ Real, 40 · {business.landmark}
            </figcaption>
          </figure>
          <figure className="relative -mt-24 ml-auto w-[48%] max-w-[300px] overflow-hidden rounded-[4px] border-4 border-ink shadow-2xl sm:-mt-32" data-reveal>
            <img
              src={photo("vaca", 640)}
              alt="La vaca sonriente de la entrada, mascota de la tienda"
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="bg-ink-2 px-3 py-2 text-xs text-mute">La vaca de la entrada, mascota de la casa.</figcaption>
          </figure>
        </div>

        {/* Datos LED */}
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3 lg:col-span-12" data-reveal>
          <div className="ledboard p-6 sm:p-8">
            <dt className="text-sm text-mute">Años de oficio</dt>
            <dd className="dot led-text mt-2 text-6xl">35+</dd>
            <dd className="mt-2 text-xs text-mute">Desde los 16, en Madrid y en Ceuta</dd>
          </div>
          <div className="ledboard p-6 sm:p-8">
            <dt className="text-sm text-mute">Carnicerías que tuvo en Madrid</dt>
            <dd className="dot led-text mt-2 text-6xl">7</dd>
            <dd className="mt-2 text-xs text-mute">Antes de instalarse en Ceuta</dd>
          </div>
          <div className="ledboard p-6 sm:p-8">
            <dt className="text-sm text-mute">Valoración en Google</dt>
            <dd className="dot led-text mt-2 text-6xl">{business.rating.value.toString().replace(".", ",")}</dd>
            <dd className="mt-2 flex items-center gap-2 text-xs text-mute">
              <Stars value={business.rating.value} className="size-3.5" /> {business.rating.count} reseñas
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
