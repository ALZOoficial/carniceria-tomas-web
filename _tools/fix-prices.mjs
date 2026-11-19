// Quita precios visibles de las fotos usadas en fichas de producto (el catálogo no muestra precios).
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve(import.meta.dirname, "../../../edits/carniceria-tomas-reel/sources/ig");
const OUT = path.resolve(import.meta.dirname, "../site/public/media/photos");

async function save(buf, name) {
  for (const w of [640, 1280]) {
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 700 ? 74 : 70 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
}

// 1) Carta de hamburguesas: recorte por encima del precio de la última tarjeta.
await save(await sharp(path.join(SRC, "ig27.jpg")).extract({ left: 380, top: 20, width: 860, height: 1150 }).toBuffer(), "hamburguesas");

// 2) Vitrina de ternera de Guadarrama: foto original, sin difuminar las etiquetas (decisión del cliente).
await save(await sharp(path.join(SRC, "ig92.jpg")).toBuffer(), "ternera-guadarrama");
console.log("ok");
