import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'

const _DATABASE_URI = process.env.DATABASE_URI ?? null

const dbAdapter = () => {
  if (!_DATABASE_URI) {
    throw new Error('DB URI NOT DEFINED IN ENV!')
  }

  const adaptor = _DATABASE_URI?.startsWith('postgresql')
    ? 'postgres'
    : _DATABASE_URI.startsWith('mongo')
      ? 'mongodb'
      : undefined

  if (adaptor === 'postgres') {
    return postgresAdapter({
      pool: {
        connectionString: _DATABASE_URI,
      },
    })
  }

  if (adaptor === 'mongodb') {
    return mongooseAdapter({
      url: _DATABASE_URI,
    })
  }

  throw new Error('DB URI IS INVALID!!!')
}

export { dbAdapter }
