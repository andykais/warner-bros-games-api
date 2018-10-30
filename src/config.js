export const config = {
  mode: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  database: {
    host: 'mongodb',
    database: 'test'
  },
  gameSecrets: {
    byteLength: 64
  },
  tokens: {
    secret: process.env.SECRET || 'unsafe-dev-secret',
    userExpiresIn: 6 * 60 * 60, // 6 hours
    developerExpiresIn: 24 * 60 * 60 // 1 day
  }
}
