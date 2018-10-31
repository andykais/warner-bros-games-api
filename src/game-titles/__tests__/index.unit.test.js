import SimpleSchema from 'simpl-schema'
import { assertGameSchema } from '../../util/game-title.flow'
import { gameTitles } from '../'

// GameSchemaType.validate({ me: true })

const arr: Array<any> = gameTitles

type ValidSchema = {|
  val: number,
  stats: {
    [string]: string
  }
|}

const x = {
  y: 1
}

// const z: ValidSchema = x

describe('game title', () => {
  for (const game of gameTitles) {
    test(`'${game.title}' have proper schema definition`, () => {
      assertGameSchema(game)
    })
  }
})
