#!/bin/bash

cd $(dirname $(dirname $0))
project_name=warner-bros-games-api

docker-compose \
  --project-name $project_name \
  up
