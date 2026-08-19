import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 3600,
      static: 86400,
    },
  },
};

export default nextConfig;

