import * as mongoose from 'mongoose'
import gql from 'graphql-tag'
import { tupleToObject } from '../util/array'
import * as smashBros from './smash-bros'
import * as chess from './chess'

const games = [smashBros, chess]

export const gameTitles = games.map(game => ({
  ...game,
  graphqlTypeNames: {
    statInputType: `${game.title}StatInput`,
    achievementEnumType: `${game.title}AchievementEnum`,
    mutationType: `${game.title}Mutation`,
    gameUserMutationType: `${game.title}UserMutation`,
    userMatchMutationType: `${game.title}UserMatchMutation`,

    queryType: `${game.title}Query`
  }
}))

export const gameTitleMap = gameTitles
  .map(game => [game.title, game])
  .reduce(tupleToObject, {})
