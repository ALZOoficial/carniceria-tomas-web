import { BASE } from "@/lib/base";
/** Prensa, vídeos, reseñas y vídeo de presentación. Todo con su fuente. */

export type PressItem = {
  outlet: string;
  kind: "Reportaje" | "Perfil" | "Guía";
  title: string;
  date: string; // legible
  dateTime: string; // ISO
  author?: string;
  summary: string;
  url: string;
  /** Foto propia de la tienda usada como ilustración de la tarjeta (no del medio). */
  image: string;
};

export const press: PressItem[] = [
  {
    outlet: "El Pueblo de Ceuta",
    kind: "Reportaje",
    title: "La Carnicería de Tomás: el despertador rockero de la calle Real",
    date: "21 oct 2023",
    dateTime: "2023-10-21",
    author: "Gabriela Sardá",
    summary:
      "Guns N' Roses y The Police a primera hora mientras se prepara el mostrador, 35 años de oficio y una casa donde casi todo se elabora dentro.",
    url: "https://www.elpueblodeceuta.es/art/86732/la-carniceria-de-tomas-el-despertador-rockero-de-la-calle-real",
    image: "interior",
  },
  {
    outlet: "El Faro de Ceuta",
    kind: "Perfil",
    title: "La carnicería de Tomás, las mejores carnes y de todos los tipos en el centro",
    date: "27 abr 2021",
    dateTime: "2021-04-27",
    author: "Paola Pérez Cuenda",
    summary:
      "Un madrileño que empezó en el oficio a los 16 y tuvo siete carnicerías en Madrid antes de abrir en Ceuta. Variedad, elaborados propios y las primeras carnes maduradas.",
    url: "https://elfarodeceuta.es/vive-ceuta/negocios-corazon-ceuta-carniceria-tomas/",
    image: "pastel-tomate",
  },
  {
    outlet: "Mi Charcutería",
    kind: "Guía",
    title: "La Carnicería de Tomás, en la guía de carnicerías de Ceuta",
    date: "14 oct 2024",
    dateTime: "2024-10-14",
    summary: "Ficha en el directorio nacional de carnicerías y charcuterías, con dirección, teléfono y horario.",
    url: "https://micharcuteria.com/ceuta/la-carniceria-de-tomas/",
    image: "fachada-nueva",
  },
];

export type VideoItem = {
  outlet: string;
  title: string;
  date: string;
  dateTime: string;
  platform: "youtube" | "facebook";
  /** URL que se abre en una pestaña nueva. */
  url: string;
  /** URL del reproductor oficial, que solo se carga al pulsar. */
  embed: string;
  /** Miniatura oficial (YouTube) o foto propia de la tienda. */
  thumb: string;
  vertical?: boolean;
  duration?: string;
};

export const videos: VideoItem[] = [
  {
    outlet: "FaroTV Ceuta",
    title: "La carnicería de Tomás, las mejores carnes y de todos los tipos en el centro",
    date: "27 abr 2021",
    dateTime: "2021-04-27",
    platform: "youtube",
    url: "https://youtu.be/EFQPZaY6_8M",
    embed: "https://www.youtube-nocookie.com/embed/EFQPZaY6_8M?autoplay=1&rel=0&modestbranding=1",
    thumb: "https://i.ytimg.com/vi/EFQPZaY6_8M/maxresdefault.jpg",
    duration: "3:36",
  },
  {
    outlet: "RTVCE",
    title: "Estuvimos visitando La Carnicería de Tomás, un negocio con 30 años de experiencia",
    date: "19 oct 2017",
    dateTime: "2017-10-19",
    platform: "facebook",
    url: "https://www.facebook.com/reel/875260105976385",
    embed:
      "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FRTVCE%2Fvideos%2F875260105976385%2F&show_text=false&autoplay=true",
    thumb: `${BASE}/media/photos/mostrador-2-1280.webp`,
  },
];

export type Review = { author: string; rating: number; text: string; when: string; source: "Google" };

/** Reseñas reales y públicas de Google (texto literal). */
export const reviews: Review[] = [
  {
    author: "E-Va",
    rating: 5,
    text: "La carne está buenísima, y la atención muy buena. (...) Sin duda la mejor carnicería de toda Ceuta.",
    when: "Octubre de 2026",
    source: "Google",
  },
  {
    author: "Carlos Arturo Forero",
    rating: 5,
    text: "Muy buenos productos, gran atención.",
    when: "Julio de 2026",
    source: "Google",
  },
];

/** Frases que Google destaca de las reseñas de la tienda. */
export const reviewHighlights = [
  "La mejor carnicería para los amantes de la carne",
  "Maravillosamente atendido por el carnicero que tienen allí",
  "Precio razonable y buena atención",
];

/**
 * Vídeo de presentación (Instagram). Todavía no está disponible.
 * Cuando lo tengáis: copia el .mp4 optimizado a /public/media/video/presentacion.mp4,
 * pon `src` con esa ruta (o `instagramUrl` con el enlace del post) y la sección se activa sola.
 */
export const presentationVideo: {
  src: string | null;
  poster: string;
  instagramUrl: string | null;
} = {
  src: null,
  poster: `${BASE}/media/photos/interior-1280.webp`,
  instagramUrl: null,
};
