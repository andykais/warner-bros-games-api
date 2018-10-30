import rootTypeDefs from './types.graphql'
import { resolvers as rootResolvers } from './resolvers'

export const typeDefs = [rootTypeDefs]
export const resolvers = [...rootResolvers]
