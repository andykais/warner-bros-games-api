import { config } from '../../config'

class AuthorizationError extends Error {}

export const authorizeAccess = (authorization, { scope, id }) => {
  if (!authorization) {
    throw new AuthorizationError('No authorization header provided.')
  } else if (id !== undefined && authorization.id !== id) {
    throw new AuthorizationError(`Unauthorized access to Id '${id}'.`)
  } else if (scope !== undefined && !authorization.scope.includes(scope)) {
    throw new AuthorizationError(`Unauthorized access to scope '${scope}'`)
  }
}
