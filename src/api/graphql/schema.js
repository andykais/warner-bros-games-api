import { GraphQLSchema, buildSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'

import rootTypeDefs from './types.graphql'
import { resolvers as rootResolvers } from './resolvers'
import {
  typeDefs as gameTypeDefs,
  resolvers as gameResolvers
} from './game-titles'
import { typeDefs as userTypeDefs, resolvers as userResolvers } from './user'

export const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, ...userTypeDefs, ...gameTypeDefs],
  resolvers: [rootResolvers, ...userResolvers, ...gameResolvers]
})
