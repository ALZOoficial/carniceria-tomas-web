"use client";
import { useRef, useState } from "react";
import { presentationVideo } from "@/data/content";
import { PlayIcon } from "./Icons";

/**
 * Vídeo de presentación (Instagram). Preparado para cuando esté disponible:
 * rellenar `presentationVideo.src` (mp4 local) o `instagramUrl` en src/data/content.ts.
 */
export default function PresentationVideo() {
  const { src, poster, instagramUrl } = presentationVideo;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const ready = Boolean(src || instagramUrl);

  const play = () => {
    if (src && ref.current) {
      setPlaying(true);
      ref.current.play().catch(() => {});
    } else if (instagramUrl) {
      window.open(instagramUrl, "_blank", "noopener");
    }
  };

  return (
    <section aria-labelledby="film-title" className="relative bg-black">
      <div className="relative mx-auto flex min-h-[78svh] max-w-[1920px] items-end overflow-hidden">
        {src ? (
          <video
            ref={ref}
            src={src}
            poster={poster}
            playsInline
            preload="none"
            controls={playing}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <img src={poster} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-45" />
        )}
        {!playing && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] led-rule" />
            <div className="relative w-full px-4 pb-14 pt-32 sm:px-6 lg:px-10">
              <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 id="film-title" className="display max-w-[14ch] text-[clamp(3rem,8vw,7.5rem)]">
                    Pasa y mira <span className="led-text">el mostrador.</span>
                  </h2>
                </div>
                {ready ? (
                  <button
                    type="button"
                    onClick={play}
                    className="group flex items-center gap-4 self-start md:self-auto"
                    aria-label="Reproducir el vídeo de presentación"
                  >
                    <span className="grid size-24 place-items-center rounded-full bg-brand text-white shadow-[0_0_0_10px_rgb(227_6_19/0.18),0_0_50px_rgb(255_43_43/0.55)] transition duration-300 group-hover:scale-105 group-hover:bg-led">
                      <PlayIcon className="size-9 translate-x-0.5" />
                    </span>
                    <span className="dot text-sm tracking-[0.2em] text-bone">Reproducir</span>
                  </button>
                ) : (
                  <p className="dot self-start rounded-full border border-white/15 px-5 py-3 text-sm tracking-[0.18em] text-mute md:self-auto">
                    Estreno muy pronto
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
