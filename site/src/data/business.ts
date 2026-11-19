/**
 * Datos del negocio. Todo lo que aparece aquí está respaldado por una fuente
 * (Google Business, prensa o la fachada/Instagram de la tienda). Si algo cambia, se edita solo aquí.
 */

/** CAMBIAR por el dominio definitivo de Hostinger antes de publicar (Open Graph, sitemap, robots, datos estructurados). */
export const SITE_URL = "https://lacarniceriadetomas.es";

export const business = {
  name: "La Carnicería de Tomás",
  shortName: "Carnicería Tomás",
  owner: "Tomás Carnicero Jiménez",
  street: "C/ Real, 40",
  postalCode: "51001",
  city: "Ceuta",
  landmark: "Frente a La Despensa de Marta",
  geo: { lat: 35.8880992, lng: -5.305901 },
  /** Teléfono fijo, que también atiende WhatsApp (confirmado por el cliente). */
  phone: { display: "956 51 52 57", e164: "+34956515257" },
  /** Número usado en todos los enlaces de WhatsApp. Solo dígitos, con prefijo de país. */
  whatsapp: "34956515257",
  instagram: { handle: "@lacarniceriadetomas", url: "https://www.instagram.com/lacarniceriadetomas/" },
  googleMaps:
    "https://www.google.com/maps/place/La+carnicer%C3%ADa+de+Tom%C3%A1s/@35.8880992,-5.305901,17z/data=!3m1!4b1!4m6!3m5!1s0xd0ca4005a0d5c8b:0xb3925237ce9b9a10!8m2!3d35.8880992!4d-5.305901!16s%2Fg%2F11f3_tdr01",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=La%20carnicer%C3%ADa%20de%20Tom%C3%A1s%2C%20C.%20Real%2C%2040%2C%2051001%20Ceuta",
  mapEmbed: "https://maps.google.com/maps?q=La%20carnicer%C3%ADa%20de%20Tom%C3%A1s%2C%20C.%20Real%2040%2C%20Ceuta&z=17&output=embed",
  /** Valoración pública en Google (consultada el 19/11/2026). Actualizar de vez en cuando. */
  rating: { value: 4.4, count: 26, checkedOn: "noviembre de 2026" },
  /** Lo que la propia tienda rotula en su fachada. */
  claims: ["Carnes naturales nacionales y de importación", "Elaborados artesanales", "Atención personalizada"],
  regions: ["Madrid", "Andalucía", "Extremadura"],
} as const;

/** Horario (Google Business). 0 = domingo … 6 = sábado. Tramos en hora local de Ceuta. */
export type Slot = [open: string, close: string];
export const hours: Record<number, Slot[]> = {
  1: [["10:00", "14:00"], ["17:00", "21:00"]],
  2: [["10:00", "14:00"], ["17:00", "21:00"]],
  3: [["10:00", "14:00"], ["17:00", "21:00"]],
  4: [["10:00", "14:00"], ["17:00", "21:00"]],
  5: [["10:00", "14:00"], ["17:00", "21:00"]],
  6: [["10:00", "14:00"]],
  0: [],
};

export const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/** Mensaje prerellenado de WhatsApp para un producto concreto. No se envía solo: el cliente lo revisa. */
export function productMessage(productName: string) {
  return `¡Hola, buenas! Estoy interesado/a en «${productName}». ¿Me podéis confirmar si lo tenéis disponible ahora mismo en la tienda? ¡Muchas gracias!`;
}

export function whatsappLink(text?: string, number: string = business.whatsapp) {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const generalMessage = "¡Hola, buenas! Os escribo desde la web de La Carnicería de Tomás. ";
