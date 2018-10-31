import * as express from 'express'
import * as bodyParser from 'body-parser'
import { ApolloServer, graphiqlExpress } from 'apollo-server-express'
import { schema } from './schema'
import { authenticationTokenLookup } from '../auth/token-lookup'
import { models } from '../../database/models'

export const router = express.Router()

const server = new ApolloServer({
  schema,
  context: async ({ req, ...rest }) => {
    const { authorization, user } = await authenticationTokenLookup(req)
    return { authorization, user, models }
  }
})

server.applyMiddleware({ app: router, path: '/graphql' })
