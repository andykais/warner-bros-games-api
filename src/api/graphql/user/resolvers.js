import * as jwt from '../../auth/token'
import { gameTitleMap } from '../../../game-titles'
import { authorizeAccess } from '../../auth/authorize-access'

export const resolvers = [
  {
    UserGameTitle: {
      matchConnection: async (
        { title },
        { filters = [] },
        { user, models }
      ) => {
        return models.gameMatches[title].findFiltered([
          ...filters,
          { field: 'players.user', equals: user.id }
        ])
      }
    },

    UserMutation: {
      update: async (_, args, { user }) => {
        await user.updateOne(args)
        return user
      },
      assignGame: async (_, { title }, { user }) => {
        await user.addGameTitle(title)
        return user.gameTitles()
      },
      removeGame: async (_, { title }, { user }) => {
        await user.removeGameTitle(title)
        return user.gameTitles()
      }
    },

    Mutation: {
      createUser: async (_, args, context) => {
        const user = new context.models.User(args)
        await user.save()
        return user
      },
      deleteUser: (_, args, { authorization, user = {} }) => {
        authorizeAccess(authorization, { id: user ? user.id : null })
        return user.deleteOne()
      },
      user: async (_, args, { authorization, user }) => {
        authorizeAccess(authorization, { id: user ? user.id : null })
        return []
      }
    },

    User: {
      id: user => user._id.toString(),
      gameTitleConnection: (user, { filters }) => {
        return user.gameTitles(filters)
      }
    },
    Query: {
      user: (_, args, { authorization, user }) => {
        authorizeAccess(authorization, { id: user ? user.id : null })
        return user
      }
    }
  }
]
