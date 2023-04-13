#!/bin/bash

trap ctrl_c INT

function ctrl_c() {
    echo "** Cleaning up"

    # Some cleaning up

    lsof -i:3001 -t | xargs -r sudo kill
    lsof -i:3000 -t | xargs -r sudo kill
}


POSTGRES_DOCKER_NAME=postgresql_coreapp
DATABASE_PROVIDER=postgresql
DATABASE_USER=posgresql
DATABASE_PASSWORD=postgresql
DATABASE_NAME=postgresql
DATABASE_HOST=localhost

DATABASE_CACHE_DIR=$(pwd)/.dbdata

echo "Spinning a postgresql instance..."

if [ $( docker ps -a -f name=$POSTGRES_DOCKER_NAME | wc -l ) -eq 2 ]; then
    docker start $POSTGRES_DOCKER_NAME
else 
    docker run --name $POSTGRES_DOCKER_NAME -e POSTGRES_DB=$DATABASE_NAME -e POSTGRES_USER=$DATABASE_USER -e POSTGRES_PASSWORD=$DATABASE_PASSWORD -p 5432:5432 -v $DATABASE_CACHE_DIR:/var/lib/postgresql/data -d postgres:12
fi

echo "Launching app..."

DATABASE_PROVIDER=$DATABASE_PROVIDER DATABASE_HOST=$DATABASE_HOST DATABASE_NAME=$DATABASE_NAME DATABASE_PASSWORD=$DATABASE_PASSWORD DATABASE_USER=$DATABASE_USER yarn dev

#sleep infinity
