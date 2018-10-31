import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import rootSchema from './types.graphql'
import { resolvers as gameResolvers } from './game-titles'

export const resolvers = {
  Number: new GraphQLScalarType({
    name: 'Number',
    description:
      'custom scalar type Number. Can be either Float or Int, mongodb does not distinguish',
    parseValue(value) {
      return value // value from the client
    },
    serialize(value) {
      return value // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value) // ast value is always in string format
      } else if (ast.kind === Kind.FLOAT) {
        return parseFloat(ast.value)
      }
      throw new TypeError()
    }
  }),
  Query: {},
  Mutation: {}
}
