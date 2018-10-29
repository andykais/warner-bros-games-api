import jwt from 'jsonwebtoken'
import { config } from '../../config'

/* NOTE
 * This is an ever-growing list of permissions for each token signed. In reality, this should probably live in
 * a redis store with expiration times, so that it can take care of its own cleanup.
 */
const tokens = {}

const sign = ({ id, role, scope }) => {
  const token = jwt.sign({ id }, config.tokens.secret)
  tokens[token] = { id, role, scope }
  return token
}

export const verify = tokenStr => {
  const payload = jwt.verify(tokenStr, config.tokens.secret)
  if (tokens[tokenStr]) return tokens[tokenStr]
  throw new Error('token does not exist.')
}

export const createGameDeveloperToken = ({ gameTitle }) => {
  return sign({ id: gameTitle, role: 'developer', scope: [gameTitle] })
}

export const createUserToken = ({ userId }) => {
  return sign({ id: userId, role: 'user', scope: ['user'] })
}
