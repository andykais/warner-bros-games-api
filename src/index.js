import 'source-map-support/register'
import http from 'http'
import { promisify } from 'util'
import { Api } from './api'
import { config } from './config'
import { initSecrets } from './api/auth/secrets'
import { initDatabaseConnection } from './database'

const initResources = async () => {
  const app = new Api()
  await initSecrets()
  await initDatabaseConnection()
  const server = http.createServer(app.express)
  return server
}

const init = async ({ ip, port }) => {
  const server = await initResources()
  await promisify(cb => server.listen(port, ip, cb))()
  console.log(`Express server listening on ${config.port}`)
}

init(config)
