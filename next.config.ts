import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true, // Désactive ESLint pendant le build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorer toutes les erreurs de TypeScript pendant le build
  },
};

export default nextConfig;