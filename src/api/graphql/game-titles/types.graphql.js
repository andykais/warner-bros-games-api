import * as mongoose from 'mongoose'
import gql from 'graphql-tag'
import { gameTitles } from '../../../game-titles'

const gameTitleEnums = gameTitles.map(({ title }) => title).join('\n')

const getStatMutations = ({ title, schema }) => {
  const statsSchema = new mongoose.Schema(schema.statsMap)
  const statInputsArray = []
  const addStatOptionsArray = []
  for (const key of Object.keys(schema.statsMap)) {
    const keyInputType = `${title}_${key}_Input`
    const valueType = statsSchema.paths[key].instance
    statInputsArray.push(`input  ${keyInputType}{ value: ${valueType}! }`)
    addStatOptionsArray.push(`${key}: ${keyInputType}`)
  }
  return {
    statInputs: statInputsArray.join('\n'),
    addStatOptions: addStatOptionsArray.join('\n')
  }
}
const getStatInputOptions = ({ schema, documentation }) => {
  const statsSchema = new mongoose.Schema(schema.statsMap)
  const statsInputOptions = Object.keys(schema.statsMap).map(key => {
    const valueType = statsSchema.paths[key].instance
    const { description } = documentation.statsMap[key]
    return `"${description}"
    ${key}: ${valueType}`
  })
  return statsInputOptions.join('\n')
}

const getAchievementEnums = ({ schema, documentation }) => {
  const achievementEnums = Object.keys(schema.achievementsMap).map(key => {
    const { description } = documentation.achievementsMap[key]
    return `"${description}"
${key}`
  })
  return achievementEnums.join('\n')
}

// TODO export query type, mutation type, resolvers
// TODO find a way to use interfaces instead of inline mutations
const gameTitleMutationInputs = gameTitles
  .map(game => {
    const { title, schema, graphqlTypeNames } = game
    const {
      mutationType,
      statInputType,
      achievementEnumType,
      gameUserMutationType,
      userMatchMutationType,
      queryType
    } = graphqlTypeNames
    const statInputOptions = getStatInputOptions(game)
    const achievementEnums = getAchievementEnums(game)

    // interpolating mongoose schema types with graphql types works fine
    return `
enum ${achievementEnumType} {
  ${achievementEnums}
}
type ${userMatchMutationType} {
  "setting stats here will not affect the user's global stats, only their stats within the match"
  setStat(${statInputOptions}): [Stat]!
}
type ${gameUserMutationType} {
  "Returns all the user's stats"
  setStat(${statInputOptions}): [Stat]!
  "Returns all the user's achievements. Achievements cannot be undone"
  addAchievement(achievement: ${achievementEnumType}!): [Achievement]!
  match(id: ID): ${userMatchMutationType}
}

type ${mutationType} {
  user(id: ID): ${gameUserMutationType}
  match(id: ID): MatchMutations
  createMatch(players: [MatchPlayerInput]!): Match!
  deleteMatch(id: ID): Match
}
extend type GameMutation {
  ${title}: ${mutationType}!
}

type ${queryType} {
  matchConnection(filters: [MatchFilterInput]): [Match]!
}

extend type GameQuery {
  ${title}: ${queryType}
}
`
  })
  .join('\n')

export default gql`
enum GameTitleEnum {
  ${gameTitleEnums}
}

# mutation types
type Stat {
  key: String!
  name: String!
  description: String!
  value: String!
}
type Achievement {
  key: String!
  name: String!
  description: String!
  value: Boolean!
}
input MatchPlayerInput {
  team: String
  userId: ID
}
"a limited version of User"
type PlayerUserInfo {
  id: ID!
  username: String!
}
type Player {
  userInfo: PlayerUserInfo!
  team: String
  stats: [Stat]!
}
enum MatchStatusEnum {
  WAITING_FOR_PLAYERS
  IN_PROGRESS
  COMPLETE
}
type Match {
  id: ID!
  status: MatchStatusEnum
  players: [Player]!
}
type MatchMutations {
  update(status: MatchStatusEnum): Match!
  assignPlayers(players: [MatchPlayerInput]): [Player]!
  removePlayers(playerIds: [ID]): [Player]!
}

${gameTitleMutationInputs}

type GameMutation {
  _empty: String
}

enum MatchFilterFieldEnum {
  id
}
input MatchFilterInput {
  field: MatchFilterFieldEnum!
  equals: String
}

extend type Mutation {
  gameTitle: GameMutation
}

type GameQuery {
  _empty: String
}

extend type Query {
  gameTitle: GameQuery
}

`
