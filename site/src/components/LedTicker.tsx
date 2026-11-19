"use client";
import { business } from "@/data/business";
import { useShopStatus } from "@/lib/status";

/** Panel LED de matriz de puntos con el estado real de la tienda (hora de Ceuta). */
export default function LedTicker() {
  const status = useShopStatus();
  const items = [
    status ? status.label : "L-V 10:00-14:00 · 17:00-21:00 · Sábados 10:00-14:00",
    `${business.street} · ${business.city}`,
    ...business.claims,
    "Pregunta por WhatsApp",
  ];
  const run = (hidden: boolean) => (
    <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={i === 0 && status?.open ? "text-[#3ddc84] [text-shadow:0_0_10px_rgb(61_220_132/0.6)]" : ""}>{t}</span>
          <span className="mx-6 inline-block size-1.5 rounded-full bg-led shadow-[0_0_8px_var(--led)]" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="ledboard relative border-y border-[rgb(255_43_43/0.25)]">
      <div className="dot led-text flex overflow-hidden whitespace-nowrap py-3.5 text-[0.95rem] sm:text-lg">
        <div className="flex w-max animate-[ticker_38s_linear_infinite] motion-reduce:animate-none hover:[animation-play-state:paused]">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </div>
  );
}
