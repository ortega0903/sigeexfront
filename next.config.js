/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Asegura que Turbopack use la raíz correcta
  experimental: {
    // Turbopack está en beta en Next.js 16
    turbo: {
      root: process.cwd(),
    }
  },
  // Solo incluye outputFileTracingRoot si estás en Vercel
  ...(process.env.VERCEL && {
    outputFileTracingRoot: process.cwd(),
  }),
}

module.exports = nextConfig