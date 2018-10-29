import * as mongoose from 'mongoose'
import gql from 'graphql-tag'
import { gameTitles } from './game-schemas'

const getStatMutations = ({ title, schema }) => {
  const statsSchema = new mongoose.Schema(schema.stats)
  const statInputsArray = []
  const addStatOptionsArray = []
  for (const key of Object.keys(schema.stats)) {
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
  const statsSchema = new mongoose.Schema(schema.stats)
  const statsInputOptions = Object.keys(schema.stats).map(key => {
    const valueType = statsSchema.paths[key].instance
    const { description } = documentation.stats[key]
    return `"${description}"
    ${key}: ${valueType}`
  })
  return statsInputOptions.join('\n')
}

const getAchievementEnums = ({ schema, documentation }) => {
  const achievementEnums = Object.keys(schema.achievements).map(key => {
    const { description } = documentation.achievements[key]
    return `"${description}"
${key}`
  })
  return achievementEnums.join('\n')
}

// TODO export query type, mutation type, resolvers
// TODO find a way to use interfaces instead of inline mutations
const gameTitleMutationInputs = gameTitles
  .map(game => {
    const { title, schema } = game
    const {
      mutationType,
      statInputType,
      achievementEnumType,
      gameUserMutationType,
      userMatchMutationType
    } = game.graphqlTypeNames
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
    startMatch(players: [PlayerInput]!): Match!
    endMatch(id: ID): Match!
  }`
  })
  .join('\n')

const gameTitleMutations = gameTitles
  .map(
    ({ title, graphqlTypeNames }) =>
      `${title}: ${graphqlTypeNames.mutationType}`
  )
  .join('\n')

export default gql`
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
input PlayerInput {
  id: ID!
  team: String
}

type Player {
  # user: User
  team: String
}
type Match {
  id: ID!
  players: [Player]!
}

${gameTitleMutationInputs}

type GameMutation {
  ${gameTitleMutations}
  _empty: String
}

extend type Mutation {
  gameTitle: GameMutation
}

`
