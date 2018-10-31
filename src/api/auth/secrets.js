import * as crypto from 'crypto'
import { promisify } from 'util'
import { gameTitles } from '../../game-titles'
import { config } from '../../config'

const randomBytes = promisify(crypto.randomBytes)

export const secrets = {}

export const initSecrets = async () => {
  for (const game of gameTitles) {
    const clientId = Buffer.from(game.title, 'utf8').toString('hex')
    const clientSecret = await randomBytes(config.gameSecrets.byteLength)
    secrets[clientId] = clientSecret.toString('hex')
  }
}
