import type { Args } from '@payloadcms/db-postgres/types'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'

const { DATABASE_URI } = process.env

const dbAdapter = () => {
  const config = {
    pool: {
      connectionString: DATABASE_URI ?? '',
    },
  } satisfies Args

  if (DATABASE_URI) {
    return postgresAdapter(config)
  }
  // TODO: This will never work. FIX THIS
  return mongooseAdapter({
    url: DATABASE_URI ?? '',
  })
}

export { dbAdapter }
