import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/carpentry",
        destination: "/maintenance?tab=carpentry",
        permanent: true,
      },
      {
        source: "/plumbing",
        destination: "/maintenance?tab=plumbing",
        permanent: true,
      },
      {
        source: "/dryer",
        destination: "/washing?tab=dryer",
        permanent: true,
      },
      {
        source: "/bathroom",
        destination: "/room?tab=bathroom",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
