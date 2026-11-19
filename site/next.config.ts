import type { NextConfig } from "next";

// Static export: `npm run build` writes the whole site to /out, ready to upload to Hostinger (public_html).
// En GitHub Pages la web vive en /carniceria-tomas-web (NEXT_PUBLIC_BASE_PATH lo pone el workflow).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
