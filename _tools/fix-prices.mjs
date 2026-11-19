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

// 2) Vitrina de ternera: difuminar las etiquetas de precio, dejando nítido el cartel de procedencia.
{
  const src = path.join(SRC, "ig92.jpg");
  const { width, height } = await sharp(src).metadata();
  const sx = width / 640, sy = height / 360; // coordenadas medidas sobre la versión 640x360
  const boxes = [
    [0, 0, 52, 30], [84, 6, 136, 40], [182, 0, 240, 32], [304, 0, 352, 34], [416, 0, 466, 28],
    [0, 70, 26, 115], [96, 80, 165, 122], [228, 86, 296, 128], [388, 78, 456, 114], [512, 90, 576, 128],
  ];
  const overlays = [];
  for (const [x0, y0, x1, y1] of boxes) {
    const left = Math.max(0, Math.round(x0 * sx)), top = Math.max(0, Math.round(y0 * sy));
    const w = Math.min(width - left, Math.round((x1 - x0) * sx)), h = Math.min(height - top, Math.round((y1 - y0) * sy));
    const patch = await sharp(src).extract({ left, top, width: w, height: h }).blur(Math.max(6, w / 6)).toBuffer();
    overlays.push({ input: patch, left, top });
  }
  await save(await sharp(src).composite(overlays).toBuffer(), "ternera-guadarrama");
}
console.log("ok");
