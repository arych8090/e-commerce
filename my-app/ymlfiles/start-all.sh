#!/bin/bash

set -e

echo "the server are starting wait"
docker compose -f ymlfiles/docker-compose.yml up -d --build

echo "waiting for the redises to be made"
sleep 10

echo "the redises are being initilized"
NODES="redis1:5000 redis2:5001 redis3:5002 redis4:5003 redis5:5004 redis6:5005"
docker exec -it redis1 redis-cli --cluster create $NODES --cluster-replicas 1 --cluster-yes
echo "the redises are initilized"
echo "the srever are made"

