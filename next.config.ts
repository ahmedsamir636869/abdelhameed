import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 3600,
      static: 86400,
    },
  },
};

export default nextConfig;

