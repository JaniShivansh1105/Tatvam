import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfjs-dist"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // Remove any conflicting turbopack aliases that might cause crashes
  turbopack: {}
};

export default nextConfig;
