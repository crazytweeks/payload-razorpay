import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { payloadCollections } from 'helpers/collections.js'
import { dbAdapter } from 'helpers/dbAdapter.js'
import { payloadPlugins } from 'helpers/plugins.js'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dbAdapter } from 'utils/dbAdapter.js'

import { devUser } from './helpers/credentials.js'
import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

export default buildConfig({
  admin: {
    autoLogin: devUser,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: payloadCollections,

  db: dbAdapter(),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  onInit: async (payload) => {
    await seed(payload)
  },
  plugins: payloadPlugins,
  secret: process.env.PAYLOAD_SECRET || 'razorpay-payload-secret_key',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
