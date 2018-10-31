import * as express from 'express'
import { router as graphqlRouter } from './graphql'
import { router as authRouter } from './auth'

export class Api {
  constructor() {
    this.express = express()
    this.middleware()
    this.routes()
  }

  middleware() {}

  routes() {
    this.express.use('/', graphqlRouter)
    this.express.use('/auth', authRouter)
  }
}
