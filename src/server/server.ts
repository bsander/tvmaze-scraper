import * as DotEnv from 'dotenv'
DotEnv.config()

import Hapi from 'hapi'
import { routes as showRoutes } from './shows'

const run = async () => {
  const server = new Hapi.Server({
    host: '0.0.0.0',
    port: '12000',
  })

  server.route(showRoutes)

  await server.start()
  console.info(`Try it out at ${server.info.uri}/shows/1`)
}

run()
