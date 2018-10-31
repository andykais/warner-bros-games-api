# GraphQL User Record API

[![Build Status](https://travis-ci.com/andykais/warner-bros-games-api.svg?branch=master)](https://travis-ci.com/andykais/warner-bros-games-api)

This is an API for storing, updating, and reading user game stats, achievements, and matches.

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
This is detailed in the [auth section](https://github.com/andykais/warner-bros-games-api/wiki/Auth-explained) of the [wiki](https://github.com/andykais/warner-bros-games-api/wiki).

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

The [./example-queries](./example-queries) folder shows some example queries you can make against the server.
There are also two screencasts describing the
[user auth flow](./example-queries/screen-record-user-flow.mp4) and the
[developer auth flow](./example-queries/screen-record-developer-flow.mp4).

## Contributing Game Titles

If a developer wishes to add their game to the service, they need to create a game schema in the
[./src/game-titles](./src/game-titles) folder. Use the other games there for reference. After adding your
game and running `npm run test`, create a PR. This will run tests on again on `travis-ci` and then a
contributor will approve the game title.
