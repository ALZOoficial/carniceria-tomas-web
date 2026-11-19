# La Carnicería de Tomás — web

Web estática (Next.js 15 + TypeScript + Tailwind 4 + GSAP) para **La Carnicería de Tomás**, C/ Real, 40 · Ceuta.

```
site/        proyecto Next.js (código de la web)
_tools/      scripts de preparación de medios (ffmpeg + sharp)
_gen/        material de generación del vídeo de portada (Higgsfield)
```

## Publicar en Hostinger

```powershell
cd site
npm install
npm run build
```

Sube **el contenido** de `site/out/` (no la carpeta) a `public_html` por el Administrador de archivos o FTP. Incluye un `.htaccess` con caché y compresión.

Antes de publicar, cambia `SITE_URL` en `site/src/data/business.ts` por el dominio real.

## Editar contenido (sin tocar el diseño)

| Qué | Dónde |
|---|---|
| Productos, procedencias, proveedores | `site/src/data/catalog.ts` |
| Teléfono, WhatsApp, horario, dirección, valoración | `site/src/data/business.ts` |
| Prensa, vídeos, reseñas, vídeo de presentación | `site/src/data/content.ts` |
| Fotos | `site/public/media/photos/<nombre>-640.webp` y `-1280.webp` |

En cada producto, `origin` (procedencia) y `supplier` (proveedor) a `null` se muestran como «Pendiente de confirmar». Para añadir una foto nueva: añade la entrada en `_tools/build-assets.mjs` y ejecuta `node build-assets.mjs` dentro de `_tools/`.

**Vídeo de presentación:** cuando esté disponible, cópialo optimizado a `site/public/media/video/presentacion.mp4` y pon `src: "/media/video/presentacion.mp4"` en `presentationVideo` (`content.ts`). También vale un enlace de Instagram en `instagramUrl`.

## Portada con scroll (Higgsfield)

La tienda real aparece a oscuras y, al hacer scroll, se enciende primero el rótulo, después los focos y por último el mostrador.

- **Modelo:** Kling 4.0 (image-to-video con fotograma inicial y final), 6 s, 1080p, sin audio. Coste: 19,5 créditos.
- **Fotogramas:** el final es la foto real del interior (Google Business) y el inicial es esa misma foto oscurecida, con el mismo encuadre.
- **Modelos descartados:**
  - Seedance 2.5 a 1080p cuesta 96 créditos, con audio o sin él.
  - Kling 3.0 Pro (10,5 créditos) encendía el local de golpe.
- **Alternativa ligera:** con movimiento reducido o ahorro de datos se muestra una imagen fija de la tienda encendida.

## Datos pendientes de confirmar con Tomás

1. **Procedencia y proveedor** de los productos que aparecen como «Pendiente de confirmar»: chuletón, lomo alto, solomillo, lomo de vacuno, wagyu, carnes maduradas, osobuco, cerdo fresco, cerdo ibérico, cordero y pollo. También el proveedor de la ternera de Guadarrama y la procedencia del Black Angus Yerbas Bajas y de las morcillas De Sotillo.
2. **Fotos reales** que faltan: cerdo, carnes maduradas, pollo fresco, hamburguesas de pavo, albóndigas y pinchitos, berenjena rellena y morcillas De Sotillo.
3. **WhatsApp:** confirmar que el 956 51 52 57 recibe WhatsApp (se indicó que sí).
4. **Productos halal:** El Faro (2021) dice que venden productos «100 % halal». No se ha puesto en la web hasta confirmar que sigue vigente.
5. **Reparto a domicilio:** en 2021 no había. Algunas fichas recientes lo mencionan, pero no está confirmado y no aparece en la web.
6. **Hora de apertura:** Google indica 10:00 y El Pueblo (2023) habla de las 9:30. La web usa el horario de Google.
7. **Dominio** definitivo (ver `SITE_URL`).
8. **Aviso legal y política de privacidad** (LSSI/RGPD): hacen falta el titular, el NIF y el correo de contacto. No se han inventado.
9. **Vídeo de presentación de Instagram** (sección preparada, ahora muestra «Estreno muy pronto»).
10. **Más reseñas con nombre:** Google solo muestra 3 sin iniciar sesión. Si queréis más, se pueden copiar desde el perfil.

## Fuentes de los datos

- Google Business: dirección, teléfono, horario, valoración 4,4 con 26 reseñas y las reseñas citadas.
- El Pueblo de Ceuta, 21/10/2023: nombre de Tomás, 35 años de oficio, la música de primera hora, los elaborados y la carne de Madrid.
- El Faro de Ceuta, 27/04/2021: oficio desde los 16 años, siete carnicerías en Madrid y carnes maduradas.
- Fachada y fotos de Instagram @lacarniceriadetomas: carteles, etiquetas y productos.
