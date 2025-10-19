import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slawneavswmxfjkbvtpz.supabase.co',
        port: '',
        pathname: '/test_bk/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
