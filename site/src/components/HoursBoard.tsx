"use client";
import { dayNames, hours } from "@/data/business";
import { toMinutes, useShopStatus } from "@/lib/status";

/** Ventana visible de la línea de tiempo: de 8:00 a 22:00. */
const START = 8 * 60;
const END = 22 * 60;
const pct = (m: number) => `${((Math.min(END, Math.max(START, m)) - START) / (END - START)) * 100}%`;
const week = [1, 2, 3, 4, 5, 6, 0];
const ticks = [8, 10, 12, 14, 16, 18, 20, 22];

function fmtLeft(min: number) {
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h} h ${m.toString().padStart(2, "0")} min` : `${m} min`;
}

/**
 * Horario visual: línea de tiempo LED del día de hoy con la hora actual de Ceuta,
 * y debajo la semana completa. Datos de src/data/business.ts.
 */
export default function HoursBoard() {
  const s = useShopStatus();
  const today = s?.today ?? 1;
  const now = s?.minutes ?? null;
  const nowLabel = now !== null ? `${String(Math.floor(now / 60)).padStart(2, "0")}:${String(now % 60).padStart(2, "0")}` : "";
  const nowVisible = now !== null && now >= START && now <= END;

  return (
    <div className="rounded-[6px] border border-line bg-ink p-6 sm:p-8">
      {/* Estado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div aria-live="polite">
          <p className={`display text-[clamp(2.4rem,5vw,3.6rem)] leading-none ${s?.open ? "text-[#3ddc84] [text-shadow:0_0_18px_rgb(61_220_132/0.45)]" : "led-text"}`}>
            {s ? (s.open ? "Abierto" : "Cerrado") : "Horario"}
          </p>
          <p className="mt-2 text-bone/80">
            {s ? s.next : "Lunes a viernes 10:00-14:00 y 17:00-21:00. Sábados 10:00-14:00."}
            {s?.minutesLeft != null && s.minutesLeft <= 180 && <span className="text-mute"> (en {fmtLeft(s.minutesLeft)})</span>}
          </p>
        </div>
        {nowLabel && <p className="dot text-3xl text-bone/90 sm:text-4xl" aria-label={`Hora en Ceuta: ${nowLabel}`}>{nowLabel}</p>}
      </div>

      {/* Hoy */}
      <div className="mt-8">
        <p className="text-sm text-mute">Hoy, {dayNames[today].toLowerCase()}</p>
        <div className="relative mt-8 h-10">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
          {ticks.map((t) => (
            <span key={t} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/25" style={{ left: pct(t * 60) }} />
          ))}
          {hours[today].map(([o, c]) => (
            <span
              key={o}
              className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-led shadow-[0_0_14px_var(--led),0_0_32px_rgb(255_43_43/0.35)]"
              style={{ left: pct(toMinutes(o)), width: `calc(${pct(toMinutes(c))} - ${pct(toMinutes(o))})` }}
            />
          ))}
          {!hours[today].length && <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-mute">Hoy no abrimos</span>}
          {nowVisible && (
            <span className="absolute -top-6 bottom-0 w-0" style={{ left: pct(now!) }} aria-hidden="true">
              <span className="dot absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.7rem] text-bone">Ahora</span>
              <span className="absolute bottom-0 left-1/2 top-4 w-[2px] -translate-x-1/2 bg-bone shadow-[0_0_8px_rgb(255_255_255/0.8)]" />
            </span>
          )}
        </div>
        <div className="relative mt-2 h-4 text-[0.7rem] text-mute">
          {ticks.map((t) => (
            <span key={t} className="dot absolute -translate-x-1/2" style={{ left: pct(t * 60) }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Semana */}
      <table className="mt-8 w-full border-t border-line text-sm">
        <caption className="sr-only">Horario semanal</caption>
        <tbody>
          {week.map((d) => {
            const slots = hours[d];
            const isToday = d === today;
            return (
              <tr key={d} className={isToday ? "text-bone" : "text-bone/65"}>
                <th scope="row" className="w-24 py-2 pr-3 text-left font-medium sm:w-28">{dayNames[d]}</th>
                <td className="hidden py-2 sm:table-cell" aria-hidden="true">
                  <div className="relative h-2">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                    {slots.map(([o, c]) => (
                      <span key={o} className={`absolute top-0 h-2 rounded-full ${isToday ? "bg-led shadow-[0_0_10px_var(--led)]" : "bg-led/45"}`} style={{ left: pct(toMinutes(o)), width: `calc(${pct(toMinutes(c))} - ${pct(toMinutes(o))})` }} />
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap py-2 pl-4 text-right tabular-nums">
                  {slots.length ? slots.map(([o, c]) => `${o}-${c}`).join(", ") : <span className="text-mute">Cerrado</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-mute">Hora de Ceuta. Festivos: confírmalo por WhatsApp.</p>
    </div>
  );
}
