import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slawneavswmxfjkbvtpz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
