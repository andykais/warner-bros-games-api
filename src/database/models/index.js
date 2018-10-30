import * as mongoose from 'mongoose'
import { model as userModel } from './user'
import { models as userGameTitleModels } from './user-game-title'
import { models as matchModels } from './game-match'

export const models = {
  userGameTitles: userGameTitleModels,
  gameMatches: matchModels,
  User: userModel
}
