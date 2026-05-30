import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server runtime abilitato per Vercel (CMS Decap richiede runtime server).
  // Per deploy statico su Aruba: riabilitare output: "export" + images.unoptimized + trailingSlash.

  // Image optimization disabilitato per staticexport compatibility (riabilitare se server runtime).
  // images: { unoptimized: true },

  // Pretty URL: disabilitato su server runtime (Vercel usa /.next/static/).
  // trailingSlash: true,
};

export default nextConfig;
