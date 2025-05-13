#!/bin/bash

echo "Creating Redis Cluster..."

NODES="redis1:5000 redis2:5001 redis3:5002 redis4:5003 redis5:5004 redis6:5005"

docker exec -it redis1 redis-cli --cluster create $NODES --cluster-replicas 1 --cluster-yes
