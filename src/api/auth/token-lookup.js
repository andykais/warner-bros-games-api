import * as jwt from './token'

export const authenticationTokenLookup = req => {
  const tokenStr = req.headers.authorization || ''
  const token = tokenStr.replace('Bearer ', '')
  if (token) {
    const payload = jwt.verify(token)
    console.log(payload)
    if (!payload) {
      return {}
    } else if (payload.role === 'developer') {
      return { authorization: payload }
    } else if (payload.role === 'user') {
      // lookup user in mongodb
      return { authorization: payload, user: null }
    } else {
      throw new Error(`Unexpected user token type: ${payload.user}`)
    }
  }
  return {}
}
