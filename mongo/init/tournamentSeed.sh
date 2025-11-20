#!/bin/bash
mongoimport \
  --db tournamentsFranceDB \
  --collection tournaments \
  --file /docker-entrypoint-initdb.d/tournaments.json \
  --jsonArray
