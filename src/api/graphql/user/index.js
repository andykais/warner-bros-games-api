import { resolvers as rootResolvers } from './resolvers'
import rootTypeDefs from './types.graphql'

export const typeDefs = [rootTypeDefs]
export const resolvers = [...rootResolvers]
