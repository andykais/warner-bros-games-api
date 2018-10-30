import * as mongoose from 'mongoose'
import { gameTitles, gameTitleMap } from '../../game-titles'
import { tupleToObject } from '../../util/array'

const options = { discriminatorKey: 'kind', collection: 'userGameTitleModel' }

const userGameSchema = new mongoose.Schema({}, options)
// technically this should be awaited
userGameSchema.index({ user: 1, title: 1 }, { unique: true })
export const UserGameModel = mongoose.model('UserGameTitle', userGameSchema)

export const models = gameTitles
  .map(game => {
    const schema = new mongoose.Schema(
      {
        ...game.schema,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User'
        },
        // `discriminatorKey` could be used to determine a game's title, but it is messy
        // instead, this is effectively a static field on this schema.
        // the tradeoff is this will take up more space
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

    schema.virtual('stats').get(function() {
      return statsKeys.map(key => ({
        key,
        value: this.statsMap[key],
        ...documentation.statsMap[key]
      }))
    })

    schema.virtual('achievements').get(function() {
      return achievementKeys.map(key => ({
        key,
        value: Boolean(this.achievementsMap[key]),
        ...documentation.achievementsMap[key]
      }))
    })

    schema.methods = {
      setStats: async function(statsMap) {
        this.set({
          statsMap: {
            ...this.statsMap.toObject(),
            ...statsMap
          }
        })
        return this.save()
      },

      addAchievement: async function(achievement) {
        this.set({
          achievementsMap: {
            ...this.achievementsMap.toObject(),
            [achievement]: true
          }
        })
        return this.save()
      }
    }

    const modelName = `${game.title}.UserGameTitle`
    const model = UserGameModel.discriminator(modelName, schema)
    return [game.title, model]
  })
  .reduce(tupleToObject, {})
