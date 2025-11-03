import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/(.*)",
        destination: "https://decouvrirlepaysbasque.fr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
