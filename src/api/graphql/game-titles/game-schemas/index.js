import * as mongoose from 'mongoose'
import gql from 'graphql-tag'
import * as smashBros from './smash-bros'

const games = [smashBros]

export const gameTitles = games.map(game => ({
  ...game,
  graphqlTypeNames: {
    statInputType: `${game.title}StatInput`,
    achievementEnumType: `${game.title}AchievementEnum`,
    mutationType: `${game.title}Mutation`,
    userGameMutationType: `${game.title}UserMutation`,
    userMatchMutationType: `${game.title}UserMatchMutation`
  }
}))

// const getStatMutations = ({ title, schema }) => {
// const statsSchema = new mongoose.Schema(schema.stats)
// const statInputsArray = []
// const addStatOptionsArray = []
// for (const key of Object.keys(smashBros.schema.stats)) {
// const keyInputType = `${title}_${key}_Input`
// const valueType = statsSchema.paths[key].instance
// statInputsArray.push(`input  ${keyInputType}{ value: ${valueType}! }`)
// addStatOptionsArray.push(`${key}: ${keyInputType}`)
// }
// return {
// statInputs: statInputsArray.join('\n'),
// addStatOptions: addStatOptionsArray.join('\n')
// }
// }

// // TODO export query type, mutation type, resolvers
// // TODO find a way to use interfaces instead of inline mutations
// export const typeDefs = titles.map(game => {
// const { title } = game
// const mutationType = `${title}Mutation`
// const statInputType = `${title}StatInput`
// const { statInputs, addStatOptions } = getStatMutations(game)

// // interpolating mongoose schema types with graphql types works fine
// return gql`
// ${statInputs}

// type ${mutationType} {
// addStat(${addStatOptions}): Boolean
// }

// extend type GameMutation {
// ${title}: ${mutationType}
// }
// `
// })

// export const resolvers = titles.map(({ title }) => {
// const mutationType = `${title}Mutation`
// return {
// [mutationType]: {
// addStat: (title, args, ctx) => {
// console.log('ere!!')
// console.log(ctx)
// return true
// }
// },
// GameMutation: {
// [title]: () => title
// }
// }
// })
