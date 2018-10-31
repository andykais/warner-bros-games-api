# GraphQL User Record API

## Usage

The [./bin](./bin) folder has scripts to use the docker files. If you are on windows (sorry for now!) just
open up the files and run the docker commands yourself. Simplest way to get started is

```bash
./bin/develop.sh
# inside the docker container run:
$ npm run develop
# in your browser open `http://localhost:3000/graphql`
```

One last step is to get an authorization token (`jsonwebtoken`) from one of the auth endpoints.
This is detailed in the [auth section](auth) of the wiki.

Now you can start querying using GraphQL.

## Requirements

- [docker](https://www.docker.com/get-started)
- [docker-compose](https://www.docker.com/get-started)


## Project Structure

Source code lives in the `src` folder. In Node.js, `index.js` is usually the 'entrypoint' for a folder. That
is how this project is structured. There are three main sections to the project: `api`, `database`, &
`game-titles`

I designed this server to act like a user record server for [Steam](https://store.steampowered.com/) might behave.
There are many games, and users may own some or none of the games. A game a user does have access to will
store game stats, achievements, matches the user participated in and stats specific to a game match.

##### How new titles are added:

Game stat & achievement schemas live in [./src/game-titles](./src/game-titles). The idea is that developers
using the platform will create a new schema, create a pull request against the repository, then developers of this
user record API can approve new incoming game titles. GraphQL & MongoDB schemas are both generated from the
game title schemas.

#### API

The graphql structure and auth routes are defined here. The project has 5 routes.

- `POST` `/auth/user` - get auth token for traditional user
- `POST` `/auth/developer` - get auth token for game server developers
- `GET` `/auth/developer` - view the game title specific id's and secrets.
- `POST` `/graphql` - GraphQL API endpoint (all data is queried and mutated on this route)
- `GET` `/graphql` - GraphQL Playground (developer IDE)

#### Database

MongoDB is the database and [mongoosejs](https://mongoosejs.com) is the database driver.

#### Game Titles

Game titles describe statistics & achievements for each user. The schema is defined in a `mongoosejs` format,
which is used within the database models & used to generate GraphQL types.

#### Examples

I have an [./examples](examples) folder which shows some example queries you can make against the server.

## Auth

For game server developers, this server has an public client id and a private client secret. This is what the
`GET` `/auth/developer` route will display. The developer will store these somewhere save and hit `POST`
`/auth/developer` to get a token to use on the api. The token needs to be renewed when it expires (currently
it expires after [24 hours](https://github.com/andykais/warner-bros-games-api/blob/dev/src/config.js#L14)).
A token will give a developer access to that game title, but bar access to the rest of the game titles. This
prevents developers from meddling with other game title matches, or viewing users in other game titles.
There is a screen recording that shows how this is accomplished in
[./example-queries/screen-record-developer-flow.mp4](./example-queries/screen-record-developer-flow.mp4).
```graphql
# game server developer is limited to
{
  gameTitle {
    smashBros {
      ...
    }
  }
}
```

For traditional users (most likely users of the 'steam-like' client), auth is handled in the traditional
`POST` `/auth/user` `{"email": "user", "password":"pass"}`. Users have access to data surrounding their
user but not the ability to start matches or set stats & achievements.
There is a screen recording that shows how this is accomplished in
[./example-queries/screen-record-user-flow.mp4](./example-queries/screen-record-user-flow.mp4).

```graphql
# traditional user is limited to
{
  user {
    ...
  }
}
```

##### Incomplete parts of developer auth

- developers should be saved as users with developer access in the database.
- `GET` `/auth/developer` should only show game titles that a developer user owns, not all titles.

##### Incomplete parts of user auth

- passwords are stored in plaintext in the database
## GraphQL

I chose GraphQL over traditional REST endpoints because of the re-usability I can take advantage of, and
because in this project models & types are generated when the server starts. GraphQL, besides being well
structured, also gives a schema developers can poke around in, which is a huge win for a developer new to a
project trying to understand how to get, update & delete values.

## Assumptions

- Users are created on the main "steam" site, therefore a single game does not have authority to modify or
  create users, only stats & achievements.
- A game dev team should only modify stats & achievements about their own game.
- there is a real time game server setting stats & achievements, it therefore is where a calculates stats &
  awards achievements
  - as a secondary note, it is possible that a local game not connected to a server can still set stats &
    achievements if it has the proper client id & secret
- a user cannot be logged into more than 1 machine at a time
- achievements cannot be taken away, and are booleans
- stats are scalar values (count, time, string)
- users are the only ones who modify their personal information (if a developer needs to, then they need the
  user's username and password)
