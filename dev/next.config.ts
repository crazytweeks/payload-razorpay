import type { NextConfig } from 'next/types.js'

import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const serverUrl = 'http://localhost:4000'
const ADDITIONAL_ALLOWED_URLS = [
  'https://api.microlink.io',
  'https://ui.aceternity.com',
  'https://assets.dub.co',
  'https://images.unsplash.com',
  'https://avatars.githubusercontent.com',
  'https://lh3.googleusercontent.com',
]

const getProtocol = (url: URL) => {
  const p = url.protocol.replace(':', '')
  const allowedProtocols = ['http', 'https']

  if (allowedProtocols.includes(p)) {
    return p as 'http' | 'https'
  }

  return 'http'
}

type RemotePattern = NonNullable<NextConfig['images']>['remotePatterns']

const getAllowedImageHostURLs = (): RemotePattern => {
  const allowedImageHostURLs = [serverUrl, ...ADDITIONAL_ALLOWED_URLS]
  const duplicateFilteredAllowedImageHostURLs = allowedImageHostURLs.filter(
    (item, index, self) => self.indexOf(item) === index,
  )

  return duplicateFilteredAllowedImageHostURLs
    .map((item) => {
      try {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: getProtocol(url),
        }
      } catch (error) {
        return null
      }
    })
    .filter((item) => item !== null)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: getAllowedImageHostURLs(),
  },
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  // transpilePackages: ['../src'],
}

export default withPayload(nextConfig)
