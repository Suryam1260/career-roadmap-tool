/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
  // Image optimization configuration
  images: {
    domains: ['cdn.brandfetch.io', 'img.logo.dev', 'logo.clearbit.com'], // For company and skill logos
    unoptimized: false,
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
