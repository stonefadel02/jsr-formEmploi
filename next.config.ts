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
  },images: {
    
  },
   experimental: {
    // Augmente le timeout pour les API routes
    proxyTimeout: 600000, // 10 minutes
    
  },
  

};

export default nextConfig;