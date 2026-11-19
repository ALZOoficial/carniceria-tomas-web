import type { NextConfig } from "next";

// Static export: `npm run build` writes the whole site to /out, ready to upload to Hostinger (public_html).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
