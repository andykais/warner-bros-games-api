import * as jwt from '../../auth/token'

const authorizeValidUser = (args, { user }) => {
  if (!user || args.id != user.id)
    throw new Error(
      `Unauthorized! You must be signed in with user id '${
        args.id
      }' to modify this account`
    )
}

export const resolvers = [
  {
    Mutation: {
      createUser: (_, args) => {
        // create an actual user
        const userId = 1
        const token = jwt.createUserToken({ userId })
        return { token, user: null }
      },
      updateUser: (_, args, context) => {
        console.log({ args })
        authorizeValidUser(args, context)
      },
      deleteUser: (_, args, context) => {
        authorizeValidUser(args, context)
      }
    }
  }
]
