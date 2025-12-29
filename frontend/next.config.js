/** @type {import('next').NextConfig} */
const BASE_PATH = '/career-roadmap-tool';
const nextConfig = {
  reactStrictMode: true,
  basePath: BASE_PATH,
  compiler: {
    styledComponents: true,
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    // Expose basePath so client/utils (non-React code) can build correct URLs for public assets
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  // Image optimization configuration
  images: {
    domains: ['cdn.brandfetch.io', 'img.logo.dev', 'logo.clearbit.com'], // For company and skill logos
    unoptimized: false,
  },
  // API rewrites for career-profile-tool backend (CRT APIs)
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    return [
      {
        source: '/career-profile-tool/api/:path*',
        destination: `${apiBaseUrl}/career-profile-tool/api/:path*`
      }
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
