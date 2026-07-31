/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // No basePath: the site is served from the root of the custom domain
  // (viskar.org), not from the /Viskar project path on github.io.
}

export default nextConfig
