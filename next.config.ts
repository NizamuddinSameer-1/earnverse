import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep static generation on a single worker: this app has ~16 routes, so
    // demanding 25 pages per worker prevents worker forks that exhaust the
    // Windows Node heap (ERR-002).
    staticGenerationMinPagesPerWorker: 25,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 1,
  },
};

export default nextConfig;
