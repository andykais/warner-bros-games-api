import * as mongoose from 'mongoose'
import { config } from '../config'

export const db = mongoose.connection

import { models } from './models'
export const initDatabaseConnection = () =>
  new Promise((resolve, reject) => {
    const { host, database } = config.database
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true
    }

    mongoose.connect(
      `mongodb://${host}/${database}`,
      options
    )
    db.on('error', reject)
    db.once('open', () => {
      console.log('Connected to database.')
      resolve()
    })
  })
