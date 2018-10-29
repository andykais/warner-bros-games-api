import gql from 'graphql-tag'
import { gameTitles } from '../game-titles/game-schemas'
const gameTitleEnums = gameTitles.map(({ title }) => title).join('\n')

export default gql`
enum GameTitleEnum {
  ${gameTitleEnums}
}
type UserGameTitle {
  title: String!
  stats: [Stat]!
  achievements: [Achievement]!
}

type User {
  id: ID!
  username: String!
  email: String!
  gameTitles(titleEquals: GameTitleEnum): UserGameTitle
}

type AuthPayload {
  token: String!
  user: User!
}

extend type Mutation {
  createUser(username: String! email: String!, password: String!): AuthPayload!
  updateUser(id: ID!, username: String, email: String, password: String, assignGame: GameTitleEnum): User
  deleteUser(id: ID!): User
}

extend type Query {
  user(id: ID!): User
}
`
