export const title = 'smashBros'

export const schema = {
  stats: {
    kos: {
      type: Number,
      default: 0
    },
    longestWinStreak: Number
  },
  achievements: {
    consecutiveWins5: Boolean
  }
}

export const documentation = {
  stats: {
    kos: {
      name: 'KOs',
      description: 'Total Knockouts'
    },
    longestWinStreak: {
      name: 'Longest Win Streak',
      description: 'Longest Win Streak'
    }
  },
  achievements: {
    consecutiveWins5: {
      name: 'Five Consecutive Win-streak',
      description: 'Achieved when win five online matches in a row'
    }
  }
}
