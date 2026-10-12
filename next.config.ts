import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statico: output nella cartella out/, pubblicato su Aruba via FTPS (vedi .github/workflows/deploy.yml).
  // Il CMS in public/admin/ viene copiato as-is in out/admin/ e servito a /admin/.
  output: "export",

  // Image optimization richiede server Node: in static export non disponibile.
  images: { unoptimized: true },

  // Pretty URL: ogni route diventa <route>/index.html (Apache/Aruba friendly).
  trailingSlash: true,
};

export default nextConfig;
