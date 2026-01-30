import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(), // Fixes workspace root detection
  },
};

export default nextConfig;
