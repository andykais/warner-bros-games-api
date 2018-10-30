import * as jwt from './token'
import { models } from '../../database/models'

export const authenticationTokenLookup = async req => {
  const tokenStr = req.headers.authorization || ''
  const token = tokenStr.replace('Bearer ', '')
  if (token) {
    const payload = jwt.verify(token)
    if (payload.role === 'developer') {
      return { authorization: payload }
    } else if (payload.role === 'user') {
      const user = await models.User.findOne({ _id: payload.id })
      return { authorization: payload, user: user || undefined }
    } else {
      throw new Error(`Unexpected user token type: ${payload.user}`)
    }
  }
  return {}
}
