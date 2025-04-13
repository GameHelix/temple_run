import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable Node.js runtime for middleware
    nodeMiddleware: true
  }
};

export default nextConfig;