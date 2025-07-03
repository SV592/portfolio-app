import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "theprogrammersgazette.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
