/**
 * Prefijo de ruta. Vacío en Hostinger (web en la raíz del dominio);
 * "/carniceria-tomas-web" en GitHub Pages (lo pone el workflow de despliegue).
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
