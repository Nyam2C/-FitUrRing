#!/bin/bash

git pull -a
docker-compose down
docker-compose up -d