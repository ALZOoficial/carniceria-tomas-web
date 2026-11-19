/**
 * CATÁLOGO — sin precios.
 *
 * Cómo editar:
 *  - Añadir un producto: copia un bloque de `products`, cambia `id` (único, sin espacios) y rellena los campos.
 *  - Foto: pon en `image` el nombre de un archivo de /public/media/photos (sin "-640.webp"/"-1280.webp"),
 *    o `null` si todavía no hay foto real.
 *  - Procedencia / proveedor: escribe el dato confirmado; deja `null` si está pendiente.
 *    En la web aparecerá «Pendiente de confirmar». NO inventar.
 *  - `whatsapp`: número distinto al general solo si un producto se consulta en otro número (normalmente vacío).
 */

export type CategoryId = "vacuno" | "cerdo" | "cordero" | "aves" | "elaborados" | "embutidos";

export type Category = {
  id: CategoryId;
  name: string;
  /** Línea corta bajo el nombre. */
  tagline: string;
  /** Foto real de portada, o null para usar el rótulo LED. */
  cover: string | null;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  image: string | null;
  description?: string;
  /** Procedencia confirmada (región, país, granja…). null = pendiente. */
  origin: string | null;
  /** De dónde sale el dato de procedencia, si conviene aclararlo. */
  originNote?: string;
  /** Proveedor o marca confirmada. null = pendiente. */
  supplier: string | null;
  supplierNote?: string;
  /** Etiqueta informativa opcional. No es stock en tiempo real. */
  status?: "temporada" | "encargo";
  /** Número de WhatsApp propio para este producto (opcional). */
  whatsapp?: string;
};

export const categories: Category[] = [
  { id: "vacuno", name: "Vacuno", tagline: "Ternera, cortes nobles y maduraciones", cover: "chuleton" },
  { id: "cerdo", name: "Cerdo", tagline: "Fresco e ibérico", cover: null },
  { id: "cordero", name: "Cordero", tagline: "Canal y despiece", cover: "cordero" },
  { id: "aves", name: "Pollo y aves", tagline: "Pollo, pavo y rellenos", cover: "pollo-relleno" },
  { id: "elaborados", name: "Elaborados de la casa", tagline: "Hechos en la tienda", cover: "pastel-tomate" },
  { id: "embutidos", name: "Embutidos", tagline: "Chorizos de la casa y morcillas", cover: "chorizos" },
];

const HOUSE = "Elaboración propia en la tienda";
const HOUSE_SUPPLIER = "La Carnicería de Tomás";

export const products: Product[] = [
  // ---------------- VACUNO ----------------
  {
    id: "ternera-guadarrama",
    name: "Ternera de la Sierra de Guadarrama",
    category: "vacuno",
    image: "ternera-guadarrama",
    description: "Ternera natural de la sierra. Es la carne que la casa anuncia en el mostrador y en la entrada.",
    origin: "Sierra de Guadarrama y Ávila",
    originNote: "Según el cartel del mostrador",
    supplier: null,
  },
  {
    id: "chuleton",
    name: "Chuletón de vacuno",
    category: "vacuno",
    image: "chuleton",
    description: "Pieza con hueso para brasa o plancha.",
    origin: null,
    supplier: null,
  },
  {
    id: "lomo-alto",
    name: "Lomo alto",
    category: "vacuno",
    image: "lomo-alto",
    description: "Corte con buena infiltración de grasa, para chuletas o asado en pieza.",
    origin: null,
    supplier: null,
  },
  {
    id: "solomillo",
    name: "Solomillo de vacuno",
    category: "vacuno",
    image: "solomillo",
    description: "El corte más tierno de la res.",
    origin: null,
    supplier: null,
  },
  {
    id: "lomo-vacuno",
    name: "Lomo de vacuno",
    category: "vacuno",
    image: "lomo-vacuno",
    description: "En pieza o fileteado al momento.",
    origin: null,
    supplier: null,
  },
  {
    id: "black-angus",
    name: "Black Angus Yerbas Bajas",
    category: "vacuno",
    image: "black-angus",
    description: "Vacuno de raza Black Angus.",
    origin: null,
    supplier: "Yerbas Bajas",
    supplierNote: "Marca visible en el producto",
  },
  {
    id: "wagyu",
    name: "Wagyu",
    category: "vacuno",
    image: "wagyu",
    description: "Raza de origen japonés, de veteado muy marcado.",
    origin: null,
    supplier: null,
  },
  {
    id: "carne-madurada",
    name: "Carnes maduradas (dry aged)",
    category: "vacuno",
    image: null,
    description: "Vacuno madurado en cámara. Pregunta qué piezas hay ahora mismo.",
    origin: null,
    supplier: null,
  },
  {
    id: "osobuco",
    name: "Osobuco",
    category: "vacuno",
    image: "osobuco",
    description: "Jarrete con hueso y tuétano, para guisos lentos.",
    origin: null,
    supplier: null,
  },

  // ---------------- CERDO ----------------
  {
    id: "cerdo-fresco",
    name: "Cerdo fresco",
    category: "cerdo",
    image: null,
    description: "Piezas y despiece de cerdo.",
    origin: null,
    supplier: null,
  },
  {
    id: "cerdo-iberico",
    name: "Cerdo ibérico",
    category: "cerdo",
    image: null,
    description: "Cortes de ibérico. Pregunta cuáles hay esta semana.",
    origin: null,
    supplier: null,
  },

  // ---------------- CORDERO ----------------
  {
    id: "cordero",
    name: "Cordero",
    category: "cordero",
    image: "cordero",
    description: "Canal y despiece para horno, guiso o parrilla.",
    origin: null,
    supplier: null,
  },

  // ---------------- POLLO Y AVES ----------------
  {
    id: "pollo",
    name: "Pollo fresco",
    category: "aves",
    image: null,
    description: "Entero o en piezas.",
    origin: null,
    supplier: null,
  },
  {
    id: "pollo-relleno",
    name: "Pollo relleno",
    category: "aves",
    image: "pollo-relleno",
    description: "Relleno y atado en la casa, listo para el horno.",
    origin: HOUSE,
    supplier: null,
  },
  {
    id: "hamburguesa-pavo",
    name: "Hamburguesas de pavo",
    category: "aves",
    image: null,
    description: "De la casa, como el resto de hamburguesas.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },

  // ---------------- ELABORADOS ----------------
  {
    id: "hamburguesas-casa",
    name: "Hamburguesas con nombre propio",
    category: "elaborados",
    image: "hamburguesas",
    description:
      "«Te la tienes que ganar», «Hay que echarle huevos», «La locura», «Legendario»… Y las clásicas de ternera, cerdo, pavo o espinacas.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "pastel-tomate",
    name: "Pastel de carne «tomate»",
    category: "elaborados",
    image: "pastel-tomate",
    description: "El trampantojo de la casa: parece un tomate y es un pastel de carne.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "roscon-salado",
    name: "Roscón de Reyes salado",
    category: "elaborados",
    image: "roscon-salado",
    description: "Carne picada, jamón, queso, crema de galleta, bacon y hojaldre.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
    status: "temporada",
  },
  {
    id: "hojaldres",
    name: "Hojaldres rellenos",
    category: "elaborados",
    image: "hojaldres",
    description: "Listos para hornear.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "albondigas-pinchitos",
    name: "Albóndigas y pinchitos",
    category: "elaborados",
    image: null,
    description: "Preparados en la casa.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "berenjena-rellena",
    name: "Berenjena rellena",
    category: "elaborados",
    image: null,
    description: "Una de las favoritas de las reseñas.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "platos-cocinados",
    name: "Platos cocinados",
    category: "elaborados",
    image: "cocinado",
    description: "También te lo llevas cocinado: platos listos para la mesa.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "temporada",
    name: "Creaciones de temporada",
    category: "elaborados",
    image: "halloween",
    description: "Halloween, Navidad… Cada fecha trae sus piezas: calabazas, momias, troncos y coronas de carne.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
    status: "temporada",
  },

  // ---------------- EMBUTIDOS ----------------
  {
    id: "chorizos-casa",
    name: "Chorizos de la casa",
    category: "embutidos",
    image: "chorizos",
    description: "Elaboración artesanal.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "chorizo-salchichas",
    name: "Chorizo fresco y salchichas",
    category: "embutidos",
    image: "chorizos-colgados",
    description: "Para la plancha o la barbacoa.",
    origin: HOUSE,
    supplier: HOUSE_SUPPLIER,
  },
  {
    id: "morcilla-burgos",
    name: "Morcilla de Burgos Mágnum",
    category: "embutidos",
    image: "morcilla-burgos",
    origin: "Burgos",
    originNote: "Según la etiqueta",
    supplier: "Ríos",
    supplierNote: "Marca en la etiqueta",
  },
  {
    id: "morcilla-sotillo",
    name: "Morcillas De Sotillo",
    category: "embutidos",
    image: null,
    description: "La tienda es punto de venta autorizado.",
    origin: null,
    supplier: "De Sotillo",
    supplierNote: "Cartel de punto de venta autorizado en la tienda",
  },
  {
    id: "relleno-seron",
    name: "Relleno de huevo de Serón",
    category: "embutidos",
    image: "relleno-seron",
    description: "Embutido tradicional. Sin gluten, según su etiqueta.",
    origin: "Serón (Almería)",
    originNote: "Según la etiqueta",
    supplier: "Peña Cruz",
    supplierNote: "Marca en la etiqueta",
  },
];

export const productsByCategory = (id: CategoryId) => products.filter((p) => p.category === id);
export const photo = (key: string, w: 640 | 1280 = 640) => `/media/photos/${key}-${w}.webp`;
export const photoSet = (key: string) => `${photo(key, 640)} 640w, ${photo(key, 1280)} 1280w`;
