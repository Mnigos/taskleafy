import { fileURLToPath } from 'node:url'

import createJiti from 'jiti'
const jiti = createJiti(fileURLToPath(import.meta.url))

jiti('./app/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  serverExternalPackages: ['pg'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
