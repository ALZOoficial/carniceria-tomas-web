# La Carnicería de Tomás — instrucciones del proyecto

## Publicación automática (indicado por el usuario)

Web en vivo: https://alzooficial.github.io/carniceria-tomas-web/
Repositorio: https://github.com/ALZOoficial/carniceria-tomas-web (privado)

- **Después de cada cambio en este proyecto, haz commit y push a `main` sin preguntar.** El usuario quiere que todo lo que se cambie aquí llegue solo a GitHub.
- Cada push a `main` lanza `.github/workflows/deploy.yml`, que compila `site/` y lo publica en GitHub Pages en 1–2 minutos.
- Antes de subir: `npm run build` dentro de `site/` tiene que terminar sin errores. Si falla, arréglalo antes de hacer push.
- Tras el push, comprueba que el workflow terminó bien (`gh run list --limit 1`) y da al usuario el enlace de la web en vivo.
- Mensajes de commit en español, describiendo el cambio. Termínalos con:
  `Co-Authored-By: Claude <noreply@anthropic.com>`

## Rutas

- Todas las rutas a `/media/...` en el código llevan `BASE` (`site/src/lib/base.ts`). En Pages la web vive en `/carniceria-tomas-web`; en Hostinger, en la raíz.
- Datos editables: `site/src/data/` (catálogo, negocio, prensa/reseñas). Lista de datos pendientes: `README.md`.
- No inventar procedencias, proveedores, precios, horarios ni reseñas.
