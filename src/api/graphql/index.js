import * as express from 'express'
import * as bodyParser from 'body-parser'
import { ApolloServer, graphiqlExpress } from 'apollo-server-express'
import { schema } from './schema'
import { authenticationTokenLookup } from '../auth/token-lookup'

export const router = express.Router()

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const { authorization, user } = authenticationTokenLookup(req)
    return { authorization, user }
  }
})

server.applyMiddleware({ app: router, path: '/graphql' })
