"use client";
import { useEffect, useState } from "react";
import { dayNames, hours } from "@/data/business";

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Hora local de Ceuta, sea cual sea la zona horaria del visitante. */
export function ceutaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Ceuta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

export type ShopStatus = {
  open: boolean;
  label: string;
  short: string;
  /** Frase del siguiente cambio: «Cierra a las 14:00» / «Abrimos mañana a las 10:00». */
  next: string;
  /** Minutos hasta el siguiente cambio (solo si es hoy). */
  minutesLeft: number | null;
  today: number;
  minutes: number;
};

export const toMinutes = toMin;

export function computeStatus(date = new Date()): ShopStatus {
  const { day, minutes } = ceutaNow(date);
  const base = { today: day, minutes };
  const slots = hours[day] ?? [];
  for (const [o, c] of slots) {
    if (minutes >= toMin(o) && minutes < toMin(c)) {
      return { ...base, open: true, label: `Abierto ahora · cierra a las ${c}`, short: "Abierto", next: `Cierra a las ${c}`, minutesLeft: toMin(c) - minutes };
    }
  }
  const later = slots.find(([o]) => minutes < toMin(o));
  if (later) return { ...base, open: false, label: `Cerrado · abrimos hoy a las ${later[0]}`, short: "Cerrado", next: `Abrimos hoy a las ${later[0]}`, minutesLeft: toMin(later[0]) - minutes };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (hours[d]?.length) {
      const when = i === 1 ? "mañana" : `el ${dayNames[d].toLowerCase()}`;
      return { ...base, open: false, label: `Cerrado · abrimos ${when} a las ${hours[d][0][0]}`, short: "Cerrado", next: `Abrimos ${when} a las ${hours[d][0][0]}`, minutesLeft: null };
    }
  }
  return { ...base, open: false, label: "Cerrado", short: "Cerrado", next: "", minutesLeft: null };
}

/** Estado en vivo. Devuelve null en el primer render (HTML estático) para evitar desajustes de hidratación. */
export function useShopStatus() {
  const [status, setStatus] = useState<ShopStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(computeStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}
