export const title = 'chess'

export const schema = {
  statsMap: {
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    }
  },
  achievementsMap: {
    castling: Boolean,
    pawnPromotion: Boolean
  }
}

export const documentation = {
  statsMap: {
    wins: {
      name: 'Wins',
      description: 'Total Wins'
    },
    losses: {
      name: 'Losses',
      description: 'Total Losses'
    }
  },
  achievementsMap: {
    castling: {
      name: 'Castling Maneuver',
      description: 'Perform a castling manuever'
    },
    pawnPromotion: {
      name: 'Pawn Promotion',
      description:
        'Move your pawn to the other side of the board and promote it to another piece'
    }
  }
}
