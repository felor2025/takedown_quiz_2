/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration for Netlify
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable server-side features for static export
  distDir: 'out',
}

module.exports = nextConfig
