export const title = 'smashBros'

export const schema = {
  statsMap: {
    kos: {
      type: Number,
      default: 0
    },
    longestWinStreak: {
      type: Number,
      default: 0
    }
  },
  achievementsMap: {
    consecutiveWins5: Boolean
  }
}

export const documentation = {
  statsMap: {
    kos: {
      name: 'KOs',
      description: 'Total Knockouts'
    },
    longestWinStreak: {
      name: 'Longest Win Streak',
      description: 'Longest Win Streak'
    }
  },
  achievementsMap: {
    consecutiveWins5: {
      name: 'Five Consecutive Win-streak',
      description: 'Achieved when win five online matches in a row'
    }
  }
}
