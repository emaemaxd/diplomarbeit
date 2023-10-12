#!/usr/bin/env bash
docker container prune --force
docker image prune --force
docker volume prune --force
echo "rmi..."
docker rmi -f $(docker images -q)
