import type { CollectionConfig } from 'payload'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const postsCollection: CollectionConfig = {
  slug: 'posts',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      unique: true,
    },
  ],
}

const mediaCollection: CollectionConfig = {
  slug: 'media',
  fields: [],
  upload: {
    staticDir: path.resolve(dirname, 'media'),
  },
}

const payloadCollections = [postsCollection, mediaCollection]

export { payloadCollections }
