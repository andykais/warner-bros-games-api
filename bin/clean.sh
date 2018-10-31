#!/bin/bash

cd $(dirname $(dirname $0))

docker-compose down --volumes
