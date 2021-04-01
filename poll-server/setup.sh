source .env

docker run --publish 5432:5432 --env-file ".env" --detach --name postgres postgres:latest

sleep 5s

CONTAINER_ID="$(docker container ps --filter name=postgres --quiet)"

docker cp ./db.sql $CONTAINER_ID:/schema.sql

docker exec $CONTAINER_ID bash -c "psql -d quiz --username=$POSTGRES_USER -f /schema.sql"