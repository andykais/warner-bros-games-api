import { gameTitles, gameTitleMap } from '../../../game-titles'
import { authorizeAccess } from '../../auth/authorize-access'

const gameTitleResolvers = gameTitles.map(({ title, graphqlTypeNames }) => {
  const {
    mutationType,
    statInputType,
    achievementEnumType,
    gameUserMutationType,
    userMatchMutationType,
    queryType
  } = graphqlTypeNames

  return {
    PlayerUserInfo: {
      id: user => user._id.toString()
    },
    Player: {
      userInfo: player => {
        return player.get('user')
      },
      team: player => player.get('team'),
      stats: player => player.get('stats')
    },
    Match: {
      status: player => player.get('status')
    },
    [userMatchMutationType]: {
      setStat: async ({ userGameTitle, match }, args) => {
        const player = await match.setPlayerStats(userGameTitle.user.id, args)
        return player.get('stats')
      }
    },
    [gameUserMutationType]: {
      setStat: async (userGameTitle, args, { models }) => {
        await userGameTitle.setStats(args)
        return userGameTitle.get('stats')
      },
      addAchievement: async (userGameTitle, { achievement }, { models }) => {
        await userGameTitle.addAchievement(achievement)
        return userGameTitle.get('achievements')
      },
      match: async (userGameTitle, { id }, { models }) => {
        // only return a match if it contains the user we queried
        const match = await models.gameMatches[title].findOne({
          _id: id,
          players: { $elemMatch: { user: userGameTitle.user.id.toString() } }
        })
        return match ? { userGameTitle, match } : null
      }
    },
    MatchMutations: {
      update: async (match, { status }, { models }) => {
        match.set({ status })
        await match.save()
        return match
      },
      assignPlayers: async (match, { players }, { models }, info) => {
        await match.addPlayers(players)
        return match.players
      },
      removePlayers: async (match, { playerIds }, { models }) => {
        await match.removePlayers(playerIds)
        return match.players
      }
    },
    [mutationType]: {
      user: async (_, { id }, { models }) => {
        const gameTitle = await models.userGameTitles[title]
          .findOne({ user: id })
          .populate('user')
        return gameTitle
      },
      match: async (_, { id }, { models }) => {
        const [match] = await models.gameMatches[title].find({ _id: id })
        return match
      },
      createMatch: async (_, { players }, { models }) => {
        const match = new models.gameMatches[title]({
          players: players.map(({ userId, team }) => ({
            team,
            user: userId
          }))
        })
        await match.save()
        // populating an array of users should be moved into a deferred resolver
        await match.populate('players.user').execPopulate()
        return match
      },
      deleteMatch: async (_, { id }, { models }) => {
        const match = await models.gameMatches[title].findByIdAndRemove(id)
        return match
      }
    },
    GameMutation: {
      [title]: (_, args, { authorization }) => {
        authorizeAccess(authorization, { scope: title })
        return []
      }
    },

    [queryType]: {
      matchConnection: (_, { filters = [] }, { authorization, models }) => {
        return models.gameMatches[title].findFiltered(filters)
      }
    },
    GameQuery: {
      [title]: (_, args, { authorization }) => {
        authorizeAccess(authorization, { scope: title })
        return []
      }
    }
  }
})

const rootResolver = {
  Mutation: {
    gameTitle: () => []
  },
  Query: {
    gameTitle: () => []
  }
}

export const resolvers = [...gameTitleResolvers, rootResolver]
