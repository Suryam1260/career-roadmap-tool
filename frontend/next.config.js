/** @type {import('next').NextConfig} */
const BASE_PATH = '/career-roadmap-tool';
const nextConfig = {
  reactStrictMode: true,
  basePath: BASE_PATH,
  // Enable standalone output for Docker deployment
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  // Environment variables
  env: {
    // In production (Docker), API is on same origin via nginx proxy, so no base URL needed
    // In development, point to local backend
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8002'),
    // Expose basePath so client/utils (non-React code) can build correct URLs for public assets
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  // Image optimization configuration
  images: {
    domains: ['cdn.brandfetch.io', 'img.logo.dev', 'logo.clearbit.com'], // For company and skill logos
    unoptimized: false,
  },
  // API rewrites for local development (proxy to Python backend)
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002';
    return [
      {
        source: '/career-roadmap-tool/api/:path*',
        destination: `${backendUrl}/career-roadmap-tool/api/:path*`,
      },
    ];
  },
  // Webpack configuration for SVG imports
  webpack(config) {
    // Handle SVG files as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
