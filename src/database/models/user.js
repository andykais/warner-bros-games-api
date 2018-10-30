import * as mongoose from 'mongoose'
import { gameTitles, gameTitlesMap } from '../../game-titles'
import { tupleToObject } from '../../util/array'
import { UserGameModel } from './user-game-title'
import { models } from './'

const makeTitleRegex = /\..*/

export const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // NOTE: passwords would not be stored in plaintext in a true secure system
  password: {
    type: String,
    required: true
  }
})

schema.methods = {
  gameTitles: async function(filters = []) {
    const finder = UserGameModel.find({})
    const gameTitles = await filters
      .map(({ field, equals }) => ({
        field: field === 'id' ? '_id' : field,
        equals
      }))
      .reduce(
        (finder, { field, equals }) => finder.where(field).equals(equals),
        finder
      )
    return gameTitles
    // return gameTitles.map(game => game.toJSON())
  },

  addGameTitle: async function(title) {
    // unique schema paths on discriminators do not prevent duplicate entries
    // https://github.com/Automattic/mongoose/issues/6347
    // const existingUserGame = await models.userGameTitles[title].findOne({
    // title,
    // user: this.id
    // })
    // if (existingUserGame)
    // throw new Error(`User already has game title ${title} in their library.`)

    const userGame = new models.userGameTitles[title]({
      user: this.id,
      statsMap: {},
      achievementsMap: {}
    })
    return userGame.save()
  },

  removeGameTitle: function(title) {
    return models.userGameTitles[title].deleteOne({ user: this.id })
  }
}

export const model = mongoose.model('User', schema)
