import { fileURLToPath } from 'node:url'

import webpack from 'webpack'
import createJiti from 'jiti'
const jiti = createJiti(fileURLToPath(import.meta.url))

jiti('./app/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
    )

    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          net: false,
          dns: false,
          tls: false,
          fs: false,
          request: false,
        },
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config
  },
}

export default nextConfig
