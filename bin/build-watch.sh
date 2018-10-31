#!/bin/bash

cd $(dirname $(dirname $0))
project_name=warner-bros-games-api

command=${1-sh}

docker-compose \
  --project-name $project_name \
  run \
  user_record_api \
  npm run build:watch
