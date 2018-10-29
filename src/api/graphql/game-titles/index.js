import rootTypeDefs from './types.graphql'
import { resolvers as rootResolvers } from './resolvers'
// import {
// typeDefs as titleTypeDefs,
// resolvers as titleResolvers
// } from './game-titles'

export const typeDefs = [rootTypeDefs]
export const resolvers = [...rootResolvers]
