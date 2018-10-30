import jwt from 'jsonwebtoken'
import { config } from '../../config'

/* NOTE
 * This is an ever-growing list of permissions for each token signed. In reality, this should probably live in
 * a redis store with expiration times, so that it can take care of its own cleanup.
 */
const tokens = {}

const sign = ({ id, role, scope }) => {
  const payloadToSign =
    config.mode === 'development' ? { id, role, scope } : { id }
  // in production, we want to control as much of the information as possible. In development, easier is better
  const token = jwt.sign(payloadToSign, config.tokens.secret)
  tokens[token] = { id, role, scope }
  return token
}

export const verify = tokenStr => {
  const payload = jwt.verify(tokenStr, config.tokens.secret)
  // this allows the developer to reuse a token even after the server restarts
  if (config.mode === 'development') return payload
  // only in production will we care if someone is using a token signed from somewhere else
  if (tokens[tokenStr]) return tokens[tokenStr]
  throw new Error('token does not exist.')
}

export const createGameDeveloperToken = ({ gameTitle }) => {
  return sign({ id: gameTitle, role: 'developer', scope: [gameTitle] })
}

export const createUserToken = ({ id }) => {
  return sign({ id, role: 'user', scope: ['user'] })
}
