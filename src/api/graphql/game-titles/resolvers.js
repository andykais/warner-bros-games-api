import { gameTitles } from './game-schemas'

const authorizeGameDeveloper = (title, { user, scope }) => {
  if (!user || user.role !== 'developer' || !user.scope.includes(title)) {
    throw new Error(
      'Unauthorized! You do not have proper permissions to access this field.'
    )
  }
}

const gameTitleResolvers = gameTitles.map(({ title }) => {
  const mutationType = `${title}Mutation`
  return {
    [mutationType]: {
      // addStat: (title, args, ctx) => {
      // console.log(ctx)
      // return true
      // },
      // addAchievement: (title, args, ctx) => {
      // return true
      // }
    },
    GameMutation: {
      [title]: () => title
    }
  }
})

const rootResolver = {
  Mutation: {
    gameTitle: () => []
  }
}

export const resolvers = [...gameTitleResolvers, rootResolver]
