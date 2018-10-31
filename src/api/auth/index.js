import * as express from 'express'
import * as bodyParser from 'body-parser'
import { secrets } from './secrets'
import { config } from '../../config'
import * as jwt from './token'
import { models } from '../../database/models'

export const router = express.Router()

router.use(bodyParser.json())

// developer authorization token
router.post('/developer', (req, res) => {
  const { client_id, client_secret } = req.body
  if (secrets[client_id] === client_secret) {
    const gameTitle = Buffer.from(client_id, 'hex').toString()
    const token = jwt.createGameDeveloperToken({ gameTitle })
    res.send({ token })
  } else {
    res.sendStatus(401)
  }
})

/* NOTE
 * In production this endpoint would NEVER be exposed like this.
 * Likely, this endpoint would be hidden behind a proxy where developers can only access games they own.
 * That required permissions on secrets and another set of users that I felt was overkill for this project.
 * The purpose of the auth2 server-to-server flow is to demonstrate how one server may keep many different
 * developer teams in check. It is not necessarily secure.
 */
router.get('/developer', (req, res) => {
  const namedSecrets = Object.keys(secrets).map(hexKey => ({
    gameTitle: Buffer.from(hexKey, 'hex').toString(),
    clientId: hexKey,
    clientSecret: secrets[hexKey]
  }))
  const htmlList = namedSecrets
    .map(
      ({ gameTitle, clientId, clientSecret }) =>
        `<html>
    <head>
      <style>
        body { font-family: monospace; }
        ul { list-style: none; }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          background-color: lavender;
          padding: 10px 5px;
        }
      </style>
    </head>
    <body>
      <ul>
        <li>
          <h2>${gameTitle}</h2>
          <div><strong>Client Id</strong> <code><pre>${clientId}</pre></code></div>
          <div><strong>Client Secret</strong>
              <code><pre>${clientSecret}</pre></code>
          </div>
        </li>
      </ul>
        </body>
      </html>`
    )
    .join('\n')
  res.send(htmlList)
})

router.post('/user', async (req, res) => {
  const { email, password } = req.body
  const user = await models.User.findOne({ email, password })
  if (user) {
    const token = jwt.createUserToken(user)
    res.send({ token })
  } else {
    res.sendStatus(401)
  }
})
/*
 * idea for auth:
 * users can login as well as api developers
 * users login and can modify their account but not stats, achievements & matches
 * developers authenticate and can modify game specific stats, achievements & matches
 *
 * auth flow:
 * server has list of applications (games/ folder + admin). It generates a list of id & secret pairs available
 * at an endpoint
 * developer gets secret & id from somewhere (web page that rotates secret)
 * developer's app sends id & secret to /auth, if their secret matches my secret, I create jwt signed with secret
 *
 * const secrets = [
 *  'smashBros_client_id': 'secret'
 * ]
 *
 */
