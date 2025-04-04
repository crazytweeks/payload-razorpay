// import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'

const _POSTGRES_URL = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? null

const dbAdapter = () => {
  if (!_POSTGRES_URL) {
    throw new Error('DB URI NOT DEFINED IN ENV!')
  }

  return postgresAdapter({
    pool: {
      connectionString: _POSTGRES_URL,
    },
  })

  // if (adaptor === 'mongodb') {
  //   return mongooseAdapter({
  //     url: _POSTGRES_URL,
  //   })
  // }

  // throw new Error('DB URI IS INVALID!!!')
}

export { dbAdapter }
