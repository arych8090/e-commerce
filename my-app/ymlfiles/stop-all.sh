#!/bin/bash 

set -e

echo "the server are being stopped"
docker compose -f ymlfiles/docker-compose.yml down 
ech "the server have stopped"