#!/bin/bash
mongoimport \
  --db tournamentsFranceDB \
  --collection clubs \
  --file /docker-entrypoint-initdb.d/clubs.json \
  --jsonArray
