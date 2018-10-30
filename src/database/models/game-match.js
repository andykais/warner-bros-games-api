import * as mongoose from 'mongoose'
import { gameTitles, gameTitleMap } from '../../game-titles'
import { tupleToObject } from '../../util/array'
import { model as User } from './user'

const options = { discriminatorKey: 'kind' }

const gameMatchSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['WAITING_FOR_PLAYERS', 'IN_PROGRESS', 'COMPLETE']
  },
  players: [
    {
      team: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        validate: {
          validator: async function(v) {
            const user = await User.findOne({ _id: v })
            if (!user) throw 'User does not exist' // this message overridden by the message below
          },
          message: 'User does not exist'
        }
      }
    }
  ]
})
gameMatchSchema.methods = {
  addPlayers: async function(players) {
    const updatedPlayers = this.players.concat(
      players
        .filter(
          p =>
            this.players.findIndex(mp => mp.get('user').equals(p.userId)) === -1
        )
        .map(({ userId, team }) => ({ user: userId, team }))
    )
    this.set({ players: updatedPlayers })
    return this.save()
  },

  removePlayers: async function(playerIds) {
    const updatedPlayers = this.players.filter(
      player => !playerIds.includes(player.get('user').toString())
    )
    this.set({ players: updatedPlayers })
    return this.save()
  },

  setPlayerStats: async function(userId, statsMap) {
    const player = this.players.find(player =>
      player.get('user').equals(userId)
    )
    player.set({
      statsMap: {
        ...player.toObject().statsMap,
        ...statsMap
      }
    })
    await this.save()
    return player
  }
}
gameMatchSchema.index({ 'players.user': 1, _id: 1 }, { unique: true })

const GameMatchModel = mongoose.model('GameMatchModel', gameMatchSchema)

export const models = gameTitles
  .map(game => {
    const schema = new mongoose.Schema(
      {
        players: [{ statsMap: game.schema.statsMap }],
        // static title key
        title: {
          type: String,
          required: true,
          enum: [game.title],
          default: game.title
        }
      },
      options
    )
    const statsKeys = Object.keys(game.schema.statsMap)
    const achievementKeys = Object.keys(game.schema.achievementsMap)
    const { documentation } = gameTitleMap[game.title]

    schema
      .path('players')
      .schema.virtual('stats')
      .get(function() {
        return statsKeys.map(key => ({
          key,
          value: this.statsMap[key],
          ...documentation.statsMap[key]
        }))
      })

    schema
      .path('players')
      .schema.virtual('achievements')
      .get(function() {
        return achievementKeys.map(key => ({
          key,
          value: this.achievementsMap[key],
          ...documentation.achievementsMap[key]
        }))
      })

    schema.statics = {
      findFiltered: async function(filters = []) {
        const finder = this.find()
        return filters
          .map(({ field, equals }) => ({
            field: field === 'id' ? '_id' : field,
            equals
          }))
          .reduce(
            (finder, { field, equals }) => finder.where(field).equals(equals),
            finder
          )
      }
      // findUserMatches: async function(userId, filters = []) {
      // const finder = this.find({
      // 'players.user': userId
      // })
      // const matches = await filters
      // .map(({ field, equals }) => ({
      // field: field === 'id' ? '_id' : field,
      // equals
      // }))
      // .reduce(
      // (finder, { field, equals }) => finder.where(field).equals(equals),
      // finder
      // )
      // return matches
      // }
    }

    const model = GameMatchModel.discriminator(
      `${game.title}.GameMatchModel`,
      schema
    )

    return [game.title, model]
  })
  .reduce(tupleToObject, {})
