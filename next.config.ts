import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statico per deploy su Aruba Hosting Linux: produce out/.
  // Caricamento via FTP/SFTP nella webroot del piano.
  output: "export",

  // L'optimization Image di Next richiede un server Node a runtime: in
  // static export non è disponibile. Si serve la sorgente as-is.
  images: { unoptimized: true },

  // Pretty URL su Apache: ogni route diventa <route>/index.html.
  trailingSlash: true,
};

export default nextConfig;
