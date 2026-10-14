import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Day 30 — static export for Firebase Hosting (fully client-side app). */
  output: "export",
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
