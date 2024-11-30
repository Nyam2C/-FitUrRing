#!/bin/bash
set -e

mongosh --eval "
  db = db.getSiblingDB('admin');
  db.createUser({
    user: '${MONGO_INITDB_ROOT_USERNAME}',
    pwd: '${MONGO_INITDB_ROOT_PASSWORD}',
    roles: [ { role: 'root', db: 'admin' } ]
  });

  db = db.getSiblingDB('${MONGO_INITDB_DATABASE}');
  db.createUser({
    user: '${MONGO_INITDB_ROOT_USERNAME}',
    pwd: '${MONGO_INITDB_ROOT_PASSWORD}',
    roles: [ { role: 'dbOwner', db: '${MONGO_INITDB_DATABASE}' } ]
  });
"