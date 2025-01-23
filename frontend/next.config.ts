import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/tasks',
        destination: '/tasks/create',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
